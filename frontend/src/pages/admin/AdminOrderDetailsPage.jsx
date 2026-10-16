import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ClipboardList, MapPin, UserRound } from 'lucide-react';
import { createDemoOrders } from '../../data/demoOrders.js';

const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
const money = (value) => `LKR ${Number(value || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const dateLabel = (date) => date ? new Date(date).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const humanStatus = (status = 'PENDING') => status.toLowerCase().replaceAll('_', ' ');
const statusTone = {
  PENDING: 'border-amber-400/25 bg-amber-400/[0.08] text-amber-300',
  CONFIRMED: 'border-sky-400/25 bg-sky-400/[0.08] text-sky-300',
  PREPARING: 'border-orange-400/25 bg-orange-400/[0.08] text-orange-300',
  READY: 'border-blue-400/25 bg-blue-400/[0.08] text-blue-300',
  DELIVERED: 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300',
  CANCELLED: 'border-red-400/25 bg-red-400/[0.08] text-red-300',
};

function InfoCard({ title, icon: Icon, children }) {
  return <section className="border border-white/[0.08] bg-[#13110f] p-4 sm:p-5"><div className="mb-4 flex items-center gap-2 text-orange-300"><Icon size={14} /><h2 className="text-[9px] uppercase tracking-[0.18em]">{title}</h2></div>{children}</section>;
}

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const passedOrder = location.state?.order;
  const [order, setOrder] = useState(() => {
    if (passedOrder && String(passedOrder.id) === orderId) return passedOrder;
    return createDemoOrders().find((entry) => String(entry.id) === orderId) || null;
  });

  const updateStatus = (status) => setOrder((current) => current ? { ...current, status } : current);
  const backToOrders = () => navigate('/admin/orders', { state: { updatedOrder: order } });

  if (!order) return <div className="mx-auto max-w-4xl"><Link to="/admin/orders" className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-orange-300"><ArrowLeft size={14} /> Back to orders</Link><section className="mt-5 border border-white/[0.08] bg-[#13110f] p-10 text-center"><ClipboardList size={22} className="mx-auto text-stone-600" /><h1 className="mt-4 font-serif text-2xl">Order not found</h1><p className="mt-2 text-sm text-stone-500">This order may have been removed or the link may be incorrect.</p></section></div>;

  const paymentNote = order.notes?.match(/Payment preference: ([^|]+)/i)?.[1]?.trim();
  return <div className="mx-auto max-w-5xl">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><Link to="/admin/orders" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-widest text-stone-500 transition hover:text-orange-300"><ArrowLeft size={12} /> All food orders</Link><p className="mt-5 text-[9px] uppercase tracking-[0.25em] text-orange-400">Kitchen ticket · #{order.id}</p><h1 className="mt-1 font-serif text-3xl uppercase tracking-wide">Order details</h1><p className="mt-2 text-xs text-stone-500">Placed {dateLabel(order.createdAt)}</p></div>
      <div className="flex items-center gap-3"><span className={`border px-3 py-2 text-[9px] capitalize ${statusTone[order.status] || statusTone.PENDING}`}>{humanStatus(order.status)}</span><label className="text-[9px] text-stone-500">Update status<select aria-label="Update order status" value={order.status} onChange={(event) => updateStatus(event.target.value)} className="ml-2 border border-white/10 bg-[#0f0e0c] px-2.5 py-2 text-[10px] capitalize text-stone-200 outline-none focus:border-orange-500/50">{statuses.map((status) => <option key={status} value={status} className="bg-[#151310]">{humanStatus(status)}</option>)}</select></label></div>
    </div>

    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <InfoCard title="Customer information" icon={UserRound}><div className="grid gap-4 sm:grid-cols-2"><div><p className="text-[9px] text-stone-600">Customer</p><p className="mt-1 text-sm text-stone-200">{order.customerName}</p></div><div><p className="text-[9px] text-stone-600">Email</p><p className="mt-1 break-all text-xs text-stone-300">{order.customerEmail}</p></div><div><p className="text-[9px] text-stone-600">Phone</p><p className="mt-1 text-xs text-stone-300">{order.customerPhone || 'Not provided'}</p></div><div><p className="text-[9px] text-stone-600">Payment preference</p><p className="mt-1 text-xs text-stone-300">{paymentNote || 'Not provided'}</p></div></div></InfoCard>
        <InfoCard title="Fulfilment" icon={MapPin}><div className="grid gap-4 sm:grid-cols-2"><div><p className="text-[9px] text-stone-600">Method</p><p className="mt-1 text-xs text-stone-300">{order.deliveryAddress ? 'Delivery' : 'Pickup'}</p></div><div><p className="text-[9px] text-stone-600">Destination</p><p className="mt-1 text-xs leading-5 text-stone-300">{order.deliveryAddress || 'Hearth counter pickup'}</p></div></div></InfoCard>
        {order.notes && <InfoCard title="Customer note" icon={ClipboardList}><p className="text-xs leading-5 text-stone-300">{order.notes.split('| Payment preference:')[0].trim() || order.notes}</p></InfoCard>}
      </div>

      <InfoCard title="Order items" icon={ClipboardList}><div className="divide-y divide-white/[0.06]">{(order.items || []).map((item) => <div key={item.id} className="flex justify-between gap-3 py-3 first:pt-0"><div><p className="text-xs text-stone-200">{item.menuItem?.name || 'Menu item'}</p><p className="mt-1 text-[9px] text-stone-600">Qty {item.quantity} · {money(item.unitPrice)} each</p></div><span className="shrink-0 text-xs text-stone-300">{money(item.totalPrice)}</span></div>)}</div><div className="mt-3 flex justify-between border-t border-white/[0.07] pt-3 text-xs"><span className="text-stone-400">Order total</span><span className="text-amber-300">{money(order.total)}</span></div><button onClick={backToOrders} className="mt-5 w-full border border-white/10 px-4 py-2.5 text-[9px] uppercase tracking-widest text-stone-300 transition hover:border-orange-400/40 hover:text-orange-300">Back to order list</button></InfoCard>
    </div>
    <p className="mt-5 text-[9px] text-stone-600">Preview mode · sample order details</p>
  </div>;
}
