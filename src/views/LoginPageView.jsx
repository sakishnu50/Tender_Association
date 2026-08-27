import React from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPageView({ onLoginSuccess }) {
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0]?.value || 'xyz10@gmail.com';
    const password = e.target.elements[1]?.value || 'password';
    const res = await apiService.login(email, password);
    login(res.token, res.user);
    onLoginSuccess();
  };
  return (
    <div style={{
      width: '100%',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1rem'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        maxWidth: '850px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Left Hero Graphic Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontWeight: '800',
              marginBottom: '1rem'
            }}>
              IOT
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.2' }}>
              Infrastructure<br />Opportunity Tracker
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.75rem', lineHeight: '1.5' }}>
              Enterprise AI platform for monitoring, matching, and managing infrastructure tender pipelines.
            </p>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748B', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
            © 2028 Infrastructure Tracker Inc.
          </div>
        </div>

        {/* Right Form Section */}
        <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Sign in to your account
            </h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Enter your credentials below</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Email</label>
              <input
                type="email"
                defaultValue="xyz10@gmail.com"
                style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Password</label>
                <a href="#forgot" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</a>
              </div>
              <input
                type="password"
                defaultValue="••••••••••••"
                style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              <input type="checkbox" id="remember" defaultChecked />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontWeight: '700', marginTop: '0.5rem' }}>
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
