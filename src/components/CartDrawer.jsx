// src/components/CartDrawer.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 40,
    display: 'flex', alignItems: 'flex-end',
  },
  drawer: {
    width: '100%', maxWidth: 680, margin: '0 auto',
    background: '#ffffff', borderRadius: '16px 16px 0 0',
    padding: '1.5rem 1.25rem 2rem', maxHeight: '80vh', overflowY: 'auto',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, background: '#d6d3d1',
    margin: '0 auto 1.25rem',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.25rem', fontWeight: 700, color: '#1c1917',
    marginBottom: '1rem',
  },
  row: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.6rem 0', borderBottom: '1px solid #f5f5f4',
  },
  itemName: { flex: 1, fontSize: '0.9rem', color: '#1c1917' },
  qty: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
  },
  qtyBtn: {
    width: 28, height: 28, borderRadius: '50%',
    border: '1px solid #e8e3db', background: '#fff',
    fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#1c1917',
  },
  price: { fontSize: '0.9rem', fontWeight: 600, color: '#1c1917', minWidth: 56, textAlign: 'right' },
  total: {
    display: 'flex', justifyContent: 'space-between',
    padding: '1rem 0 0', fontWeight: 700, fontSize: '1rem', color: '#1c1917',
  },
  input: {
    width: '100%', padding: '0.65rem 0.85rem',
    border: '1px solid #e8e3db', borderRadius: 8,
    fontSize: '0.9rem', fontFamily: 'inherit', marginTop: '0.5rem',
    outline: 'none', boxSizing: 'border-box',
  },
  placeBtn: {
    width: '100%', padding: '0.85rem',
    background: '#b85c2a', color: '#fff', border: 'none',
    borderRadius: 10, fontSize: '1rem', fontWeight: 600,
    cursor: 'pointer', marginTop: '1rem',
  },
  success: {
    textAlign: 'center', padding: '2rem 0',
  },
};

export default function CartDrawer({ onClose }) {
  const { cart, add, remove, clear, total } = useCart();
  const [table, setTable]       = useState('');
  const [placing, setPlacing]   = useState(false);
  const [placed, setPlaced]     = useState(null);
  const [error, setError]       = useState('');

  const placeOrder = async () => {
    if (!table.trim()) { setError('Please enter your table number.'); return; }
    if (cart.length === 0) return;
    setPlacing(true);
    setError('');

    // Generate readable order number
    const orderNumber = 'ORD-' + Date.now().toString().slice(-5);

    const { data: order, error: oErr } = await supabase
      .from('orders')
      .insert({ table_number: table.trim(), order_number: orderNumber, status: 'new' })
      .select()
      .single();

    if (oErr) { setError('Failed to place order. Try again.'); setPlacing(false); return; }

    const items = cart.map(i => ({
      order_id: order.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
      veg: i.veg,
    }));

    const { error: iErr } = await supabase.from('order_items').insert(items);
    if (iErr) { setError('Failed to save items. Try again.'); setPlacing(false); return; }

    clear();
    setPlaced({ orderNumber, table: table.trim() });
    setPlacing(false);
  };

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.drawer}>
        <div style={S.handle} />

        {placed ? (
          <div style={S.success}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
            <h2 style={{ ...S.title, textAlign: 'center' }}>Order placed!</h2>
            <p style={{ color: '#78716c', marginBottom: '0.5rem' }}>
              Order <strong>{placed.orderNumber}</strong> for Table <strong>{placed.table}</strong>
            </p>
            <p style={{ fontSize: '0.85rem', color: '#a8a29e' }}>
              The manager has been notified. Sit back and relax!
            </p>
            <button style={{ ...S.placeBtn, marginTop: '1.5rem' }} onClick={onClose}>
              Back to menu
            </button>
          </div>
        ) : (
          <>
            <h2 style={S.title}>Your cart</h2>

            {cart.length === 0 ? (
              <p style={{ color: '#78716c', fontSize: '0.9rem' }}>Your cart is empty.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={S.row}>
                    <span
                      style={{
                        width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                        background: item.veg ? '#16a34a' : '#dc2626',
                      }}
                    />
                    <span style={S.itemName}>{item.name}</span>
                    <div style={S.qty}>
                      <button style={S.qtyBtn} onClick={() => remove(item.id)}>−</button>
                      <span style={{ minWidth: 16, textAlign: 'center', fontSize: '0.9rem' }}>{item.qty}</span>
                      <button style={S.qtyBtn} onClick={() => add(item)}>+</button>
                    </div>
                    <span style={S.price}>₹{item.price * item.qty}</span>
                  </div>
                ))}

                <div style={S.total}>
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#78716c' }}>Table number</label>
                  <input
                    style={S.input}
                    placeholder="e.g. 5"
                    value={table}
                    onChange={e => setTable(e.target.value)}
                  />
                </div>

                {error && (
                  <p style={{ color: '#dc2626', fontSize: '0.83rem', marginTop: '0.5rem' }}>{error}</p>
                )}

                <button style={S.placeBtn} onClick={placeOrder} disabled={placing}>
                  {placing ? 'Placing order…' : `Place order · ₹${total}`}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
