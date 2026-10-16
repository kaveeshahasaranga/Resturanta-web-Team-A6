import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Flame, LoaderCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { orderApi } from '../../services/api.js';

const money = (amount) => `LKR ${Number(amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const paymentLabel = (payment) => {
  if (payment === 'hearth') return 'Pay at restaurant';
  if (payment === 'wallet') return 'Wallet selected · not charged';
  if (payment === 'card') return 'Card selected · not charged';
  return 'Payment preference saved';
};

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [payment, setPayment] = useState(location.state?.payment || '');
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    orderApi.getById(orderId)
      .then((response) => {
        if (!active) return;
        setOrder(response.data);
        setLoading(false);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message || 'We couldn’t load this order.');
        setLoading(false);
      });
    return () => { active = false; };
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0a09] text-stone-100">
      <Navbar />
      <main className="confirmation-page flex-1 px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link to="/menu" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 transition hover:text-orange-400"><ArrowLeft size={13} /> Return to menu / continue browsing</Link>
          <section className="confirmation-card mt-5 px-6 py-9 sm:px-10 sm:py-12">
            {loading ? (
              <div className="py-12 text-center"><LoaderCircle className="mx-auto animate-spin text-orange-400" /><p className="mt-4 text-sm text-stone-400">Loading your order…</p></div>
            ) : error && !order ? (
              <div className="py-10 text-center"><p className="confirmation-eyebrow">ORDER DETAILS</p><h1 className="mt-3 font-serif text-3xl">We couldn’t find this order.</h1><p className="mt-3 text-sm text-stone-400">{error}</p><Link to="/menu" className="praneetha-btn-primary mt-7 inline-flex">Back to menu</Link></div>
            ) : order ? (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/50 bg-orange-500/[0.08] text-orange-500 shadow-[0_0_24px_rgba(234,88,12,.18)]"><Flame size={24} fill="currentColor" /></div>
                <p className="confirmation-eyebrow mt-5">ORDER RECEIVED · #{order.id}</p>
                <h1 className="mt-2 text-center font-serif text-3xl uppercase leading-tight sm:text-4xl">Thank you, {order.customerName}</h1>
                <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-stone-400">Your order is with our hearth team. We’ll send an update to {order.customerEmail} when it’s ready.</p>
                <div className="my-7 border-t border-white/[0.08]" />
                <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4">
                  <div><p className="confirmation-label">DELIVERY ADDRESS</p><p className="confirmation-value">{order.deliveryAddress || 'Pickup / confirm with our team'}</p></div>
                  <div><p className="confirmation-label">YOUR ORDER</p><p className="confirmation-value">{order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items · {money(order.total)}</p></div>
                  <div><p className="confirmation-label">ORDER STATUS</p><p className="confirmation-value text-amber-300">{order.status || 'Pending confirmation'}</p></div>
                  <div><p className="confirmation-label">PAYMENT</p><p className="confirmation-value text-emerald-300">{paymentLabel(payment)}</p></div>
                </div>
                {order.items?.length > 0 && <div className="mt-7 border-t border-white/[0.08] pt-5"><p className="confirmation-label mb-3">ORDER SUMMARY</p><div className="space-y-2">{order.items.map((item) => <div className="flex justify-between gap-4 text-xs" key={item.id}><span className="text-stone-300">{item.quantity} × {item.menuItem?.name || 'Menu item'}</span><span className="shrink-0 text-stone-400">{money(item.totalPrice)}</span></div>)}</div><div className="mt-3 flex justify-between border-t border-white/[0.06] pt-3 text-sm"><span>Total</span><span className="text-amber-300">{money(order.total)}</span></div></div>}
              </>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
      <style>{`.confirmation-page{background:radial-gradient(ellipse at 50% 18%,rgba(153,67,16,.09),transparent 42%),#0b0a09}.confirmation-card{border:1px solid rgba(255,255,255,.08);background:radial-gradient(ellipse at 50% 0%,rgba(70,39,19,.2),transparent 70%),#100e0c}.confirmation-eyebrow{color:#e88a23;text-align:center;font-size:9px;letter-spacing:.31em;text-transform:uppercase}.confirmation-label{font-size:8px;letter-spacing:.12em;color:#766e65}.confirmation-value{margin-top:.4rem;font-size:11px;line-height:1.55;color:#eee8e0}`}</style>
    </div>
  );
}
