# 🍽 Restaurant Ordering System

Full-stack restaurant menu + ordering system built with React and Supabase.

## Features

**Customer app** (`/`)
- Browse full menu with search and category filters
- Add items to cart with quantity controls
- Place order with table number — appears instantly on manager screen
- Can order multiple times during the visit (all added to the same table bill)

**Manager portal** (`/manager`) — password protected
- Live order feed with real-time updates (no refresh needed)
- Move orders through: New → Preparing → Ready → Paid
- Remove individual items from any order (cancellations)
- Tables view — see every table's running total across all their orders
- Bill view — full breakdown per table with one-tap "Mark as paid"

**QR code** (`/qr`)
- Printable QR card that points customers to the live menu

## Tech stack
- **React 18** — frontend
- **Supabase** — Postgres database + real-time subscriptions
- **qrcode.react** — QR code generation

## Setup

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/restaurant-menu.git
cd restaurant-menu
npm install
```

### 2. Create a Supabase project
1. Go to https://supabase.com and create a free project
2. In the SQL Editor, paste and run the contents of `supabase-schema.sql`
3. Copy your **Project URL** and **anon public key** from Settings → API

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
REACT_APP_MANAGER_PASSWORD=yourStrongPassword123
```

### 4. Run locally
```bash
npm start
```

| URL | What it is |
|-----|-----------|
| `http://localhost:3000` | Customer menu |
| `http://localhost:3000/manager` | Manager portal |
| `http://localhost:3000/qr` | Printable QR code |

## Customise your menu
Edit `src/data/menuData.js` — change the restaurant name, add/remove dishes, update prices.

## Deploy

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```
Add your env vars in the Vercel dashboard under Project → Settings → Environment Variables.

### Netlify
```bash
npm run build
```
Drag the `/build` folder to https://app.netlify.com/drop and add env vars in Site Settings.

## Project structure
```
src/
├── components/
│   ├── CartDrawer.jsx    ← Customer cart & order placement
│   ├── CartFAB.jsx       ← Floating cart button
│   ├── CategoryTabs.jsx
│   ├── Header.jsx
│   ├── MenuCard.jsx      ← Dish card with Add/qty controls
│   ├── MenuSection.jsx
│   ├── QRPage.jsx
│   └── SearchBar.jsx
├── context/
│   ├── AuthContext.js    ← Manager password auth
│   └── CartContext.js    ← Customer cart state
├── hooks/
│   └── useOrders.js      ← Real-time orders subscription
├── lib/
│   └── supabase.js       ← Supabase client
├── pages/
│   ├── ManagerLogin.jsx  ← Password gate
│   └── ManagerPortal.jsx ← Full manager dashboard
├── data/
│   └── menuData.js       ← ⭐ Edit this for your menu
└── App.jsx               ← Router
```
