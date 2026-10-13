<<<<<<< HEAD
import React, { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flame, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_LINKS = [
  { to: '/',        label: 'HOME' },
  { to: '/about',   label: 'ABOUT' },
  { to: '/chefs',   label: 'CHEFS' },
  { to: '/menu',    label: 'MENU' },
  { to: '/contact', label: 'CONTACT' },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

<<<<<<< HEAD
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
=======
  // Add shadow/border on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        bg-[#111111]
        ${scrolled ? 'border-b border-white/8 shadow-[0_2px_30px_rgba(0,0,0,0.6)]' : ''}`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center h-[64px]">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="FUCHSIUS home"
          >
            <Flame
              className="w-6 h-6 text-fuchsiusOrange fill-fuchsiusOrange
                         group-hover:scale-110 transition-transform duration-300"
            />
            <span
              className="font-serif font-bold tracking-[0.25em] text-fuchsiusOrange
                         text-[15px] uppercase"
            >
              FUCHSIUS
            </span>
          </Link>

          {/* ── Desktop Nav Links (centered) ───────────────────────────── */}
          <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`text-[11px] font-semibold tracking-[0.18em] uppercase
                              transition-colors duration-200
                              ${isActive(to)
                                ? 'text-fuchsiusWhite underline underline-offset-4 decoration-fuchsiusOrange'
                                : 'text-gray-400 hover:text-fuchsiusWhite'
                              }`}
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
                >
                  <span>{label}</span>
                  {isActive(to) && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e66200] rounded-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

<<<<<<< HEAD
          {/* ─── Right Actions ─── */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Reserve Table Button */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-lg bg-[#e66200] hover:bg-orange-600 text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(230,98,0,0.4)] hover:shadow-[0_0_25px_rgba(230,98,0,0.6)] active:scale-95 cursor-pointer"
=======
          {/* ── Right Actions ─────────────────────────────────────────── */}
          <div className="ml-auto flex items-center gap-3">
            {/* Reserve Table CTA */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center bg-fuchsiusOrange hover:bg-orange-500
                         text-white text-[11px] font-bold tracking-[0.12em] uppercase
                         px-5 py-2.5 rounded-sm transition-colors duration-200"
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
            >
              RESERVE TABLE
            </Link>

<<<<<<< HEAD
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
=======
            {/* User icon */}
            {user ? (
              <button
                onClick={() => user.role === 'ADMIN' ? navigate('/admin') : logout()}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center
                           justify-center text-gray-300 hover:text-white hover:border-white/50
                           transition-colors duration-200"
                title={user.role === 'ADMIN' ? 'Admin panel' : 'Logout'}
              >
                <User className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/login"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center
                           justify-center text-gray-300 hover:text-white hover:border-white/50
                           transition-colors duration-200"
                title="Sign in"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* Cart / Bag icon */}
            <Link
              to="/cart"
              className="relative w-9 h-9 flex items-center justify-center
                         text-gray-300 hover:text-white transition-colors duration-200"
              title="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-fuchsiusOrange
                             text-white text-[10px] font-bold rounded-full flex items-center
                             justify-center leading-none"
                >
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

<<<<<<< HEAD
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle Navigation Menu"
=======
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden w-9 h-9 flex items-center justify-center
                         text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

<<<<<<< HEAD
        {/* ─── Mobile Drawer ─── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.08] py-4 space-y-2 animate-fade-in">
            {navLinks.map(({ to, label }) => (
=======
        {/* ── Mobile Drawer ──────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 animate-fade-in">
            {NAV_LINKS.map(({ to, label }) => (
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
<<<<<<< HEAD
                className={`block px-4 py-2.5 rounded-lg text-xs font-sans tracking-[0.16em] uppercase font-medium transition-colors ${
                  isActive(to)
                    ? 'text-[#e66200] bg-[#e66200]/10'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
=======
                className={`block px-2 py-3 text-xs font-semibold tracking-[0.18em] uppercase
                            transition-colors duration-200 border-b border-white/5
                            ${isActive(to)
                              ? 'text-fuchsiusWhite'
                              : 'text-gray-500 hover:text-white'
                            }`}
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
              >
                {label}
              </Link>
            ))}
<<<<<<< HEAD

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
=======
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 block text-center bg-fuchsiusOrange text-white text-xs
                         font-bold tracking-widest uppercase py-3 rounded-sm"
            >
              RESERVE TABLE
            </Link>
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
          </div>
        )}
      </nav>
    </header>
  );
}
