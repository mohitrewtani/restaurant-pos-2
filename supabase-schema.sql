-- ============================================
-- Restaurant Menu & Order System — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT        NOT NULL,
  table_number TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','preparing','ready','paid')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id  UUID    NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name      TEXT    NOT NULL,
  price     INTEGER NOT NULL,
  qty       INTEGER NOT NULL DEFAULT 1,
  veg       BOOLEAN NOT NULL DEFAULT true
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_table  ON orders(table_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_items_order   ON order_items(order_id);

-- ── Row Level Security ──────────────────────
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Anyone (customers) can insert orders and items
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT WITH CHECK (true);

-- Anyone can read orders and items (manager portal uses anon key)
CREATE POLICY "Anyone can read orders"
  ON orders FOR SELECT USING (true);

CREATE POLICY "Anyone can read order items"
  ON order_items FOR SELECT USING (true);

-- Anyone can update orders (manager changes status)
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE USING (true);

-- Anyone can delete order items (manager removes items)
CREATE POLICY "Anyone can delete order items"
  ON order_items FOR DELETE USING (true);

-- ── Real-time ───────────────────────────────
-- Enable real-time for instant order notifications in the manager portal
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
