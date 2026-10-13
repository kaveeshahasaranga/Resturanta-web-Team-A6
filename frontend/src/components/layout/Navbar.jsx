import { Link, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed, ShoppingCart, User, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/',       label: 'Home' },
    { to: '/menu',   label: 'Menu' },
    { to: '/chefs',  label: 'Chefs' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path
    || (path === '/chefs' && location.pathname.startsWith('/chefs/'));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <UtensilsCrossed className="w-7 h-7 text-fuchsiusOrange group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-serif font-bold text-fuchsiusWhite tracking-widest">
              FUCHSIUS
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(to)
                      ? 'text-fuchsiusOrange bg-fuchsiusOrange/10'
                      : 'text-gray-400 hover:text-fuchsiusWhite hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg text-gray-400 hover:text-fuchsiusWhite hover:bg-white/5 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsiusOrange text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="btn-outline text-xs py-1.5 px-3 hidden sm:block">
                    Admin
                  </Link>
                )}
                <button onClick={logout} className="btn-ghost text-sm hidden sm:block">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4 hidden sm:block">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-3 animate-fade-in">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  isActive(to)
                    ? 'text-fuchsiusOrange bg-fuchsiusOrange/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center mt-2 block">
                Sign In
              </Link>
            )}
            {user && (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-ghost w-full text-left mt-1">
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
