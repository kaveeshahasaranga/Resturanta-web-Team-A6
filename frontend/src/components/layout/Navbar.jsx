import { useState, useEffect } from 'react';
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
  const location  = useLocation();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  // Add shadow on scroll
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
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Right Actions ─────────────────────────────────────────── */}
          <div className="ml-auto flex items-center gap-3">
            {/* Reserve Table CTA */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center bg-fuchsiusOrange hover:bg-orange-500
                         text-white text-[11px] font-bold tracking-[0.12em] uppercase
                         px-5 py-2.5 rounded-sm transition-colors duration-200"
            >
              RESERVE TABLE
            </Link>

            {/* User icon */}
            {user ? (
              <button
                onClick={() => user.role === 'ADMIN' ? navigate('/admin') : navigate('/profile')}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center
                           justify-center text-gray-300 hover:text-white hover:border-white/50
                           transition-colors duration-200"
                title={user.role === 'ADMIN' ? 'Admin panel' : 'My Profile'}
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
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden w-9 h-9 flex items-center justify-center
                         text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ──────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 animate-fade-in">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`block px-2 py-3 text-xs font-semibold tracking-[0.18em] uppercase
                            transition-colors duration-200 border-b border-white/5
                            ${isActive(to)
                              ? 'text-fuchsiusWhite'
                              : 'text-gray-500 hover:text-white'
                            }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 block text-center bg-fuchsiusOrange text-white text-xs
                         font-bold tracking-widest uppercase py-3 rounded-sm"
            >
              RESERVE TABLE
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
