// src/pages/ManagerPortal.jsx
import React, { useState, useMemo } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { restaurant } from '../data/menuData';

const STATUS_COLOR = {
  new:        { bg: '#fef9c3', text: '#854d0e', label: 'New' },
  preparing:  { bg: '#dbeafe', text: '#1e40af', label: 'Preparing' },
  ready:      { bg: '#dcfce7', text: '#166534', label: 'Ready' },
  paid:       { bg: '#f3f4f6', text: '#6b7280', label: 'Paid' },
};

export default function ManagerPortal() {
  const { orders, loading } = useOrders();
  const { logout }          = useAuth();
  const [view, setView]     = useState('orders');   // 'orders' | 'tables'
  const [selTable, setSelTable] = useState(null);

  // Group orders by table for billing view
  const tableMap = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      if (!map[o.table_number]) map[o.table_number] = [];
      map[o.table_number].push(o);
    });
    return map;
  }, [orders]);

  const unpaidTables = Object.keys(tableMap).filter(t =>
    tableMap[t].some(o => o.status !== 'paid')
  );

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5' }}>
      {/* Header */}
      <header style={{
        background: '#1c1917', color: '#faf8f5',
        padding: '1rem 1.5rem', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.3rem', margin: 0,
          }}>{restaurant.name}</h1>
          <p style={{ fontSize: '0.78rem', color: '#a8a29e', margin: 0 }}>Manager portal</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <TabBtn label="Orders" active={view === 'orders'} onClick={() => setView('orders')} />
          <TabBtn label="Tables" active={view === 'tables'} onClick={() => setView('tables')} />
          <button
            onClick={logout}
            style={{
              background: 'transparent', border: '1px solid #57534e',
              color: '#a8a29e', borderRadius: 8, padding: '0.35rem 0.75rem',
              fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >Sign out</button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#78716c' }}>Loading…</div>
      ) : view === 'orders' ? (
        <OrdersView orders={orders} />
      ) : selTable ? (
        <TableBillView
          table={selTable}
          orders={tableMap[selTable] || []}
          onBack={() => setSelTable(null)}
        />
      ) : (
        <TablesView
          tableMap={tableMap}
          unpaidTables={unpaidTables}
          onSelect={setSelTable}
        />
      )}
    </div>
  );
}

/* ── Orders feed ── */
function OrdersView({ orders }) {
  const active = orders.filter(o => o.status !== 'paid');
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.25rem' }}>
      <h2 style={{ fontSize: '1rem', color: '#78716c', marginBottom: '1rem' }}>
        {active.length} active order{active.length !== 1 ? 's' : ''}
      </h2>
      {active.length === 0 && (
        <p style={{ color: '#a8a29e', textAlign: 'center', padding: '3rem' }}>
          No active orders right now.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {active.map(order => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const [updating, setUpdating] = useState(false);
  const s = STATUS_COLOR[order.status] || STATUS_COLOR.new;

  const setStatus = async (status) => {
    setUpdating(true);
    await supabase.from('orders').update({ status }).eq('id', order.id);
    setUpdating(false);
  };

  const removeItem = async (itemId) => {
    await supabase.from('order_items').delete().eq('id', itemId);
  };

  const itemTotal = order.order_items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{
      background: '#fff', border: '1px solid #e8e3db',
      borderRadius: 12, overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.85rem 1rem', borderBottom: '1px solid #f5f5f4',
        background: '#fafaf9',
      }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1c1917' }}>
            Table {order.table_number}
          </span>
          <span style={{ color: '#a8a29e', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
            #{order.order_number}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{
            background: s.bg, color: s.text,
            padding: '3px 10px', borderRadius: 999,
            fontSize: '0.75rem', fontWeight: 600,
          }}>{s.label}</span>
          {order.status === 'new' && (
            <ActionBtn label="→ Preparing" onClick={() => setStatus('preparing')} loading={updating} />
          )}
          {order.status === 'preparing' && (
            <ActionBtn label="→ Ready" onClick={() => setStatus('ready')} loading={updating} />
          )}
          {order.status === 'ready' && (
            <ActionBtn label="✓ Mark paid" onClick={() => setStatus('paid')} loading={updating} color="#16a34a" />
          )}
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '0.75rem 1rem' }}>
        {order.order_items.map(item => (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.4rem 0', borderBottom: '1px solid #f5f5f4',
          }}>
            <span style={{
              width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
              background: item.veg ? '#16a34a' : '#dc2626',
            }} />
            <span style={{ flex: 1, fontSize: '0.88rem', color: '#1c1917' }}>
              {item.qty}× {item.name}
            </span>
            <span style={{ fontSize: '0.88rem', color: '#78716c' }}>
              ₹{item.price * item.qty}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              title="Remove item"
              style={{
                background: 'transparent', border: 'none',
                color: '#dc2626', cursor: 'pointer', fontSize: '1rem',
                padding: '0 4px', lineHeight: 1,
              }}
            >×</button>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          paddingTop: '0.6rem', fontSize: '0.88rem',
          fontWeight: 700, color: '#1c1917',
        }}>
          ₹{itemTotal}
        </div>
      </div>
    </div>
  );
}

/* ── Tables view ── */
function TablesView({ tableMap, unpaidTables, onSelect }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.25rem' }}>
      <h2 style={{ fontSize: '1rem', color: '#78716c', marginBottom: '1rem' }}>
        {unpaidTables.length} table{unpaidTables.length !== 1 ? 's' : ''} with open bills
      </h2>
      {unpaidTables.length === 0 && (
        <p style={{ color: '#a8a29e', textAlign: 'center', padding: '3rem' }}>
          All tables settled.
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        {unpaidTables.map(table => {
          const tableOrders = tableMap[table];
          const grandTotal  = tableOrders.reduce((sum, o) =>
            sum + o.order_items.reduce((s, i) => s + i.price * i.qty, 0), 0);
          const orderCount  = tableOrders.filter(o => o.status !== 'paid').length;

          return (
            <button
              key={table}
              onClick={() => onSelect(table)}
              style={{
                background: '#fff', border: '1px solid #e8e3db',
                borderRadius: 12, padding: '1.25rem',
                textAlign: 'left', cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1c1917' }}>
                Table {table}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#78716c', margin: '0.25rem 0' }}>
                {orderCount} order{orderCount !== 1 ? 's' : ''} · ₹{grandTotal}
              </div>
              <div style={{
                fontSize: '0.75rem', color: '#b85c2a', fontWeight: 600,
              }}>View bill →</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Table bill ── */
function TableBillView({ table, orders, onBack }) {
  const unpaid = orders.filter(o => o.status !== 'paid');
  const grandTotal = orders.reduce((sum, o) =>
    sum + o.order_items.reduce((s, i) => s + i.price * i.qty, 0), 0);

  const markAllPaid = async () => {
    const ids = unpaid.map(o => o.id);
    await supabase.from('orders').update({ status: 'paid' }).in('id', ids);
  };

  const removeItem = async (itemId) => {
    await supabase.from('order_items').delete().eq('id', itemId);
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '1.25rem' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', color: '#78716c',
          fontSize: '0.88rem', cursor: 'pointer', marginBottom: '1rem',
          padding: 0, fontFamily: 'inherit',
        }}
      >← All tables</button>

      <div style={{
        background: '#fff', border: '1px solid #e8e3db',
        borderRadius: 14, overflow: 'hidden',
      }}>
        {/* Bill header */}
        <div style={{
          padding: '1rem 1.25rem', background: '#1c1917', color: '#faf8f5',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.2rem', margin: 0,
          }}>Table {table} — Bill</h2>
          <p style={{ fontSize: '0.8rem', color: '#a8a29e', margin: '0.2rem 0 0' }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* All orders collapsed into one bill */}
        <div style={{ padding: '0 1.25rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ borderBottom: '1px solid #f5f5f4', padding: '0.85rem 0' }}>
              <div style={{
                fontSize: '0.78rem', color: '#a8a29e', marginBottom: '0.4rem',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>#{order.order_number}</span>
                <span style={{
                  background: STATUS_COLOR[order.status]?.bg,
                  color: STATUS_COLOR[order.status]?.text,
                  padding: '1px 8px', borderRadius: 999, fontSize: '0.72rem',
                }}>{STATUS_COLOR[order.status]?.label}</span>
              </div>
              {order.order_items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.3rem 0',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: item.veg ? '#16a34a' : '#dc2626',
                  }} />
                  <span style={{ flex: 1, fontSize: '0.88rem', color: '#1c1917' }}>
                    {item.qty}× {item.name}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#78716c' }}>₹{item.price * item.qty}</span>
                  {order.status !== 'paid' && (
                    <button
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                      style={{
                        background: 'transparent', border: 'none',
                        color: '#dc2626', cursor: 'pointer', fontSize: '1rem',
                        padding: '0 2px',
                      }}
                    >×</button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Grand total */}
        <div style={{
          padding: '1rem 1.25rem',
          display: 'flex', justifyContent: 'space-between',
          fontWeight: 700, fontSize: '1.05rem', color: '#1c1917',
          borderTop: '2px solid #e8e3db',
        }}>
          <span>Grand total</span>
          <span>₹{grandTotal}</span>
        </div>

        {unpaid.length > 0 && (
          <div style={{ padding: '0 1.25rem 1.25rem' }}>
            <button
              onClick={markAllPaid}
              style={{
                width: '100%', padding: '0.85rem',
                background: '#16a34a', color: '#fff',
                border: 'none', borderRadius: 10,
                fontSize: '0.95rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              ✓ Mark table as paid · ₹{grandTotal}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Helpers ── */
function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.4rem 0.9rem', borderRadius: 8,
        border: active ? 'none' : '1px solid #57534e',
        background: active ? '#faf8f5' : 'transparent',
        color: active ? '#1c1917' : '#a8a29e',
        fontSize: '0.85rem', fontWeight: active ? 600 : 400,
        cursor: 'pointer', fontFamily: 'inherit',
      }}
    >{label}</button>
  );
}

function ActionBtn({ label, onClick, loading, color = '#b85c2a' }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        padding: '4px 10px', borderRadius: 8,
        border: `1px solid ${color}`, background: 'transparent',
        color, fontSize: '0.78rem', fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit',
      }}
    >{loading ? '…' : label}</button>
  );
}
