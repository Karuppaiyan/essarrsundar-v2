'use client';

import { useEffect, useState, useCallback } from 'react';
import { client, type SiteSetting } from '../lib/amplify-client';
import Modal from '@/components/admin/Modal';

const DEFAULT_SETTINGS = [
  { key: 'company_name',    label: 'Company Name',      value: 'ESS ARR ENTERPRISES' },
  { key: 'phone_primary',   label: 'Primary Phone',     value: '+91 8750335073' },
  { key: 'phone_whatsapp',  label: 'WhatsApp Number',   value: '919911335073' },
  { key: 'email_sales',     label: 'Sales Email',       value: 'sales@essarr.com' },
  { key: 'address',         label: 'Address',           value: 'Delhi, Mumbai, Bangalore, Goa, Kolkata, Hyderabad' },
  { key: 'tagline',         label: 'Tagline',           value: 'Premium AV Equipment Rentals' },
];

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

function focusOn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = 'var(--accent-purple)';
}
function focusOff(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = 'var(--metal-dark)';
}

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<SiteSetting | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');
  const [seedLoading, setSeedLoading] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.models.SiteSetting.list();
      setSettings(res.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleEdit = (s: SiteSetting) => {
    setEditing(s);
    setEditValue(s.value);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await client.models.SiteSetting.update({ id: editing.id, value: editValue });
      showToast('✓ Setting updated');
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await client.models.SiteSetting.delete({ id });
    showToast('✓ Setting deleted');
    load();
  };

  const handleSeedDefaults = async () => {
    setSeedLoading(true);
    try {
      const existingKeys = settings.map(s => s.key);
      const toCreate = DEFAULT_SETTINGS.filter(d => !existingKeys.includes(d.key));
      await Promise.all(toCreate.map(s => client.models.SiteSetting.create(s)));
      showToast(`✓ Seeded ${toCreate.length} default settings`);
      load();
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, letterSpacing: 1, boxShadow: '0 8px 24px rgba(153,69,255,0.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Site Settings</h1>
          <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>Key-value configuration used across the site</p>
        </div>
        <button onClick={handleSeedDefaults} disabled={seedLoading} style={{ padding: '10px 18px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: 8, color: 'var(--accent-green)', fontSize: 12, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
          {seedLoading ? 'Seeding…' : '⬇ Seed Defaults'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-dim)' }}>
          <div style={{ width: 36, height: 36, border: '3px solid var(--metal-dark)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading…
        </div>
      ) : settings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, border: '1px dashed var(--metal-dark)', borderRadius: 12, color: 'var(--text-dim)' }}>
          <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>⚙</div>
          <p style={{ fontSize: 13, marginBottom: 16 }}>No settings yet.</p>
          <button onClick={handleSeedDefaults} style={{ padding: '10px 20px', background: 'rgba(153,69,255,0.15)', border: '1px solid var(--accent-purple)', borderRadius: 8, color: 'var(--accent-purple)', fontSize: 12, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
            Seed Default Settings
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {settings.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'linear-gradient(135deg, var(--carbon-medium), var(--carbon-dark))', border: '1px solid var(--metal-dark)', borderRadius: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: 'var(--accent-purple)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{s.label ?? s.key}</div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-mono, monospace)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>key: <code style={{ color: 'var(--accent-cyan)' }}>{s.key}</code></div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => handleEdit(s)} style={{ padding: '7px 14px', background: 'rgba(0,168,255,0.15)', border: '1px solid rgba(0,168,255,0.3)', borderRadius: 6, color: 'var(--accent-blue)', fontSize: 11, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Edit</button>
                <button onClick={() => handleDelete(s.id)} style={{ padding: '7px 14px', background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.3)', borderRadius: 6, color: 'var(--accent-red)', fontSize: 11, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal open={!!editing} title={`Edit: ${editing?.label ?? editing?.key}`} onClose={() => setEditing(null)} width={460}>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 20 }}>
            <label style={LS}>Key</label>
            <div style={{ ...IS, opacity: 0.6, cursor: 'default', fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{editing?.key}</div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={LS}>Value *</label>
            <textarea rows={3} required style={{ ...IS, resize: 'vertical', minHeight: 80 } as React.CSSProperties} value={editValue} onChange={e => setEditValue(e.target.value)} onFocus={focusOn} onBlur={focusOff} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setEditing(null)} style={{ padding: '10px 18px', background: 'none', border: '1px solid var(--metal-dark)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: saving ? 'var(--metal-dark)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontFamily: 'inherit', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
              {saving ? 'Saving…' : 'Update Setting'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
