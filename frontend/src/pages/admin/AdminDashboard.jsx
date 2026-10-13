import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat, CircleDollarSign, ClipboardList, Clock3, Flame, RefreshCw, UtensilsCrossed } from 'lucide-react';
import { adminApi, orderApi } from '../../services/api.js';

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
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsResponse, ordersResponse] = await Promise.all([adminApi.dashboard(), orderApi.getAll()]);
      setStats(statsResponse.data);
      setOrders(ordersResponse.data || []);
    } catch (requestError) {
      setError(requestError.message || 'Dashboard data could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

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
          <p className="mt-2 text-xs text-stone-500">A real-time view of orders, kitchen activity, and restaurant performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-[10px] text-stone-500 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Overview</span>
          <button onClick={loadDashboard} disabled={loading} className="flex items-center gap-2 border border-white/[0.1] px-3 py-2 text-[10px] text-stone-300 transition hover:border-orange-400/40 hover:text-orange-300 disabled:opacity-50"><RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh</button>
        </div>
      </div>

      {error && <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-red-400/20 bg-red-400/[0.05] p-4 text-xs text-red-200"><span>{error}</span><button onClick={loadDashboard} className="underline underline-offset-4">Try again</button></div>}

      <section aria-label="Restaurant statistics" className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon: Icon, accent }) => <article key={label} className="admin-stat-card border border-white/[0.07] bg-[#13110f] p-4 sm:p-5"><div className="flex items-start justify-between"><p className="text-[10px] text-stone-400">{label}</p><Icon size={15} className={accent} /></div><p className="mt-4 font-serif text-2xl text-stone-100">{loading ? '—' : value}</p><p className="mt-2 text-[9px] text-stone-600">{note}</p></article>)}
      </section>

      <section className="mt-6 border border-white/[0.07] bg-[#13110f]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
          <div><h2 className="font-serif text-lg">Recent food orders</h2><p className="mt-1 text-[10px] text-stone-500">Live order activity from checkout.</p></div>
          <Link to="/admin/orders" className="inline-flex items-center gap-1 text-[10px] text-amber-400 transition hover:text-amber-300">View all orders <ArrowRight size={12} /></Link>
        </div>
        {loading ? <div className="space-y-3 p-5">{[0, 1, 2].map((row) => <div key={row} className="h-12 animate-pulse bg-white/[0.03]" />)}</div> : orders.length ? (
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
      <p className="mt-4 flex items-center gap-1.5 text-[9px] text-stone-600"><Clock3 size={11} /> Dashboard data refreshes when you revisit or use Refresh.</p>
      <style>{`.admin-stat-card{background:linear-gradient(145deg,rgba(255,255,255,.018),transparent 65%),#13110f}`}</style>
    </div>
  );
}
