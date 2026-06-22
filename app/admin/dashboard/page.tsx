'use client';

import { useEffect, useState } from 'react';
import { client } from '../lib/amplify-client';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  hotProducts: number;
  totalEnquiries: number;
  newEnquiries: number;
  contactedEnquiries: number;
  closedEnquiries: number;
}

const ACCENT_COLORS = [
  'var(--accent-purple)',
  'var(--accent-blue)',
  'var(--accent-cyan)',
  'var(--accent-green)',
  'var(--accent-red)',
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, enquiriesRes] = await Promise.all([
          client.models.Product.list(),
          client.models.Enquiry.list(),
        ]);
        const products  = productsRes.data  ?? [];
        const enquiries = enquiriesRes.data ?? [];
        setStats({
          totalProducts:      products.length,
          hotProducts:        products.filter(p => p.isHot).length,
          totalEnquiries:     enquiries.length,
          newEnquiries:       enquiries.filter(e => e.status === 'new').length,
          contactedEnquiries: enquiries.filter(e => e.status === 'contacted').length,
          closedEnquiries:    enquiries.filter(e => e.status === 'closed').length,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = stats ? [
    { label: 'Total Products',  value: stats.totalProducts,      icon: '▣', color: 'var(--accent-blue)',   href: '/admin/products' },
    { label: 'Hot Products',    value: stats.hotProducts,         icon: '🔥', color: 'var(--accent-red)',   href: '/admin/products?filter=hot' },
    { label: 'Total Enquiries', value: stats.totalEnquiries,      icon: '◈', color: 'var(--accent-purple)', href: '/admin/enquiries' },
    { label: 'New Enquiries',   value: stats.newEnquiries,        icon: '●', color: 'var(--accent-cyan)',  href: '/admin/enquiries?status=new' },
  ] : [];

  const quickActions = [
    { label: 'Add Product',     href: '/admin/products?action=new',  icon: '+', color: 'var(--accent-blue)' },
    { label: 'View Enquiries',  href: '/admin/enquiries',             icon: '◈', color: 'var(--accent-purple)' },
    { label: 'Site Settings',   href: '/admin/settings',              icon: '⚙', color: 'var(--accent-cyan)' },
  ];

  return (
    <div>
      {/* Page heading */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ height: 1, width: 32, background: 'linear-gradient(90deg, transparent, var(--accent-purple))' }} />
          <span style={{ fontSize: 10, color: 'var(--accent-purple)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Overview</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{
              height: 110, borderRadius: 12,
              background: 'var(--carbon-medium)',
              border: '1px solid var(--metal-dark)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {statCards.map(card => (
            <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '24px 20px',
                  background: 'linear-gradient(135deg, var(--carbon-medium), var(--carbon-dark))',
                  border: `1px solid ${card.color}30`,
                  borderRadius: 12,
                  position: 'relative', overflow: 'hidden',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.border = `1px solid ${card.color}70`;
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = `0 8px 24px ${card.color}20`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.border = `1px solid ${card.color}30`;
                  el.style.transform = 'none';
                  el.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 22, opacity: 0.4 }}>{card.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: card.color, lineHeight: 1, marginBottom: 8 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  {card.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Enquiry status breakdown */}
      {stats && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            Enquiry Status
          </h2>
          <div style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, var(--carbon-medium), var(--carbon-dark))',
            border: '1px solid var(--metal-dark)',
            borderRadius: 12,
            display: 'flex', flexWrap: 'wrap', gap: 24,
          }}>
            {[
              { label: 'New',       count: stats.newEnquiries,        color: 'var(--accent-cyan)' },
              { label: 'Contacted', count: stats.contactedEnquiries,  color: 'var(--accent-purple)' },
              { label: 'Closed',    count: stats.closedEnquiries,     color: 'var(--accent-green)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.count}</span>
              </div>
            ))}
            {/* Bar */}
            {stats.totalEnquiries > 0 && (
              <div style={{ width: '100%', marginTop: 8 }}>
                <div style={{ height: 6, borderRadius: 99, background: 'var(--metal-dark)', overflow: 'hidden', display: 'flex' }}>
                  {[
                    { count: stats.newEnquiries, color: 'var(--accent-cyan)' },
                    { count: stats.contactedEnquiries, color: 'var(--accent-purple)' },
                    { count: stats.closedEnquiries, color: 'var(--accent-green)' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      height: '100%',
                      width: `${(s.count / stats.totalEnquiries) * 100}%`,
                      background: s.color,
                      transition: 'width 0.5s ease',
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {quickActions.map(a => (
            <Link key={a.label} href={a.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 20px',
                  background: `${a.color}15`,
                  border: `1px solid ${a.color}40`,
                  borderRadius: 8,
                  color: a.color, fontSize: 13, fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${a.color}25`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${a.color}15`; }}
              >
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                {a.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
