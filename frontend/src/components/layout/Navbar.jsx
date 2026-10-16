import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flame, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/menu', label: 'MENU' },
    { to: '/chefs', label: 'CHEFS' },
    { to: '/contact', label: 'CONTACT' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* ─── Brand Logo ─── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#e66200] transition-transform duration-300 group-hover:scale-110">
              <Flame className="w-6 h-6 fill-[#e66200] text-[#e66200] filter drop-shadow-[0_0_8px_rgba(230,98,0,0.6)]" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-normal text-[#f6ede2] tracking-[0.24em] transition-colors duration-200">
              PRANEETHA
            </span>
          </Link>

          {/* ─── Center Nav Links (Desktop) ─── */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-9">
            {navLinks.map(({ to, label }) => (
              <li key={label}>
                <Link
                  to={to}
                  className={`text-xs font-sans tracking-[0.16em] uppercase font-medium transition-colors duration-200 py-1 relative ${
                    isActive(to)
                      ? 'text-white'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>{label}</span>
                  {isActive(to) && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e66200] rounded-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* ─── Right Actions ─── */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Reserve Table Button */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-lg bg-[#e66200] hover:bg-orange-600 text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(230,98,0,0.4)] hover:shadow-[0_0_25px_rgba(230,98,0,0.6)] active:scale-95 cursor-pointer"
            >
              RESERVE TABLE
            </Link>

            {/* Profile Button (Peach/Terracotta with user icon) */}
            <Link
              to="/profile"
              className="w-10 h-10 rounded-xl bg-[#f4a27e] hover:bg-[#fab494] flex items-center justify-center text-[#1b1411] transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
              title="Customer Profile"
              aria-label="Customer Profile"
            >
              <User className="w-5 h-5 stroke-[2.2]" />
            </Link>

            {/* Shopping Bag / Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-white hover:text-[#e66200] hover:bg-white/[0.04] transition-colors"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e66200] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-md">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Drawer ─── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.08] py-4 space-y-2 animate-fade-in">
            {navLinks.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-xs font-sans tracking-[0.16em] uppercase font-medium transition-colors ${
                  isActive(to)
                    ? 'text-[#e66200] bg-[#e66200]/10'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 rounded-lg bg-[#e66200] text-white text-xs font-semibold tracking-wider uppercase shadow-md"
              >
                RESERVE TABLE
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#141416] border border-white/10 text-white text-xs font-medium uppercase tracking-wider"
              >
                <User className="w-4 h-4 text-[#f4a27e]" />
                <span>My Profile</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
