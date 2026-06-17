// src/components/CartFAB.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartFAB({ onClick }) {
  const { count, total } = useCart();
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed', bottom: '1.5rem', left: '50%',
        transform: 'translateX(-50%)',
        background: '#1c1917', color: '#faf8f5',
        border: 'none', borderRadius: 999,
        padding: '0.85rem 1.75rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        fontSize: '0.95rem', fontWeight: 600,
        cursor: 'pointer', zIndex: 30,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          background: '#b85c2a', color: '#fff',
          borderRadius: '50%', width: 24, height: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 700,
        }}
      >
        {count}
      </span>
      View cart · ₹{total}
    </button>
  );
}
