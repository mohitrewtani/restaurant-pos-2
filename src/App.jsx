// src/App.jsx
import React, { useState, useMemo } from 'react';
import './styles/global.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import SearchBar from './components/SearchBar';
import MenuSection from './components/MenuSection';
import CartFAB from './components/CartFAB';
import CartDrawer from './components/CartDrawer';
import QRPage from './components/QRPage';
import ManagerLogin from './pages/ManagerLogin';
import ManagerPortal from './pages/ManagerPortal';
import { menuItems, restaurant } from './data/menuData';

const path = window.location.pathname;

export default function App() {
  // Route: /manager or /qr or default menu
  if (path === '/qr') return <QRPage />;

  if (path === '/manager') {
    return (
      <AuthProvider>
        <ManagerRoute />
      </AuthProvider>
    );
  }

  return (
    <CartProvider>
      <MenuApp />
    </CartProvider>
  );
}

function ManagerRoute() {
  const { authed } = useAuth();
  return authed ? <ManagerPortal /> : <ManagerLogin />;
}

function MenuApp() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]                 = useState('');
  const [cartOpen, setCartOpen]             = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return menuItems;
    const q = search.toLowerCase();
    return menuItems.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  }, [search]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearch('');
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', minHeight: '100vh' }}>
      <Header />
      <SearchBar value={search} onChange={setSearch} />
      {!search && (
        <CategoryTabs active={activeCategory} onChange={handleCategoryChange} />
      )}
      <main style={{ paddingBottom: '6rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.25rem', color: '#78716c' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🍽</p>
            <p>No dishes found for "{search}"</p>
          </div>
        ) : (
          <MenuSection
            items={filtered}
            activeCategory={search ? 'all' : activeCategory}
            currency={restaurant.currency}
          />
        )}
      </main>

      <footer style={{
        textAlign: 'center', padding: '1.5rem',
        fontSize: '0.78rem', color: '#a8a29e',
        borderTop: '1px solid #e8e3db',
      }}>
        © {new Date().getFullYear()} {restaurant.name} · All prices inclusive of taxes
      </footer>

      <CartFAB onClick={() => setCartOpen(true)} />
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}
