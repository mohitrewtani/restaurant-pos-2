// src/components/MenuCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

export default function MenuCard({ item, currency }) {
  const { cart, add, remove } = useCart();
  const inCart = cart.find(i => i.id === item.id);

  return (
    <article
      style={{
        background: '#ffffff', border: '1px solid #e8e3db',
        borderRadius: 10, padding: '1rem 1.1rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', gap: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          {/* Veg indicator */}
          <span
            style={{
              width: 14, height: 14, border: `2px solid ${item.veg ? '#16a34a' : '#dc2626'}`,
              borderRadius: 2, display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}
            title={item.veg ? 'Vegetarian' : 'Non-vegetarian'}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: item.veg ? '#16a34a' : '#dc2626',
            }} />
          </span>
          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1rem', fontWeight: 700, color: '#1c1917',
          }}>
            {item.name}
          </h3>
          {item.popular && (
            <span style={{
              fontSize: '0.68rem', fontWeight: 600,
              background: '#fdf0e8', color: '#b85c2a',
              padding: '2px 7px', borderRadius: 999,
              letterSpacing: '0.03em', textTransform: 'uppercase',
            }}>Popular</span>
          )}
        </div>
        <p style={{ fontSize: '0.83rem', color: '#78716c', lineHeight: 1.5 }}>
          {item.description}
        </p>
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1rem', fontWeight: 700, color: '#1c1917', marginTop: '0.5rem',
        }}>
          {currency}{item.price}
        </p>
      </div>

      {/* Add / qty controls */}
      <div style={{ flexShrink: 0, paddingTop: '0.25rem' }}>
        {!inCart ? (
          <button
            onClick={() => add(item)}
            style={{
              padding: '0.45rem 1rem', borderRadius: 999,
              border: '1.5px solid #b85c2a', background: '#fff',
              color: '#b85c2a', fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Add
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => remove(item.id)}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                border: '1.5px solid #e8e3db', background: '#fff',
                fontSize: '1.1rem', cursor: 'pointer', color: '#1c1917',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >−</button>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: 16, textAlign: 'center' }}>
              {inCart.qty}
            </span>
            <button
              onClick={() => add(item)}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                border: 'none', background: '#b85c2a',
                fontSize: '1.1rem', cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >+</button>
          </div>
        )}
      </div>
    </article>
  );
}
