import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, ClipboardList, Clock3, Eye, Flame, RefreshCw, Search, Truck } from 'lucide-react';
import { createDemoOrders } from '../../data/demoOrders.js';

const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
const filters = [
  { id: 'ALL', label: 'All orders' },
  { id: 'PENDING', label: 'Received' },
  { id: 'PREPARING', label: 'Simmering' },
  { id: 'READY', label: 'Dispatched' },
  { id: 'DELIVERED', label: 'Delivered' },
];

const money = (value) => `LKR ${Number(value || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const humanStatus = (status = 'PENDING') => status.toLowerCase().replaceAll('_', ' ');
const dateLabel = (date) => date ? new Date(date).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const isToday = (date) => {
  if (!date) return false;
  const value = new Date(date);
  const today = new Date();
  return value.getFullYear() === today.getFullYear() && value.getMonth() === today.getMonth() && value.getDate() === today.getDate();
};
const statusTone = {
  PENDING: 'border-amber-400/25 bg-amber-400/[0.08] text-amber-300',
  CONFIRMED: 'border-sky-400/25 bg-sky-400/[0.08] text-sky-300',
  PREPARING: 'border-orange-400/25 bg-orange-400/[0.08] text-orange-300',
  READY: 'border-blue-400/25 bg-blue-400/[0.08] text-blue-300',
  DELIVERED: 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300',
  CANCELLED: 'border-red-400/25 bg-red-400/[0.08] text-red-300',
};

function Metric({ label, value, detail, icon: Icon, color }) {
  return <article className="order-metric border border-white/[0.07] bg-[#13110f] p-3.5 sm:p-4"><p className="text-[9px] text-stone-500">{label}</p><div className="mt-2 flex items-center justify-between gap-2"><span className={`font-serif text-lg sm:text-xl ${color}`}>{value}</span><Icon size={14} className={color} /></div><p className="mt-1 text-[8px] text-stone-600">{detail}</p></article>;
}

export default function AdminOrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState(() => {
    const initialOrders = createDemoOrders();
    const updatedOrder = location.state?.updatedOrder;
    return updatedOrder ? initialOrders.map((order) => order.id === updatedOrder.id ? updatedOrder : order) : initialOrders;
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const todayOrders = useMemo(() => orders.filter((order) => isToday(order.createdAt)), [orders]);
  const kitchenOrders = orders.filter((order) => order.status === 'PREPARING');
  const readyCount = orders.filter((order) => order.status === 'READY').length;
  const cookingItems = kitchenOrders.reduce((sum, order) => sum + (order.items || []).reduce((count, item) => count + item.quantity, 0), 0);
  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = filter === 'ALL' || order.status === filter;
      const haystack = [order.id, order.customerName, order.customerEmail, order.customerPhone, order.deliveryAddress, ...(order.items || []).map((item) => item.menuItem?.name)].filter(Boolean).join(' ').toLowerCase();
      return matchesFilter && (!term || haystack.includes(term));
    });
  }, [filter, orders, search]);

  const updateOrder = (order, status) => {
    if (!status || status === order.status) return;
    const updated = { ...order, status };
    setOrders((current) => current.map((entry) => entry.id === order.id ? updated : entry));
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-[9px] uppercase tracking-[0.28em] text-orange-400">◆ Operations console / no table bookings</p><h1 className="mt-2 font-serif text-2xl uppercase tracking-wide sm:text-3xl">Food order management</h1><p className="mt-2 text-xs text-stone-500">Track every kitchen ticket from order received to delivery.</p></div>
          <div className="flex items-center gap-2"><Link to="/admin" className="border border-white/[0.08] px-3 py-2 text-[9px] text-stone-400 transition hover:text-stone-200">Kitchen overview</Link><span className="flex items-center gap-2 border border-orange-500/25 bg-orange-500/[0.08] px-3 py-2 text-[9px] text-orange-300">Food orders <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-white">{orders.length}</span></span></div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border border-amber-400/15 bg-amber-400/[0.04] px-3 py-2.5 text-[9px] text-amber-200/80"><span>Preview mode · sample orders for testing filters and status controls</span><button onClick={() => setOrders(createDemoOrders())} className="inline-flex items-center gap-1.5 text-amber-300 transition hover:text-amber-200"><RefreshCw size={10} /> Reset sample data</button></div>

      <section className="mt-6 grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <Metric label="Active kitchen orders" value={`${kitchenOrders.length} orders`} detail="Currently being prepared" icon={Flame} color="text-stone-100" />
        <Metric label="Items on the hearth" value={`${cookingItems} items`} detail="Across simmering tickets" icon={ChefHat} color="text-orange-300" />
        <Metric label="Ready to dispatch" value={`${readyCount} orders`} detail="Awaiting collection or delivery" icon={Truck} color="text-sky-300" />
        <Metric label="Today’s food revenue" value={money(todayOrders.reduce((sum, order) => sum + (order.status === 'CANCELLED' ? 0 : Number(order.total)), 0))} detail={`${todayOrders.length} orders received today`} icon={Clock3} color="text-amber-300" />
      </section>

      <section className="mt-5 border border-white/[0.07] bg-[#13110f]">
        <div className="flex flex-col gap-3 border-b border-white/[0.07] p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <label className="relative block w-full sm:max-w-sm"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by order number, customer, phone, address…" className="w-full border border-white/[0.09] bg-[#0f0e0c] py-2.5 pl-9 pr-3 text-[10px] text-stone-200 outline-none placeholder:text-stone-600 focus:border-orange-500/50" /></label>
          <button onClick={() => setOrders(createDemoOrders())} className="flex items-center justify-center gap-2 border border-white/[0.09] px-3 py-2.5 text-[9px] text-stone-400 transition hover:text-orange-300"><RefreshCw size={12} /> Reset sample orders</button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-3 py-3 sm:px-4">
          <div className="flex flex-wrap gap-1.5">{filters.map((tab) => <button key={tab.id} onClick={() => setFilter(tab.id)} className={`px-3 py-1.5 text-[9px] capitalize transition ${filter === tab.id ? 'bg-orange-500 text-white' : 'text-stone-500 hover:bg-white/[0.04] hover:text-stone-300'}`}>{tab.label}</button>)}</div>
          <p className="text-[9px] text-stone-500">Showing <span className="text-amber-300">{filteredOrders.length}</span> orders</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] border-collapse text-left">
            <thead><tr className="border-b border-white/[0.07] text-[8px] uppercase tracking-[0.12em] text-stone-600"><th className="px-4 py-3 font-normal">Order ID &amp; date</th><th className="px-3 py-3 font-normal">Customer</th><th className="px-3 py-3 font-normal">Fulfilment</th><th className="px-3 py-3 font-normal">Destination / items</th><th className="px-3 py-3 font-normal">Items</th><th className="px-3 py-3 font-normal">Kitchen status</th><th className="px-3 py-3 text-right font-normal">Settlement</th><th className="px-4 py-3 text-right font-normal">Details</th></tr></thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredOrders.length ? filteredOrders.map((order) => {
                const quantity = (order.items || []).reduce((sum, item) => sum + item.quantity, 0);
                const itemNames = order.items?.map((item) => item.menuItem?.name).filter(Boolean).join(', ') || '—';
                const destination = order.deliveryAddress || 'Hearth counter pickup';
                return <tr key={order.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3"><p className="text-[10px] font-medium text-amber-300">#PRN-{String(order.id).padStart(4, '0')}</p><p className="mt-1 whitespace-nowrap text-[8px] text-stone-600">{dateLabel(order.createdAt)}</p></td>
                  <td className="px-3 py-3"><p className="max-w-40 truncate text-[10px] text-stone-200">{order.customerName}</p><p className="mt-1 text-[8px] text-stone-600">{order.customerPhone || order.customerEmail}</p></td>
                  <td className="px-3 py-3 text-[9px] text-stone-400">{order.deliveryAddress ? 'Delivery' : 'Pickup'}</td>
                  <td className="px-3 py-3"><p title={destination} className="max-w-52 truncate text-[9px] text-stone-300">{destination}</p><p title={itemNames} className="mt-1 max-w-52 truncate text-[8px] text-stone-600">{itemNames}</p></td>
                  <td className="px-3 py-3 text-[10px] text-amber-300">{quantity}</td>
                  <td className="px-3 py-3"><label className="sr-only" htmlFor={`status-${order.id}`}>Update order {order.id} status</label><select id={`status-${order.id}`} value={order.status} onChange={(event) => updateOrder(order, event.target.value)} className={`max-w-32 cursor-pointer appearance-none border bg-[#100f0d] px-2 py-1.5 text-[9px] capitalize outline-none ${statusTone[order.status] || statusTone.PENDING}`}>{statuses.map((status) => <option key={status} value={status} className="bg-[#151310] text-stone-200">{humanStatus(status)}</option>)}</select></td>
                  <td className="px-3 py-3 text-right text-[9px] text-stone-300">{money(order.total)}</td>
                  <td className="px-4 py-3 text-right"><Link to={`/admin/orders/${order.id}`} state={{ order }} className="inline-flex items-center gap-1 border border-amber-400/20 px-2 py-1.5 text-[9px] text-amber-300 transition hover:border-amber-400/50 hover:bg-amber-400/[0.05]"><Eye size={11} /> View order</Link></td>
                </tr>;
              }) : <tr><td colSpan="8" className="px-4 py-14 text-center"><ClipboardEmpty /><p className="mt-3 text-xs text-stone-300">{orders.length ? 'No orders match your search.' : 'No food orders yet.'}</p><p className="mt-1 text-[9px] text-stone-600">New checkout orders will appear here.</p></td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`.order-metric{background:linear-gradient(145deg,rgba(255,255,255,.018),transparent 60%),#13110f}`}</style>
    </div>
  );
}

function ClipboardEmpty() {
  return <div className="mx-auto flex h-10 w-10 items-center justify-center border border-white/[0.08] text-stone-600"><ClipboardList size={17} /></div>;
}
