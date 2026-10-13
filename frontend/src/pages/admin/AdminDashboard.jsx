<<<<<<< HEAD
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat, CircleDollarSign, ClipboardList, Clock3, Flame, RefreshCw, UtensilsCrossed } from 'lucide-react';
import { createDemoOrders, getDemoDashboardStats } from '../../data/demoOrders.js';

const money = (value) => `LKR ${Number(value || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const statusLabel = (status = 'PENDING') => status.toLowerCase().replaceAll('_', ' ');

function StatusBadge({ status }) {
  const colors = {
    PENDING: 'border-amber-400/20 bg-amber-400/[0.08] text-amber-300',
    CONFIRMED: 'border-sky-400/20 bg-sky-400/[0.08] text-sky-300',
    PREPARING: 'border-orange-400/20 bg-orange-400/[0.08] text-orange-300',
    READY: 'border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300',
    DELIVERED: 'border-stone-400/20 bg-stone-400/[0.06] text-stone-400',
    CANCELLED: 'border-red-400/20 bg-red-400/[0.06] text-red-300',
  };
  return <span className={`inline-flex whitespace-nowrap border px-2 py-1 text-[9px] capitalize ${colors[status] || colors.PENDING}`}>{statusLabel(status)}</span>;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState(createDemoOrders);
  const stats = getDemoDashboardStats(orders);

  const preparingCount = orders.filter((order) => order.status === 'PREPARING').length;
  const cards = [
    { label: 'Total revenue', value: money(stats?.totalRevenue), note: 'All recorded orders', icon: CircleDollarSign, accent: 'text-emerald-300' },
    { label: 'Orders received', value: stats?.totalOrders ?? '—', note: `${stats?.pendingOrders ?? 0} awaiting confirmation`, icon: ClipboardList, accent: 'text-amber-300' },
    { label: 'In the kitchen', value: preparingCount, note: 'Currently being prepared', icon: Flame, accent: 'text-orange-300' },
    { label: 'Menu items', value: stats?.totalMenuItems ?? '—', note: 'Available in your catalogue', icon: UtensilsCrossed, accent: 'text-sky-300' },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-orange-400">◆ Hearth kitchen / food dispatch console</p>
          <h1 className="mt-2 font-serif text-2xl uppercase tracking-wide sm:text-3xl">Praneetha food operations</h1>
          <p className="mt-2 text-xs text-stone-500">A preview of orders, kitchen activity, and restaurant performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 border border-amber-400/15 bg-amber-400/[0.04] px-2.5 py-2 text-[9px] text-amber-300 sm:flex">Preview mode · sample data</span>
          <button onClick={() => setOrders(createDemoOrders())} className="flex items-center gap-2 border border-white/[0.1] px-3 py-2 text-[10px] text-stone-300 transition hover:border-orange-400/40 hover:text-orange-300"><RefreshCw size={12} /> Reset samples</button>
        </div>
      </div>

      <div className="mt-5 border border-amber-400/15 bg-amber-400/[0.04] px-3 py-2.5 text-[9px] text-amber-200/80">Demo dashboard · summary figures and recent tickets are local sample data for preview.</div>

      <section aria-label="Restaurant statistics" className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon: Icon, accent }) => <article key={label} className="admin-stat-card border border-white/[0.07] bg-[#13110f] p-4 sm:p-5"><div className="flex items-start justify-between"><p className="text-[10px] text-stone-400">{label}</p><Icon size={15} className={accent} /></div><p className="mt-4 font-serif text-2xl text-stone-100">{value}</p><p className="mt-2 text-[9px] text-stone-600">{note}</p></article>)}
      </section>

      <section className="mt-6 border border-white/[0.07] bg-[#13110f]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
          <div><h2 className="font-serif text-lg">Recent food orders</h2><p className="mt-1 text-[10px] text-stone-500">Sample kitchen tickets for this preview.</p></div>
          <Link to="/admin/orders" className="inline-flex items-center gap-1 text-[10px] text-amber-400 transition hover:text-amber-300">View all orders <ArrowRight size={12} /></Link>
        </div>
        {orders.length ? (
          <div className="divide-y divide-white/[0.05]">
            {orders.slice(0, 6).map((order) => {
              const itemSummary = order.items?.map((item) => `${item.quantity} × ${item.menuItem?.name || 'Menu item'}`).join(', ') || 'Order details unavailable';
              const created = order.createdAt ? new Date(order.createdAt).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently placed';
              return <article key={order.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-3.5 sm:grid-cols-[minmax(0,1.2fr)_minmax(130px,1.5fr)_auto_auto] sm:px-5">
                <div className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center border border-amber-400/15 bg-amber-400/[0.05] text-[9px] text-amber-300">#{order.id}</span><div className="min-w-0"><p className="truncate text-xs text-stone-200">{order.customerName}</p><p className="mt-1 truncate text-[9px] text-stone-600">{created}</p></div></div>
                <p title={itemSummary} className="col-span-2 truncate pl-11 text-[10px] text-stone-500 sm:col-span-1 sm:pl-0">{itemSummary}</p>
                <p className="text-right text-[10px] text-amber-300">{money(order.total)}</p>
                <div className="col-start-2 row-start-1 sm:col-auto sm:row-auto"><StatusBadge status={order.status} /></div>
              </article>;
            })}
          </div>
        ) : <div className="px-5 py-12 text-center"><ChefHat size={22} className="mx-auto text-stone-600" /><p className="mt-3 text-sm text-stone-300">No orders yet</p><p className="mt-1 text-[10px] text-stone-600">New checkout orders will show up here.</p></div>}
      </section>
      <p className="mt-4 flex items-center gap-1.5 text-[9px] text-stone-600"><Clock3 size={11} /> Sample statuses can be changed from the Food Orders tab during preview.</p>
      <style>{`.admin-stat-card{background:linear-gradient(145deg,rgba(255,255,255,.018),transparent 65%),#13110f}`}</style>
=======
import { useEffect, useState } from 'react';
import { ShoppingBag, UtensilsCrossed, DollarSign, MessageSquare, TrendingUp } from 'lucide-react';
import { adminApi } from '../../services/api.js';

const StatCard = ({ icon: Icon, label, value, color = 'text-fuchsiusOrange' }) => (
  <div className="card flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-fuchsiusWhite mt-0.5">{value}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-serif font-bold mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Welcome back to FUCHSIUS admin</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-24 animate-pulse bg-neutral-900" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard icon={ShoppingBag}    label="Total Orders"    value={stats.totalOrders}    />
          <StatCard icon={DollarSign}     label="Total Revenue"   value={`$${parseFloat(stats.totalRevenue).toFixed(2)}`} color="text-green-400" />
          <StatCard icon={TrendingUp}     label="Pending Orders"  value={stats.pendingOrders}  color="text-yellow-400" />
          <StatCard icon={UtensilsCrossed} label="Menu Items"     value={stats.totalMenuItems} color="text-blue-400" />
        </div>
      ) : (
        <p className="text-red-400">Failed to load stats.</p>
      )}

      <div className="mt-8 card">
        <h2 className="font-semibold text-gray-300 mb-2">Quick Actions</h2>
        <div className="flex flex-wrap gap-3 mt-3">
          <a href="/admin/menu/new" className="btn-primary text-sm">+ Add Menu Item</a>
          <a href="/admin/orders"   className="btn-outline text-sm">View Orders</a>
          <a href="/admin/contact"  className="btn-ghost text-sm flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Messages {stats?.unreadMessages > 0 && `(${stats.unreadMessages} new)`}
          </a>
        </div>
      </div>
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
    </div>
  );
}
