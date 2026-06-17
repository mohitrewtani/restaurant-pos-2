// src/pages/ManagerLogin.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ManagerLogin() {
  const { login } = useAuth();
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!login(pw)) setError('Incorrect password. Try again.');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#faf8f5', padding: '1.5rem',
    }}>
      <div style={{
        background: '#fff', border: '1px solid #e8e3db',
        borderRadius: 14, padding: '2.5rem 2rem',
        maxWidth: 360, width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.6rem', color: '#1c1917', marginBottom: '0.25rem',
        }}>Manager portal</h1>
        <p style={{ color: '#78716c', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
          Enter your password to access orders and billing.
        </p>

        <label style={{ fontSize: '0.83rem', color: '#78716c', display: 'block', marginBottom: '0.4rem' }}>
          Password
        </label>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="••••••••"
          autoFocus
          style={{
            width: '100%', padding: '0.65rem 0.85rem',
            border: `1px solid ${error ? '#dc2626' : '#e8e3db'}`,
            borderRadius: 8, fontSize: '0.95rem',
            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          }}
        />
        {error && (
          <p style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '0.4rem' }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: '0.85rem', marginTop: '1rem',
            background: '#1c1917', color: '#faf8f5', border: 'none',
            borderRadius: 10, fontSize: '0.95rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
