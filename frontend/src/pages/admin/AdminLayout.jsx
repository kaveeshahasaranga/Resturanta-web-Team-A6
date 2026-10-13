<<<<<<< HEAD
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { Bell, ChefHat, ClipboardList, ExternalLink, LayoutDashboard, LogOut, Mail, Menu as MenuIcon, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Footer from '../../components/layout/Footer.jsx';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/menu', label: 'Menu items', icon: MenuIcon },
  { to: '/admin/chefs', label: 'Chefs', icon: ChefHat },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/contact', label: 'Messages', icon: Mail },
=======
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed, LayoutDashboard, ListOrdered, ChefHat,
  MessageSquare, LogOut, Menu, X, ShoppingBag
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/admin',         label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/menu',    label: 'Menu Items',   icon: UtensilsCrossed },
  { to: '/admin/orders',  label: 'Orders',       icon: ShoppingBag },
  { to: '/admin/chefs',   label: 'Chefs',        icon: ChefHat },
  { to: '/admin/contact', label: 'Messages',     icon: MessageSquare },
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD

  const handleLogout = () => {
    logout();
    navigate('/admin-login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0b0a09] text-stone-100 lg:flex">
      <aside className="admin-sidebar flex w-full shrink-0 flex-col border-b border-white/[0.07] lg:fixed lg:inset-y-0 lg:w-56 lg:border-b-0 lg:border-r">
        <Link to="/" className="flex h-16 items-center gap-3 border-b border-white/[0.07] px-5">
          <span className="flex h-8 w-8 items-center justify-center border border-orange-500/30 bg-orange-500/[0.08] text-orange-400"><UtensilsCrossed size={15} /></span>
          <span><span className="block font-serif text-sm tracking-[0.2em]">PRANEETHA</span><span className="mt-0.5 block text-[8px] uppercase tracking-[0.24em] text-stone-500">Hearth operations</span></span>
        </Link>
        <div className="hidden px-4 pt-7 text-[8px] uppercase tracking-[0.25em] text-stone-600 lg:block">Management</div>
        <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible lg:py-3">
          {navItems.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex shrink-0 items-center gap-3 border px-3 py-2.5 text-xs transition ${isActive ? 'border-orange-500/20 bg-orange-500 text-white shadow-[0_4px_16px_rgba(234,88,12,.14)]' : 'border-transparent text-stone-400 hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-white'}`}><Icon size={15} />{label}</NavLink>)}
        </nav>
        <div className="mt-auto hidden space-y-1 border-t border-white/[0.07] p-3 lg:block">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs text-stone-500 transition hover:text-orange-300"><LogOut size={14} /> Log out</button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-56">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#0b0a09]/90 px-4 backdrop-blur-md sm:px-7">
          <div className="flex items-center gap-2 text-xs"><span className="text-orange-400">◆ PRANEETHA</span><span className="text-stone-600">—</span><span className="text-stone-300">Admin portal</span></div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="hidden items-center gap-1.5 border border-white/[0.09] px-3 py-2 text-[10px] text-stone-300 transition hover:border-orange-400/40 hover:text-orange-300 sm:flex">Preview home site <ExternalLink size={12} /></Link>
            <Link to="/admin/contact" aria-label="Open messages" title="Open messages" className="relative border border-white/[0.09] p-2 text-stone-400 hover:text-orange-300"><Bell size={14} /></Link>
            <div className="hidden text-right sm:block"><p className="text-[10px] text-stone-200">{user?.name || 'Hearth Admin'}</p><p className="text-[8px] uppercase tracking-[0.16em] text-stone-500">Administrator</p></div>
            <button onClick={handleLogout} aria-label="Log out" className="p-2 text-stone-500 hover:text-orange-300 lg:hidden"><LogOut size={15} /></button>
          </div>
        </header>

        <main className="flex-1 px-4 py-7 sm:px-7 sm:py-9"><Outlet /></main>
        <Footer />
      </div>
=======
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex bg-fuchsiusBlack">

      {/* ─── Fixed Left Sidebar ───────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-neutral-950 border-r border-white/10
          transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Logo / Toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-fuchsiusOrange shrink-0" />
              <span className="text-base font-serif font-bold tracking-widest truncate">FUCHSIUS</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors ml-auto"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/10 p-3 shrink-0">
          {!collapsed && user && (
            <div className="px-2 py-2 mb-2">
              <p className="text-xs font-semibold text-fuchsiusWhite truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300
              ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'} min-h-screen`}>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
    </div>
  );
}
