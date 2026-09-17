import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  const { user } = useAuth();

  if (!isOpen) return null;

  const userName = user?.name || 'S Sakishnu';
  const userEmail = user?.email || 'sakishnu33@gmail.com';

  // Compute initials (e.g. "S Sakishnu" -> "SS")
  const initials = userName
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SS';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#1E1F22',
          borderRadius: '1.25rem',
          padding: '1.75rem 1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: '700',
            color: '#FFFFFF',
            textAlign: 'center',
            margin: '0 0 1.35rem 0',
            letterSpacing: '-0.01em'
          }}
        >
          Are you sure you want to log out?
        </h3>

        {/* User Profile Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.85rem 1rem',
            borderRadius: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            marginBottom: '1.5rem'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#6B7280',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '1rem',
              flexShrink: 0
            }}
          >
            {initials}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <span
              style={{
                fontSize: '0.95rem',
                fontWeight: '700',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {userName}
            </span>
            <span
              style={{
                fontSize: '0.825rem',
                color: '#9CA3AF',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {userEmail}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            onClick={onConfirm}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '9999px',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontWeight: '700',
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Log out
          </button>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '9999px',
              backgroundColor: '#2E3035',
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#383A40')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2E3035')}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
