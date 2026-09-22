import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, History, X } from 'lucide-react';

const DEFAULT_EMAILS = [
  'sakishnu33@gmail.com',
  'userA@company.com',
  'userB@company.com'
];

export default function LoginPageView({ onLoginSuccess }) {
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedEmails, setSavedEmails] = useState(() => {
    try {
      const stored = localStorage.getItem('iot_saved_emails');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved emails:', e);
    }
    return DEFAULT_EMAILS;
  });

  const emailContainerRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emailContainerRef.current && !emailContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If user is already authenticated, directly show Dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      onLoginSuccess?.();
    }
  }, [isAuthenticated, user, onLoginSuccess]);

  const saveEmailToHistory = (newEmail) => {
    const clean = newEmail.trim();
    if (!clean) return;
    const updated = [clean, ...savedEmails.filter((e) => e.toLowerCase() !== clean.toLowerCase())].slice(0, 10);
    setSavedEmails(updated);
    try {
      localStorage.setItem('iot_saved_emails', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving emails to storage:', e);
    }
  };

  const removeEmailFromHistory = (e, emailToRemove) => {
    e.stopPropagation();
    const updated = savedEmails.filter((item) => item !== emailToRemove);
    setSavedEmails(updated);
    try {
      localStorage.setItem('iot_saved_emails', JSON.stringify(updated));
    } catch (err) {
      console.warn('Error removing email:', err);
    }
  };

  const filteredSuggestions = savedEmails.filter((item) =>
    !email.trim() || item.toLowerCase().includes(email.trim().toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      saveEmailToHistory(cleanEmail);
      await login(cleanEmail, password);
      onLoginSuccess?.();
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectSuggestion = (selectedEmail) => {
    setEmail(selectedEmail);
    setShowSuggestions(false);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: 'var(--bg-card, #FFFFFF)',
          borderRadius: '1.25rem',
          boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1))',
          border: '1px solid var(--border-color, #E2E8F0)',
          padding: '2.5rem 2.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1.25rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main, #0F172A)' }}>
            Sign in to your account
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748B)' }}>
            Enter your email below to access your user-isolated tender workspace.
          </span>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--danger-bg, #FEF2F2)',
              border: '1px solid var(--danger, #EF4444)',
              color: 'var(--danger-text, #991B1B)',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} autoComplete="on">
          {/* Email Field with Autocomplete History Suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', position: 'relative' }} ref={emailContainerRef}>
            <label htmlFor="email" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main, #334155)' }}>
              Work Email Address
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '0.5rem',
                border: showSuggestions ? '1px solid var(--primary, #2563EB)' : '1px solid var(--border-color, #CBD5E1)',
                backgroundColor: 'var(--bg-subtle, #F8FAFC)',
                boxShadow: showSuggestions ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Mail size={16} color="var(--text-muted, #94A3B8)" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                list="email-suggestions-list"
                placeholder="e.g. sakishnu33@gmail.com or userA@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onClick={() => setShowSuggestions(true)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.875rem',
                  color: 'var(--text-main, #0F172A)'
                }}
                required
                autoFocus
              />
            </div>

            {/* Datalist for native browser autocomplete support */}
            <datalist id="email-suggestions-list">
              {savedEmails.map((saved) => (
                <option key={saved} value={saved} />
              ))}
            </datalist>

            {/* Interactive Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--bg-card, #FFFFFF)',
                  border: '1px solid var(--border-color, #CBD5E1)',
                  borderRadius: '0.6rem',
                  boxShadow: 'var(--shadow-lg, 0 10px 20px -3px rgba(0, 0, 0, 0.12))',
                  zIndex: 50,
                  maxHeight: '190px',
                  overflowY: 'auto',
                  animation: 'fadeIn 0.12s ease'
                }}
              >
                <div
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.675rem',
                    fontWeight: '700',
                    color: 'var(--text-muted, #64748B)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backgroundColor: 'var(--bg-subtle, #F8FAFC)',
                    borderBottom: '1px solid var(--border-color, #E2E8F0)'
                  }}
                >
                  Previous Email History
                </div>
                {filteredSuggestions.map((item) => (
                  <div
                    key={item}
                    onClick={() => handleSelectSuggestion(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.75rem',
                      cursor: 'pointer',
                      fontSize: '0.825rem',
                      color: 'var(--text-main, #0F172A)',
                      transition: 'background-color 0.15s ease',
                      borderBottom: '1px solid var(--border-color, #F1F5F9)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #F1F5F9)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <History size={14} color="var(--text-muted, #94A3B8)" style={{ flexShrink: 0 }} />
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '500' }}>
                        {item}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => removeEmailFromHistory(e, item)}
                      title="Remove from history"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-muted, #94A3B8)',
                        cursor: 'pointer',
                        padding: '2px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger, #EF4444)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted, #94A3B8)')}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main, #334155)' }}>
                Password
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary, #2563EB)', cursor: 'pointer' }}>
                Forgot Password?
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color, #CBD5E1)',
                backgroundColor: 'var(--bg-subtle, #F8FAFC)'
              }}
            >
              <Lock size={16} color="var(--text-muted, #94A3B8)" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.875rem',
                  color: 'var(--text-main, #0F172A)'
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              padding: '0.75rem',
              fontWeight: '700',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{isSubmitting ? 'Signing In...' : 'SIGN IN'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
