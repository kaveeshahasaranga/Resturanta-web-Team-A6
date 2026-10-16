import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// ─── Customer Pages ──────────────────────────────────────────────────────────
import HomePage               from './pages/customer/HomePage.jsx';
import AboutPage              from './pages/customer/AboutPage.jsx';
import MenuPage               from './pages/customer/MenuPage.jsx';
import MenuItemDetailPage     from './pages/customer/MenuItemDetailPage.jsx';
import CartPage               from './pages/customer/CartPage.jsx';
import CheckoutPage           from './pages/customer/CheckoutPage.jsx';
import OrderConfirmationPage  from './pages/customer/OrderConfirmationPage.jsx';
import ContactPage            from './pages/customer/ContactPage.jsx';
import ChefDetailPage         from './pages/customer/ChefDetailPage.jsx';
import CustomerProfilePage    from './pages/customer/CustomerProfilePage.jsx';

// ─── Auth Pages ──────────────────────────────────────────────────────────────
import LoginPage          from './pages/auth/LoginPage.jsx';
import RegisterPage       from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage  from './pages/auth/ResetPasswordPage.jsx';

// ─── Admin Pages ─────────────────────────────────────────────────────────────
import AdminLayout      from './pages/admin/AdminLayout.jsx';
import AdminDashboard   from './pages/admin/AdminDashboard.jsx';
import AdminMenuPage    from './pages/admin/AdminMenuPage.jsx';
import AdminMenuForm    from './pages/admin/AdminMenuForm.jsx';
import AdminOrdersPage  from './pages/admin/AdminOrdersPage.jsx';
import AdminChefsPage   from './pages/admin/AdminChefsPage.jsx';
import AdminContactPage from './pages/admin/AdminContactPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* ── Customer Routes ── */}
          <Route path="/"                              element={<HomePage />} />
          <Route path="/about"                         element={<AboutPage />} />
          <Route path="/menu"                          element={<MenuPage />} />
          <Route path="/menu/:id"                      element={<MenuItemDetailPage />} />
          <Route path="/cart"                          element={<CartPage />} />
          <Route path="/checkout"                      element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId"   element={<OrderConfirmationPage />} />
          <Route path="/contact"                       element={<ContactPage />} />
          <Route path="/chefs"                         element={<ChefDetailPage />} />
          <Route path="/chefs/:chefId"                 element={<ChefDetailPage />} />
          <Route path="/profile"                       element={<CustomerProfilePage />} />
          <Route path="/profile/:tab"                  element={<CustomerProfilePage />} />
          <Route path="/customer/profile"              element={<CustomerProfilePage />} />

          {/* ── Auth Routes ── */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/admin-login"     element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />

          {/* ── Admin Routes (nested under sidebar layout) ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index                element={<AdminDashboard />} />
            <Route path="menu"          element={<AdminMenuPage />} />
            <Route path="menu/new"      element={<AdminMenuForm />} />
            <Route path="menu/edit/:id" element={<AdminMenuForm />} />
            <Route path="orders"        element={<AdminOrdersPage />} />
            <Route path="chefs"         element={<AdminChefsPage />} />
            <Route path="contact"       element={<AdminContactPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
