// src/hooks/useOrders.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, table_number, order_number, status, created_at,
        order_items ( id, name, price, qty, veg )
      `)
      .order('created_at', { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Real-time: listen for any change on orders or order_items
    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, fetchOrders)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { orders, loading, refetch: fetchOrders };
}
