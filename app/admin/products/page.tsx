'use client';

import { useEffect, useState, useCallback } from 'react';
import { client, type Product } from '@/lib/amplify-client';
import Modal from '@/components/admin/Modal';

const ACCENT_COLORS = [
  { label: 'Blue',   value: 'var(--accent-blue)' },
  { label: 'Purple', value: 'var(--accent-purple)' },
  { label: 'Cyan',   value: 'var(--accent-cyan)' },
  { label: 'Green',  value: 'var(--accent-green)' },
  { label: 'Red',    value: 'var(--accent-red)' },
];

const CATEGORIES = [
  'LED Wall', 'Crystal Series', 'Spider Series', 'Kinetic Technology',
  'AIR Transparent', 'Hybrid Series', 'Black Marvel Series', '3.9mm LED Wall',
  'Rotating LED Screen', 'LED Sphere', 'Seamless LFD Wall', 'LED Standees',
  'LED TV Screens', 'Interactive & Multi Touch', 'Lighting Equipments',
  'Sound Equipment', 'Media Servers', 'Switchers', 'IT Equipments', 'Truss',
];

type FormData = {
  name: string;
  category: string;
  categoryId: string;
  description: string;
  tags: string;        // comma-separated in form, array in DB
  isHot: boolean;
  isActive: boolean;
  icon: string;
  accentColor: string;
  sortOrder: number;
};

const DEFAULT_FORM: FormData = {
  name: '', category: '', categoryId: '',
  description: '', tags: '',
  isHot: false, isActive: true,
  icon: '▣', accentColor: 'var(--accent-blue)', sortOrder: 0,
};

/* ── Shared input style ── */
const IS: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'var(--carbon-dark)',
  border: '1px solid var(--metal-dark)',
  borderRadius: 8, color: 'var(--text-primary)',
  fontSize: 13, fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.2s',
};
const LS: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700,
  color: 'var(--text-dim)', letterSpacing: 2,
  textTransform: 'uppercase', marginBottom: 6,
};
const FG: React.CSSProperties = { marginBottom: 18 };

function focusOn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--accent-purple)';
  e.target.style.boxShadow = '0 0 8px rgba(153,69,255,0.2)';
}
function focusOff(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--metal-dark)';
  e.target.style.boxShadow = 'none';
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm]         = useState<FormData>(DEFAULT_FORM);
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast]       = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  /* ── Load ── */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.models.Product.list();
      const sorted = (res.data ?? []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      setProducts(sorted);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  /* ── Open modal ── */
  const openNew = () => {
    setEditTarget(null);
    setForm(DEFAULT_FORM);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({
      name:        p.name,
      category:    p.category,
      categoryId:  p.categoryId,
      description: p.description ?? '',
      tags:        (p.tags ?? []).join(', '),
      isHot:       p.isHot ?? false,
      isActive:    p.isActive ?? true,
      icon:        p.icon ?? '▣',
      accentColor: p.accentColor ?? 'var(--accent-blue)',
      sortOrder:   p.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  /* ── Save (create / update) ── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name:        form.name,
      category:    form.category,
      categoryId:  form.categoryId || form.category.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
      isHot:       form.isHot,
      isActive:    form.isActive,
      icon:        form.icon,
      accentColor: form.accentColor,
      sortOrder:   form.sortOrder,
    };
    try {
      if (editTarget) {
        await client.models.Product.update({ id: editTarget.id, ...payload });
        showToast('✓ Product updated');
      } else {
        await client.models.Product.create(payload);
        showToast('✓ Product created');
      }
      setModalOpen(false);
      loadProducts();
    } finally {
      setSaving(false);
    }
  };

  /* ── Toggle hot ── */
  const toggleHot = async (p: Product) => {
    await client.models.Product.update({ id: p.id, isHot: !p.isHot });
    showToast(`✓ ${p.name} ${!p.isHot ? 'marked HOT' : 'unmarked'}`);
    loadProducts();
  };

  /* ── Toggle active ── */
  const toggleActive = async (p: Product) => {
    await client.models.Product.update({ id: p.id, isActive: !p.isActive });
    showToast(`✓ ${p.name} ${!p.isActive ? 'activated' : 'deactivated'}`);
    loadProducts();
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await client.models.Product.delete({ id: deleteTarget.id });
    showToast(`✓ Deleted "${deleteTarget.name}"`);
    setDeleteTarget(null);
    loadProducts();
  };

  /* ── Filtered list ── */
  const visible = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !filterCat || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
          color: '#fff', padding: '12px 20px', borderRadius: 10,
          fontSize: 13, fontWeight: 700, letterSpacing: 1,
          boxShadow: '0 8px 24px rgba(153,69,255,0.4)',
          animation: 'slideUp 0.3s ease',
        }}>
          {toast}
          <style>{`@keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:none;opacity:1} }`}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
            Products
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{products.length} total items in inventory</p>
        </div>
        <button onClick={openNew} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
          border: 'none', borderRadius: 8,
          color: '#fff', padding: '11px 20px',
          fontSize: 13, fontFamily: 'inherit',
          fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(153,69,255,0.3)',
          transition: 'all 0.2s',
        }}>
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          type="text" placeholder="Search products…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...IS, maxWidth: 260 }}
          onFocus={focusOn} onBlur={focusOff}
        />
        <select
          value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ ...IS, maxWidth: 220, cursor: 'pointer' }}
          onFocus={focusOn} onBlur={focusOff}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || filterCat) && (
          <button onClick={() => { setSearch(''); setFilterCat(''); }}
            style={{ background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.3)', borderRadius: 8, color: 'var(--accent-red)', padding: '11px 16px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 700, letterSpacing: 1 }}>
            Clear ×
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-dim)' }}>
          <div style={{ width: 36, height: 36, border: '3px solid var(--metal-dark)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading…
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
            <thead>
              <tr style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: 2, textTransform: 'uppercase' }}>
                {['#', 'Product', 'Category', 'Tags', 'Hot', 'Active', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 14px', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)', fontSize: 13 }}>No products found</td></tr>
              ) : visible.map((p, idx) => (
                <tr key={p.id} style={{ fontSize: 13 }}>
                  {/* Wrap each row */}
                  <td style={{ padding: '12px 14px', background: 'var(--carbon-medium)', color: 'var(--text-dim)', borderRadius: '8px 0 0 8px', border: '1px solid var(--metal-dark)', borderRight: 'none', width: 36 }}>{idx + 1}</td>
                  <td style={{ padding: '12px 14px', background: 'var(--carbon-medium)', border: '1px solid var(--metal-dark)', borderLeft: 'none', borderRight: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20, color: p.accentColor ?? 'var(--accent-blue)' }}>{p.icon ?? '▣'}</span>
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 2 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', background: 'var(--carbon-medium)', color: 'var(--text-secondary)', border: '1px solid var(--metal-dark)', borderLeft: 'none', borderRight: 'none', whiteSpace: 'nowrap' }}>{p.category}</td>
                  <td style={{ padding: '12px 14px', background: 'var(--carbon-medium)', border: '1px solid var(--metal-dark)', borderLeft: 'none', borderRight: 'none' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {(p.tags ?? []).slice(0, 3).map(t => (
                        <span key={t} style={{ padding: '2px 8px', background: 'rgba(153,69,255,0.15)', border: '1px solid rgba(153,69,255,0.3)', borderRadius: 4, fontSize: 10, color: 'var(--accent-purple)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', background: 'var(--carbon-medium)', border: '1px solid var(--metal-dark)', borderLeft: 'none', borderRight: 'none' }}>
                    <button onClick={() => toggleHot(p)} title="Toggle HOT" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: p.isHot ? 1 : 0.25, transition: 'opacity 0.2s' }}>🔥</button>
                  </td>
                  <td style={{ padding: '12px 14px', background: 'var(--carbon-medium)', border: '1px solid var(--metal-dark)', borderLeft: 'none', borderRight: 'none' }}>
                    <button
                      onClick={() => toggleActive(p)}
                      style={{
                        width: 40, height: 22, borderRadius: 11,
                        background: p.isActive ? 'var(--accent-green)' : 'var(--metal-dark)',
                        border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: 3, left: p.isActive ? 21 : 3,
                        width: 16, height: 16, borderRadius: '50%', background: '#fff',
                        transition: 'left 0.2s',
                      }} />
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px', background: 'var(--carbon-medium)', borderRadius: '0 8px 8px 0', border: '1px solid var(--metal-dark)', borderLeft: 'none' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '6px 12px', background: 'rgba(0,168,255,0.15)', border: '1px solid rgba(0,168,255,0.3)', borderRadius: 6, color: 'var(--accent-blue)', fontSize: 11, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Edit</button>
                      <button onClick={() => setDeleteTarget(p)} style={{ padding: '6px 12px', background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.3)', borderRadius: 6, color: 'var(--accent-red)', fontSize: 11, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Product Form Modal ── */}
      <Modal open={modalOpen} title={editTarget ? 'Edit Product' : 'Add Product'} onClose={() => setModalOpen(false)} width={600}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div style={{ ...FG, gridColumn: '1 / -1' }}>
              <label style={LS}>Product Name *</label>
              <input required style={IS} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Crystal Series 1.9mm" onFocus={focusOn} onBlur={focusOff} />
            </div>
            <div style={FG}>
              <label style={LS}>Category *</label>
              <select required style={{ ...IS, cursor: 'pointer' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} onFocus={focusOn} onBlur={focusOff}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={FG}>
              <label style={LS}>Category ID (slug)</label>
              <input style={IS} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} placeholder="e.g. crystal" onFocus={focusOn} onBlur={focusOff} />
            </div>
            <div style={{ ...FG, gridColumn: '1 / -1' }}>
              <label style={LS}>Description</label>
              <textarea rows={3} style={{ ...IS, resize: 'vertical', minHeight: 80 } as React.CSSProperties} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description shown on product card" onFocus={focusOn} onBlur={focusOff} />
            </div>
            <div style={{ ...FG, gridColumn: '1 / -1' }}>
              <label style={LS}>Tags (comma-separated)</label>
              <input style={IS} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="LED Wall, Crystal, 1.9mm" onFocus={focusOn} onBlur={focusOff} />
            </div>
            <div style={FG}>
              <label style={LS}>Icon (character)</label>
              <input style={{ ...IS, fontSize: 20, textAlign: 'center' }} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} maxLength={4} onFocus={focusOn} onBlur={focusOff} />
            </div>
            <div style={FG}>
              <label style={LS}>Accent Colour</label>
              <select style={{ ...IS, cursor: 'pointer' }} value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} onFocus={focusOn} onBlur={focusOff}>
                {ACCENT_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div style={FG}>
              <label style={LS}>Sort Order</label>
              <input type="number" style={IS} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} onFocus={focusOn} onBlur={focusOff} />
            </div>
            <div style={{ ...FG, display: 'flex', gap: 24, alignItems: 'center', gridColumn: '1 / -1' }}>
              {[
                { label: 'Mark as HOT 🔥', key: 'isHot' as const, color: 'var(--accent-red)' },
                { label: 'Active (visible)', key: 'isActive' as const, color: 'var(--accent-green)' },
              ].map(toggle => (
                <label key={toggle.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={form[toggle.key]} onChange={e => setForm(f => ({ ...f, [toggle.key]: e.target.checked }))} style={{ width: 16, height: 16, accentColor: toggle.color, cursor: 'pointer' }} />
                  {toggle.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '11px 20px', background: 'none', border: '1px solid var(--metal-dark)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: '11px 24px', background: saving ? 'var(--metal-dark)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontFamily: 'inherit', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
              {saving ? 'Saving…' : editTarget ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal open={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width={400}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--accent-red)' }}>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteTarget(null)} style={{ padding: '11px 20px', background: 'none', border: '1px solid var(--metal-dark)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Cancel</button>
          <button onClick={handleDelete} style={{ padding: '11px 24px', background: 'rgba(255,51,51,0.2)', border: '1px solid rgba(255,51,51,0.5)', borderRadius: 8, color: 'var(--accent-red)', fontSize: 12, fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
