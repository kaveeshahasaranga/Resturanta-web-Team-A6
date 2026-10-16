# FUCHSIUS – Online Restaurant Ordering & Management System

> A full-stack MERN + Prisma monorepo with a dark-mode, orange-accented theme.

---

## 🗂 Project Structure

```
Resturanta web/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # DB models (User, Chef, MenuItem, Order, Contact)
│   │   └── seed.js              # Initial data seed
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── menu.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── chef.routes.js
│   │   │   ├── contact.routes.js
│   │   │   └── admin.routes.js
│   │   └── server.js            # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── menu/
    │   │   │   ├── MenuItemCard.jsx
    │   │   │   └── CategoryFilter.jsx
    │   │   └── cart/
    │   │       └── CartItem.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── hooks/
    │   │   └── useFetch.js
    │   ├── pages/
    │   │   ├── customer/
    │   │   │   ├── HomePage.jsx
    │   │   │   ├── MenuPage.jsx
    │   │   │   ├── CartPage.jsx
    │   │   │   ├── CheckoutPage.jsx
    │   │   │   └── ContactPage.jsx
    │   │   ├── auth/
    │   │   │   ├── LoginPage.jsx
    │   │   │   └── RegisterPage.jsx
    │   │   └── admin/
    │   │       ├── AdminLayout.jsx      # Fixed left sidebar
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminMenuPage.jsx    # Management table
    │   │       ├── AdminMenuForm.jsx    # Add / Edit form
    │   │       ├── AdminOrdersPage.jsx
    │   │       ├── AdminChefsPage.jsx
    │   │       └── AdminContactPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET
npx prisma migrate dev       # run migrations
npm run db:seed              # seed admin + sample data
npm run dev                  # start on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev                  # start on http://localhost:5173
```

---

## 🎨 Design Theme

| Token | Value | Usage |
|---|---|---|
| `fuchsiusBlack`  | `#000000` | Background |
| `fuchsiusOrange` | `#ec6f00` | Accents, CTAs, active states |
| `fuchsiusWhite`  | `#ffffff` | Primary text |

---

## 🔑 Default Admin Credentials (seed)

| Field    | Value |
|----------|-------|
| Email    | `admin@fuchsius.com` |
| Password | `admin123` |

> ⚠️ Change the password immediately in production!

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Current user |
| GET  | `/api/menu` | List menu items |
| POST | `/api/menu` | Create menu item |
| PUT  | `/api/menu/:id` | Update item |
| DELETE | `/api/menu/:id` | Delete item |
| GET  | `/api/orders` | List orders |
| POST | `/api/orders` | Place order |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET  | `/api/chefs` | List chefs |
| POST | `/api/contact` | Submit message |
| GET  | `/api/admin/dashboard` | Dashboard stats |
