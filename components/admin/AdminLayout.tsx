'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import Link from 'next/link';

interface AdminUser {
  username: string;
  userId: string;
}

const NAV_ITEMS = [
  { href: '/admin/dashboard',  label: 'Dashboard',  icon: '⬡' },
  { href: '/admin/products',   label: 'Products',   icon: '▣' },
  { href: '/admin/enquiries',  label: 'Enquiries',  icon: '◈' },
  { href: '/admin/settings',   label: 'Settings',   icon: '⚙' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]   = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Skip auth guard on login page
    if (pathname === '/admin/login') { setLoading(false); return; }

    getCurrentUser()
      .then(u => setUser({ username: u.username, userId: u.userId }))
      .catch(() => router.replace('/admin/login'))
      .finally(() => setLoading(false));
  }, [pathname, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-black)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid var(--metal-dark)',
            borderTopColor: 'var(--accent-purple)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'var(--text-dim)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Authenticating…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--primary-black)' }}>

      {/* ── Sidebar ── */}
      <>
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100 }}
          />
        )}
        <aside style={{
          width: 240,
          background: 'var(--carbon-dark)',
          borderRight: '1px solid var(--metal-dark)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 110,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
        }}
          className="admin-sidebar"
        >
          {/* Logo */}
          <div style={{
            padding: '24px 20px',
            borderBottom: '1px solid var(--metal-dark)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: '#fff',
            }}>⬡</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 2, textTransform: 'uppercase' }}>ESS ARR</div>
              <div style={{ fontSize: 10, color: 'var(--accent-purple)', letterSpacing: 1 }}>Admin Panel</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '16px 12px', overflow: 'auto' }}>
            {NAV_ITEMS.map(item => {
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px',
                      marginBottom: 4,
                      borderRadius: 8,
                      background: active ? 'rgba(153,69,255,0.15)' : 'transparent',
                      borderLeft: active ? '3px solid var(--accent-purple)' : '3px solid transparent',
                      color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      fontSize: 13, fontWeight: active ? 700 : 400,
                      letterSpacing: 1, textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User info + sign out */}
          <div style={{ padding: '16px 12px', borderTop: '1px solid var(--metal-dark)' }}>
            <div style={{
              padding: '12px 14px',
              background: 'var(--carbon-medium)',
              borderRadius: 8,
              marginBottom: 8,
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Signed in as</div>
              <div style={{ fontSize: 13, color: 'var(--accent-cyan)', fontWeight: 700, wordBreak: 'break-all' }}>
                {user?.username}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%', padding: '10px',
                background: 'rgba(255,51,51,0.1)',
                border: '1px solid rgba(255,51,51,0.3)',
                borderRadius: 8,
                color: 'var(--accent-red)',
                fontSize: 12, fontFamily: 'inherit',
                fontWeight: 700, letterSpacing: 1,
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,51,51,0.2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,51,51,0.1)'; }}
            >
              ⏻ Sign Out
            </button>
          </div>
        </aside>
      </>

      {/* ── Main content ── */}
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }} className="admin-main">
        {/* Top bar (mobile) */}
        <header style={{
          display: 'none',
          padding: '14px 20px',
          background: 'var(--carbon-dark)',
          borderBottom: '1px solid var(--metal-dark)',
          alignItems: 'center', justifyContent: 'space-between',
        }} className="admin-topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 22, cursor: 'pointer' }}
          >☰</button>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: 2, textTransform: 'uppercase' }}>Admin</span>
          <div />
        </header>

        <main style={{ flex: 1, padding: '32px 36px', maxWidth: 1200, width: '100%' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0 !important; }
          .admin-topbar { display: flex !important; }
          main { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}
