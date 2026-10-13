import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  Flame, LayoutDashboard, Tag, UtensilsCrossed,
  ShoppingBag, FileText, Settings, LogOut, Bell, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Footer from '../../components/layout/Footer.jsx';

// ─── Sidebar nav definition ───────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/admin',         label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/menu',    label: 'Menu Items',   icon: UtensilsCrossed },
  { to: '/admin/orders',  label: 'Orders',       icon: ShoppingBag },
  { to: '/admin/chefs',   label: 'Chefs',        icon: FileText },
  { to: '/admin/contact', label: 'Messages',     icon: FileText },
];

const BOTTOM_ITEMS = [
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

// ─── Top Admin Bar ────────────────────────────────────────────────────────────
function AdminTopBar({ user, onLogout }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[52px]
                       bg-[#0d0d0d] border-b border-white/[0.07]
                       flex items-center px-5 gap-4">

      {/* Brand + breadcrumb */}
      <Link to="/admin"
        className="font-serif font-bold tracking-[0.22em] text-fuchsiusOrange
                   text-[13px] uppercase shrink-0">
        FUCHSIUS
      </Link>
      <span className="text-gray-700 text-sm">/</span>
      <span className="text-gray-400 text-[12px]">Admin Portal</span>

      <div className="ml-auto flex items-center gap-3">
        {/* Preview button */}
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-gray-400
                     border border-white/15 hover:border-white/30
                     text-[10px] font-semibold tracking-[0.12em] uppercase
                     px-3.5 py-1.5 transition-colors duration-200"
        >
          PREVIEW SITE
          <ExternalLink className="w-3 h-3" />
        </Link>

        {/* Bell */}
        <button className="relative w-8 h-8 flex items-center justify-center
                           text-gray-500 hover:text-gray-300 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-fuchsiusOrange
                           rounded-full border border-[#0d0d0d]" />
        </button>

        {/* Admin user */}
        <div className="flex items-center gap-2.5 border-l border-white/[0.08] pl-3">
          <div className="w-7 h-7 rounded-full bg-fuchsiusOrange/20 border
                          border-fuchsiusOrange/30 flex items-center justify-center
                          text-fuchsiusOrange text-xs font-bold">
            {user?.name?.[0] ?? 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-fuchsiusWhite text-[11px] font-semibold leading-none">
              {user?.name ?? 'Admin'}
            </p>
            <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.15em]
                          uppercase mt-0.5">
              SUPERUSER
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────
function AdminSidebar({ onLogout }) {
  return (
    <aside className="fixed left-0 top-[52px] bottom-0 w-[210px]
                      bg-[#0d0d0d] border-r border-white/[0.07]
                      flex flex-col z-40 overflow-y-auto">

      {/* Logo box */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.07]">
        <div className="w-9 h-9 bg-fuchsiusOrange/15 border border-fuchsiusOrange/30
                        flex items-center justify-center shrink-0">
          <Flame className="w-4 h-4 text-fuchsiusOrange fill-fuchsiusOrange" />
        </div>
        <div>
          <p className="text-fuchsiusOrange font-bold text-[11px] tracking-[0.18em] uppercase">
            FUCHSIUS
          </p>
          <p className="text-gray-600 text-[9px] tracking-[0.15em] uppercase">
            CULINARY HEARTH
          </p>
        </div>
      </div>

      {/* Section label */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-gray-700 text-[9px] font-bold tracking-[0.25em] uppercase">
          HEARTH MANAGEMENT
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 space-y-0.5 pb-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium
               transition-all duration-200 relative
               ${isActive
                 ? 'text-fuchsiusOrange bg-fuchsiusOrange/8 border-l-2 border-fuchsiusOrange pl-[10px]'
                 : 'text-gray-500 hover:text-gray-200 hover:bg-white/4 border-l-2 border-transparent'
               }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Settings + Log Out */}
      <div className="border-t border-white/[0.07] px-2 py-3 space-y-0.5">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium
             transition-colors duration-200
             ${isActive ? 'text-fuchsiusOrange' : 'text-gray-600 hover:text-gray-300'}`
          }
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </NavLink>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px]
                     font-medium text-gray-600 hover:text-red-400
                     transition-colors duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

// ─── Admin Layout root ────────────────────────────────────────────────────────
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Top bar */}
      <AdminTopBar user={user} onLogout={handleLogout} />

      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main scrollable area */}
      <div className="ml-[210px] pt-[52px] min-h-screen flex flex-col">
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
