import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, LockKeyhole, Minus, Plus, ShieldCheck, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { orderApi } from '../../services/api.js';

const paymentMethods = [
  { id: 'card', label: 'Credit / debit card', detail: 'Visa, Mastercard, Amex' },
  { id: 'wallet', label: 'Apple Pay / Google Pay', detail: 'Fast and secure checkout' },
  { id: 'hearth', label: 'Pay at the restaurant', detail: 'Settle your bill when you arrive' },
];

const money = (amount) => `LKR ${Number(amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Field({ label, ...props }) {
  return <label className="block text-xs font-medium tracking-wide text-stone-300">{label}<input {...props} className="checkout-input mt-2" /></label>;
}

export default function CheckoutPage() {
  const { items, total, updateQty, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState('card');
  const [voucher, setVoucher] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '', notes: '' });
  const discount = appliedVoucher ? total * 0.1 : 0;
  const finalTotal = useMemo(() => Math.max(0, total - discount), [total, discount]);
  const setField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const applyVoucher = () => {
    if (voucher.trim().toUpperCase() === 'HEARTH10') {
      setAppliedVoucher(true);
      setError('');
    } else {
      setAppliedVoucher(false);
      setError('That code isn’t valid. Try HEARTH10.');
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError('');
    if (!items.length) return setError('Your bag is empty. Add something from the menu to continue.');
    if (!form.name.trim() || !form.email.trim()) return setError('Please add your name and email to continue.');
    setSubmitting(true);
    try {
      const result = await orderApi.create({
        customerName: form.name.trim(), customerEmail: form.email.trim(), customerPhone: form.phone.trim(), deliveryAddress: form.address.trim(),
        notes: [form.notes.trim(), `Payment preference: ${payment === 'hearth' ? 'Pay at restaurant' : payment === 'wallet' ? 'Apple Pay / Google Pay' : 'Card'}`].filter(Boolean).join(' | '),
        userId: user?.id,
        voucherCode: appliedVoucher ? 'HEARTH10' : undefined,
        items: items.map((item) => ({ menuItemId: Number(item.id), quantity: item.quantity })),
      });
      clearCart();
      navigate(`/order-confirmation/${result.data.id}`, { state: { order: result.data, payment } });
    } catch (submitError) {
      setError(submitError.message || 'We couldn’t place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0a09] text-stone-100">
      <Navbar />
      <main className="checkout-page flex-1 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link to="/cart" className="inline-flex items-center gap-2 text-xs tracking-widest text-stone-400 transition hover:text-orange-400"><ArrowLeft size={14} /> BACK TO YOUR BAG</Link>
          <div className="mt-7 mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div><p className="text-[10px] uppercase tracking-[0.34em] text-orange-400">A seat at our table</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Checkout</h1><p className="mt-2 text-sm text-stone-400">A few details, then we’ll have your order ready.</p></div>
            <div className="flex items-center gap-2 text-xs text-emerald-300"><LockKeyhole size={14} /> Secure checkout</div>
          </div>

            <form onSubmit={placeOrder} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
              <div className="space-y-5">
                <section className="checkout-panel">
                  <div className="mb-5 flex items-start justify-between"><div><p className="checkout-step">01 / YOUR DETAILS</p><h2 className="mt-1 font-serif text-xl">Who’s joining us?</h2></div><UtensilsCrossed size={19} className="text-orange-400" /></div>
                  <div className="grid gap-4 sm:grid-cols-2"><Field label="FULL NAME" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={setField} required /><Field label="EMAIL ADDRESS" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={setField} required /><Field label="PHONE (OPTIONAL)" name="phone" type="tel" autoComplete="tel" placeholder="+94 77 123 4567" value={form.phone} onChange={setField} /><Field label="DELIVERY ADDRESS (OPTIONAL)" name="address" autoComplete="street-address" placeholder="Street, city" value={form.address} onChange={setField} /><Field label="SPECIAL REQUESTS (OPTIONAL)" name="notes" placeholder="Allergies, timing, or a note for our team" value={form.notes} onChange={setField} /></div>
                </section>

                <section className="checkout-panel">
                  <div className="mb-5 flex items-start justify-between"><div><p className="checkout-step">02 / PAYMENT</p><h2 className="mt-1 font-serif text-xl">Choose how to pay</h2></div><ShieldCheck size={19} className="text-emerald-300" /></div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {paymentMethods.map((method) => <button type="button" key={method.id} onClick={() => setPayment(method.id)} className={`min-h-[88px] border p-3 text-left transition ${payment === method.id ? 'border-orange-500/70 bg-orange-500/[0.07]' : 'border-white/[0.08] bg-white/[0.015] hover:border-white/20'}`}><span className="flex items-center gap-2 text-xs font-medium text-stone-100">{method.id === 'card' && <CreditCard size={14} className="text-orange-300" />}{method.label}</span><span className="mt-2 block text-[10px] leading-4 text-stone-500">{method.detail}</span></button>)}
                  </div>
                  {payment === 'card' && <div className="mt-4 border border-white/[0.07] bg-[#100f0d] p-4"><div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-orange-300"><span>Praneetha Hearth Card</span><CreditCard size={15} /></div><Field label="CARD NUMBER" name="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" /><div className="mt-4 grid grid-cols-2 gap-4"><Field label="EXPIRY" name="expiry" autoComplete="cc-exp" placeholder="MM / YY" /><Field label="SECURITY CODE" name="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" /></div><p className="mt-3 text-[10px] text-stone-500">Card details are for display only; online card processing isn’t connected yet.</p></div>}
                  {payment === 'wallet' && <p className="mt-4 border border-white/[0.07] bg-[#100f0d] p-4 text-xs leading-5 text-stone-400">Your order will be recorded with your selected wallet preference. Wallet authorization is not connected yet.</p>}
                  {payment === 'hearth' && <p className="mt-4 border border-white/[0.07] bg-[#100f0d] p-4 text-xs leading-5 text-stone-400">We’ll reserve your order and you can settle the bill with our team at the restaurant.</p>}
                </section>
              </div>

              <aside className="checkout-panel lg:sticky lg:top-24">
                <div className="mb-5 flex items-start justify-between"><div><p className="checkout-step">03 / ORDER SUMMARY</p><h2 className="mt-1 font-serif text-xl">Your selection</h2><p className="mt-1 text-[11px] text-stone-500">{items.reduce((count, item) => count + item.quantity, 0)} thoughtfully prepared items</p></div><ShoppingBag size={19} className="text-orange-400" /></div>
                {items.length ? <div className="divide-y divide-white/[0.07]">{items.map((item) => <div className="flex gap-3 py-4 first:pt-0" key={item.id}>{item.image ? <img src={item.image} alt="" className="h-14 w-14 shrink-0 object-cover" /> : <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-white/[0.04]"><UtensilsCrossed size={17} className="text-stone-600" /></div>}<div className="min-w-0 flex-1"><p className="font-serif text-sm">{item.name}</p><p className="mt-1 text-xs text-stone-500">{money(item.price)} each</p><div className="mt-2 inline-flex items-center border border-white/10"><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2 py-1 text-stone-400 hover:text-white">{item.quantity === 1 ? <span className="text-[10px]" onClick={(event) => { event.stopPropagation(); removeItem(item.id); }}>×</span> : <Minus size={11} />}</button><span className="min-w-6 text-center text-[11px]">{item.quantity}</span><button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2 py-1 text-stone-400 hover:text-white"><Plus size={11} /></button></div></div><p className="pt-0.5 text-xs text-stone-200">{money(Number(item.price) * item.quantity)}</p></div>)}</div> : <div className="border border-dashed border-white/10 py-9 text-center"><ShoppingBag size={22} className="mx-auto text-stone-600" /><p className="mt-3 text-sm text-stone-400">Your bag is waiting.</p><Link to="/menu" className="mt-2 inline-block text-xs text-orange-300 hover:text-orange-200">Explore the menu →</Link></div>}
                <div className="mt-4 flex gap-2"><input value={voucher} onChange={(event) => setVoucher(event.target.value)} aria-label="Voucher code" placeholder="Voucher code" className="checkout-input min-w-0 flex-1" /><button type="button" onClick={applyVoucher} className="border border-white/15 px-4 text-xs text-stone-300 transition hover:border-orange-400 hover:text-orange-300">Apply</button></div>
                {appliedVoucher && <p className="mt-2 text-[11px] text-emerald-300">✓ Voucher HEARTH10 applied — 10% off</p>}
                <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs"><div className="flex justify-between text-stone-400"><span>Items subtotal</span><span>{money(total)}</span></div>{appliedVoucher && <div className="flex justify-between text-emerald-300"><span>HEARTH10 discount</span><span>−{money(discount)}</span></div>}<div className="flex items-end justify-between pt-2"><span className="font-serif text-sm uppercase tracking-widest">Total amount</span><span className="font-serif text-xl text-amber-400">{money(finalTotal)}</span></div></div>
                {error && <p role="alert" className="mt-4 border border-red-400/20 bg-red-400/[0.05] p-3 text-xs leading-5 text-red-300">{error}</p>}
                <button disabled={submitting || !items.length} type="submit" className="praneetha-btn-primary mt-5 flex w-full items-center justify-center gap-2 text-center text-xs uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-40">{submitting ? 'Placing your order…' : 'Confirm order'} <span aria-hidden="true">→</span></button>
                <p className="mt-3 text-center text-[10px] leading-4 text-stone-600">Our team will confirm your order by email or phone.</p>
              </aside>
            </form>
        </div>
      </main>
      <Footer />
      <style>{`.checkout-page{background:radial-gradient(ellipse at 22% 12%,rgba(153,67,16,.10),transparent 38%),#0b0a09}.checkout-panel{border:1px solid rgba(255,255,255,.085);background:rgba(20,18,15,.82);padding:1.25rem}.checkout-step{font-size:9px;letter-spacing:.24em;color:#e99a55}.checkout-input{display:block;width:100%;border:1px solid rgba(255,255,255,.09);border-radius:2px;background:#100f0d;padding:.72rem .8rem;color:#faf7f2;font-size:12px;outline:none;transition:border-color .2s}.checkout-input::placeholder{color:#68635e}.checkout-input:focus{border-color:#d97728;box-shadow:0 0 0 1px rgba(217,119,40,.2)}.checkout-input:-webkit-autofill{-webkit-text-fill-color:#faf7f2;box-shadow:0 0 0 1000px #100f0d inset}`}</style>
    </div>
  );
}
