'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Amplify } from 'aws-amplify';
import { signIn, confirmSignIn, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import amplifyOutputs from "../../../amplify_outputs.json"; // Adjust the path as needed to point to your amplify outputs file

Amplify.configure({
  Auth: {
        Cognito: {
          userPoolId: amplifyOutputs.auth.user_pool_id,
          userPoolClientId: amplifyOutputs.auth.user_pool_client_id,
          signUpVerificationMethod: 'code',
          loginWith: {
            username: true,
            email: true,
          }
        }
      }
});



type Step = 'login' | 'new-password' | 'forgot' | 'forgot-confirm';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep]       = useState<Step>('login');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [newPwd, setNewPwd]   = useState('');
  const [code, setCode]       = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  /* ── Handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const result = await signIn({ username: email, password });
      if (result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setStep('new-password');
      } else if (result.isSignedIn) {
        router.replace('/admin/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const result = await confirmSignIn({ challengeResponse: newPwd });
      if (result.isSignedIn) router.replace('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to set new password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await resetPassword({ username: email });
      setStep('forgot-confirm');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword: newPwd });
      setStep('login');
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Styles ── */
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    background: 'var(--carbon-dark)',
    border: '1px solid var(--metal-dark)',
    borderRadius: 8, color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'inherit',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    letterSpacing: 0.5,
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: 'var(--text-dim)', letterSpacing: 2,
    textTransform: 'uppercase', marginBottom: 8,
  };
  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '14px',
    background: loading ? 'var(--metal-dark)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
    border: 'none', borderRadius: 8,
    color: '#fff', fontSize: 14, fontFamily: 'inherit',
    fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: loading ? 'none' : '0 4px 20px rgba(153,69,255,0.35)',
  };

  const titles: Record<Step, string> = {
    'login': 'Admin Login',
    'new-password': 'Set New Password',
    'forgot': 'Reset Password',
    'forgot-confirm': 'Enter Reset Code',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: '#fff',
            boxShadow: '0 8px 32px rgba(153,69,255,0.4)',
          }}>⬡</div>
          <h1 style={{
            fontSize: 28, fontWeight: 900,
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue), var(--accent-cyan))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
          }}>
            ESS ARR - ADMIN
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', letterSpacing: 2, textTransform: 'uppercase' }}>
            {titles[step]}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--carbon-medium), var(--carbon-dark))',
          border: '1px solid var(--metal-dark)',
          borderRadius: 20, padding: '36px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>

          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 16px', marginBottom: 24,
              background: 'rgba(255,51,51,0.1)',
              border: '1px solid rgba(255,51,51,0.3)',
              borderRadius: 8, fontSize: 13, color: 'var(--accent-red)',
              lineHeight: 1.5,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* ── Login form ── */}
          {step === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@essarr.com"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-purple)'; e.target.style.boxShadow = '0 0 10px rgba(153,69,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--metal-dark)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent-purple)'; e.target.style.boxShadow = '0 0 10px rgba(153,69,255,0.2)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--metal-dark)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button
                    type="button" onClick={() => setShowPwd(v => !v)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 16 }}
                  >{showPwd ? '🙈' : '👁'}</button>
                </div>
              </div>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
              <button
                type="button" onClick={() => { setStep('forgot'); setError(''); }}
                style={{ width: '100%', marginTop: 14, background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1 }}
              >
                Forgot password?
              </button>
            </form>
          )}

          {/* ── New password (first-time login) ── */}
          {step === 'new-password' && (
            <form onSubmit={handleNewPassword}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                This is your first login. Please set a new password.
              </p>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password" required minLength={8}
                  value={newPwd} onChange={e => setNewPwd(e.target.value)}
                  placeholder="Min 8 chars, upper + lower + number"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-purple)'; e.target.style.boxShadow = '0 0 10px rgba(153,69,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--metal-dark)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? 'Setting…' : 'Set Password →'}
              </button>
            </form>
          )}

          {/* ── Forgot password ── */}
          {step === 'forgot' && (
            <form onSubmit={handleForgot}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                Enter your admin email. We'll send a reset code.
              </p>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@essarr.com"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-purple)'; e.target.style.boxShadow = '0 0 10px rgba(153,69,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--metal-dark)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? 'Sending…' : 'Send Reset Code →'}
              </button>
              <button type="button" onClick={() => { setStep('login'); setError(''); }}
                style={{ width: '100%', marginTop: 14, background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1 }}>
                ← Back to login
              </button>
            </form>
          )}

          {/* ── Forgot confirm ── */}
          {step === 'forgot-confirm' && (
            <form onSubmit={handleForgotConfirm}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                Check <strong style={{ color: 'var(--accent-cyan)' }}>{email}</strong> for a 6-digit code.
              </p>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Confirmation Code</label>
                <input
                  type="text" required maxLength={6}
                  value={code} onChange={e => setCode(e.target.value)}
                  placeholder="123456"
                  style={{ ...inputStyle, letterSpacing: 8, textAlign: 'center', fontSize: 18 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-purple)'; e.target.style.boxShadow = '0 0 10px rgba(153,69,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--metal-dark)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password" required minLength={8}
                  value={newPwd} onChange={e => setNewPwd(e.target.value)}
                  placeholder="New password"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-purple)'; e.target.style.boxShadow = '0 0 10px rgba(153,69,255,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--metal-dark)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? 'Resetting…' : 'Reset Password →'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1 }}>
          ESS ARR ENTERPRISES © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
