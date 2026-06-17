// src/context/CartContext.js
import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.item.id);
      if (existing) {
        return state.map(i =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE': {
      const existing = state.find(i => i.id === action.id);
      if (existing?.qty === 1) return state.filter(i => i.id !== action.id);
      return state.map(i =>
        i.id === action.id ? { ...i, qty: i.qty - 1 } : i
      );
    }
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const add    = item => dispatch({ type: 'ADD', item });
  const remove = id   => dispatch({ type: 'REMOVE', id });
  const clear  = ()   => dispatch({ type: 'CLEAR' });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, add, remove, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
