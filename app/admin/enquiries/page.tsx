'use client';

import { useEffect, useState, useCallback } from 'react';
import { client, type Enquiry, type EnquiryStatus } from '@/lib/amplify-client';
import Modal from '@/components/admin/Modal';

const STATUS_CONFIG: Record<EnquiryStatus, { label: string; color: string; bg: string }> = {
  new:       { label: 'New',       color: 'var(--accent-cyan)',   bg: 'rgba(0,255,255,0.1)' },
  contacted: { label: 'Contacted', color: 'var(--accent-purple)', bg: 'rgba(153,69,255,0.1)' },
  closed:    { label: 'Closed',    color: 'var(--accent-green)',  bg: 'rgba(0,255,136,0.1)' },
};

const IS: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'var(--carbon-dark)',
  border: '1px solid var(--metal-dark)',
  borderRadius: 8, color: 'var(--text-primary)',
  fontSize: 13, fontFamily: 'inherit', outline: 'none',
  transition: 'border-color 0.2s',
};
const LS: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700,
  color: 'var(--text-dim)', letterSpacing: 2,
  textTransform: 'uppercase', marginBottom: 6,
};

function focusOn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--accent-purple)';
}
function focusOff(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--metal-dark)';
}

export default function EnquiriesAdminPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [search, setSearch]     = useState('');
  const [viewTarget, setViewTarget] = useState<Enquiry | null>(null);
  const [notes, setNotes]       = useState('');
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [toast, setToast]       = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newForm, setNewForm]   = useState({ productName: '', customerName: '', phone: '', message: '' });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.models.Enquiry.list();
      const sorted = (res.data ?? []).sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
      setEnquiries(sorted);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openView = (e: Enquiry) => {
    setViewTarget(e);
    setNotes(e.notes ?? '');
  };

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    await client.models.Enquiry.update({ id, status });
    showToast(`✓ Status updated to "${status}"`);
    load();
    if (viewTarget?.id === id) setViewTarget(prev => prev ? { ...prev, status } : prev);
  };

  const handleSaveNotes = async () => {
    if (!viewTarget) return;
    setSaving(true);
    try {
      await client.models.Enquiry.update({ id: viewTarget.id, notes });
      showToast('✓ Notes saved');
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await client.models.Enquiry.delete({ id: deleteTarget.id });
    showToast('✓ Enquiry deleted');
    setDeleteTarget(null);
    if (viewTarget?.id === deleteTarget.id) setViewTarget(null);
    load();
  };

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await client.models.Enquiry.create({
        productName:  newForm.productName,
        customerName: newForm.customerName,
        phone:        newForm.phone,
        message:      newForm.message,
        status:       'new',
      });
      showToast('✓ Enquiry created');
      setCreateOpen(false);
      setNewForm({ productName: '', customerName: '', phone: '', message: '' });
      load();
    } finally {
      setSaving(false);
    }
  };

  const visible = enquiries.filter(e => {
    const matchStatus = !filterStatus || e.status === filterStatus;
    const matchSearch = !search ||
      (e.customerName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (e.productName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (e.phone ?? '').includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, letterSpacing: 1, boxShadow: '0 8px 24px rgba(153,69,255,0.4)', animation: 'slideUp 0.3s ease' }}>
          {toast}
          <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}`}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Enquiries</h1>
          <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{enquiries.length} total — {enquiries.filter(e => e.status === 'new').length} new</p>
        </div>
        <button onClick={() => setCreateOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', border: 'none', borderRadius: 8, color: '#fff', padding: '11px 20px', fontSize: 13, fontFamily: 'inherit', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 16px rgba(153,69,255,0.3)' }}>
          + New Enquiry
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ value: '', label: 'All' }, ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))].map(opt => (
          <button key={opt.value} onClick={() => setFilterStatus(opt.value)} style={{
            padding: '7px 16px', borderRadius: 20,
            background: filterStatus === opt.value ? 'rgba(153,69,255,0.2)' : 'transparent',
            border: filterStatus === opt.value ? '1px solid var(--accent-purple)' : '1px solid var(--metal-dark)',
            color: filterStatus === opt.value ? 'var(--accent-purple)' : 'var(--text-secondary)',
            fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
            fontWeight: filterStatus === opt.value ? 700 : 400, letterSpacing: 1, textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}>
            {opt.label}
            {opt.value && (
              <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
                ({enquiries.filter(e => e.status === opt.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input type="text" placeholder="Search by name, product, or phone…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...IS, maxWidth: 360 }} onFocus={focusOn} onBlur={focusOff} />
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-dim)' }}>
          <div style={{ width: 36, height: 36, border: '3px solid var(--metal-dark)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading…
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-dim)', border: '1px dashed var(--metal-dark)', borderRadius: 12, fontSize: 13 }}>
              No enquiries found
            </div>
          ) : visible.map(enq => {
            const status = (enq.status ?? 'new') as EnquiryStatus;
            const sc = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
            return (
              <div key={enq.id} onClick={() => openView(enq)} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                background: 'linear-gradient(135deg, var(--carbon-medium), var(--carbon-dark))',
                border: '1px solid var(--metal-dark)',
                borderLeft: `4px solid ${sc.color}`,
                borderRadius: 10,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = sc.color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--metal-dark)'; (e.currentTarget as HTMLElement).style.borderLeftColor = sc.color; }}
              >
                {/* Status dot */}
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: sc.color, flexShrink: 0 }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {enq.customerName || '(No name)'}
                    </span>
                    <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 20, background: sc.bg, color: sc.color, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                      {sc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
                    📦 {enq.productName}
                  </div>
                  {enq.phone && <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>📞 {enq.phone}</div>}
                </div>

                {/* Date */}
                <div style={{ fontSize: 11, color: 'var(--text-dim)', flexShrink: 0, textAlign: 'right' }}>
                  {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  <div style={{ marginTop: 4, display: 'flex', gap: 6, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                    {(['new','contacted','closed'] as EnquiryStatus[]).map(s => (
                      <button key={s} onClick={() => handleStatusChange(enq.id, s)} style={{
                        padding: '3px 8px', borderRadius: 4, fontSize: 10, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 700, letterSpacing: 0.5,
                        background: status === s ? STATUS_CONFIG[s].bg : 'transparent',
                        border: `1px solid ${status === s ? STATUS_CONFIG[s].color : 'var(--metal-dark)'}`,
                        color: status === s ? STATUS_CONFIG[s].color : 'var(--text-dim)',
                        transition: 'all 0.15s',
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── View / Notes Modal ── */}
      <Modal open={!!viewTarget} title="Enquiry Detail" onClose={() => setViewTarget(null)} width={540}>
        {viewTarget && (() => {
          const status = (viewTarget.status ?? 'new') as EnquiryStatus;
          const sc = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
          return (
            <div>
              {/* Status badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: sc.bg, border: `1px solid ${sc.color}`, color: sc.color, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{sc.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  {viewTarget.createdAt ? new Date(viewTarget.createdAt).toLocaleString('en-IN') : ''}
                </span>
              </div>

              {/* Fields */}
              {[
                { label: 'Customer', value: viewTarget.customerName },
                { label: 'Phone',    value: viewTarget.phone },
                { label: 'Product',  value: viewTarget.productName },
                { label: 'Message',  value: viewTarget.message },
              ].map(f => f.value && (
                <div key={f.label} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'var(--carbon-dark)', padding: '10px 14px', borderRadius: 8, lineHeight: 1.5 }}>{f.value}</div>
                </div>
              ))}

              {/* Status change */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Update Status</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['new','contacted','closed'] as EnquiryStatus[]).map(s => (
                    <button key={s} onClick={() => handleStatusChange(viewTarget.id, s)} style={{
                      flex: 1, padding: '8px', borderRadius: 6, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                      background: status === s ? STATUS_CONFIG[s].bg : 'transparent',
                      border: `1px solid ${status === s ? STATUS_CONFIG[s].color : 'var(--metal-dark)'}`,
                      color: status === s ? STATUS_CONFIG[s].color : 'var(--text-dim)',
                      transition: 'all 0.2s',
                    }}>{STATUS_CONFIG[s].label}</button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 16 }}>
                <label style={LS}>Admin Notes</label>
                <textarea rows={3} style={{ ...IS, resize: 'vertical', minHeight: 80 } as React.CSSProperties} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes — not visible to customer" onFocus={focusOn} onBlur={focusOff} />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                <button onClick={() => setDeleteTarget(viewTarget)} style={{ padding: '10px 16px', background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.3)', borderRadius: 8, color: 'var(--accent-red)', fontSize: 12, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Delete</button>
                <button onClick={handleSaveNotes} disabled={saving} style={{ padding: '10px 24px', background: saving ? 'var(--metal-dark)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontFamily: 'inherit', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
                  {saving ? 'Saving…' : 'Save Notes'}
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ── Create Enquiry Modal ── */}
      <Modal open={createOpen} title="New Enquiry" onClose={() => setCreateOpen(false)} width={480}>
        <form onSubmit={handleCreateEnquiry}>
          {[
            { label: 'Product Name *', key: 'productName', required: true, type: 'text', placeholder: 'e.g. Crystal Series 1.9mm' },
            { label: 'Customer Name',  key: 'customerName', required: false, type: 'text', placeholder: 'Full name' },
            { label: 'Phone Number',   key: 'phone', required: false, type: 'tel', placeholder: '+91 98765 43210' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 16 }}>
              <label style={LS}>{field.label}</label>
              <input required={field.required} type={field.type} style={IS} placeholder={field.placeholder}
                value={(newForm as Record<string, string>)[field.key]}
                onChange={e => setNewForm(f => ({ ...f, [field.key]: e.target.value }))}
                onFocus={focusOn} onBlur={focusOff}
              />
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <label style={LS}>Message</label>
            <textarea rows={3} style={{ ...IS, resize: 'vertical', minHeight: 80 } as React.CSSProperties} placeholder="Customer message or enquiry details…" value={newForm.message} onChange={e => setNewForm(f => ({ ...f, message: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setCreateOpen(false)} style={{ padding: '10px 18px', background: 'none', border: '1px solid var(--metal-dark)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: saving ? 'var(--metal-dark)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontFamily: 'inherit', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
              {saving ? 'Creating…' : 'Create Enquiry'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width={380}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
          Delete enquiry from <strong style={{ color: 'var(--accent-red)' }}>{deleteTarget?.customerName || 'this customer'}</strong>? Cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteTarget(null)} style={{ padding: '10px 18px', background: 'none', border: '1px solid var(--metal-dark)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Cancel</button>
          <button onClick={handleDelete} style={{ padding: '10px 20px', background: 'rgba(255,51,51,0.2)', border: '1px solid rgba(255,51,51,0.5)', borderRadius: 8, color: 'var(--accent-red)', fontSize: 12, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
