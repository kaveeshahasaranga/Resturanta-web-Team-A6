import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { orderApi } from '../../services/api.js';
import { CheckCircle, Loader2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export default function CheckoutPage() {
  const { items, total, clearCart, quote, checking, quoteError, canCheckout, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName:    user?.name    || '',
    customerEmail:   user?.email   || '',
    customerPhone:   '',
    deliveryAddress: '',
    notes:           '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  const TAX_RATE     = 0.10;
  const DELIVERY_FEE = 0;
  const tax          = quote ? Number(quote.serviceCharge) : total * TAX_RATE;
  const grandTotal   = quote ? Number(quote.total) : total + tax;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (items.length === 0) { navigate('/menu'); return; }
    setLoading(true);
    setError('');
    try {
      const latest = await refreshCart();
      if (!latest?.canCheckout) throw new Error('Some dishes are unavailable. Update your cart before ordering.');
      if (quote && (latest.total !== quote.total || latest.items.some((line, index) => line.unitPrice !== quote.items[index]?.unitPrice))) throw new Error('Prices changed. Please review your updated total and submit again.');
      const res = await orderApi.create({
        ...form,
        items:  items.map(i => ({ menuItemId: i.id, quantity: i.quantity })),
      });
      clearCart();
      navigate(`/order-confirmation/${res.data.id}`, { state: { order: res.data } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-fuchsiusBlack">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4 animate-slide-up">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-5" />
            <h1 className="text-3xl font-serif font-bold mb-3">Order Placed!</h1>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Thank you for your order. We'll start preparing it right away!
            </p>
            <button onClick={() => navigate('/menu')} className="btn-primary">Back to Menu</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-fuchsiusBlack">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              <div className="card space-y-4">
                <h2 className="font-semibold text-gray-300 mb-1">Delivery Details</h2>
                {[
                  { name: 'customerName',    label: 'Full Name *',       type: 'text',  placeholder: 'John Doe',          required: true },
                  { name: 'customerEmail',   label: 'Email *',           type: 'email', placeholder: 'john@example.com',  required: true },
                  { name: 'customerPhone',   label: 'Phone',             type: 'tel',   placeholder: '+1 234 567 8900',   required: false },
                  { name: 'deliveryAddress', label: 'Delivery Address',  type: 'text',  placeholder: '123 Main St, City', required: false },
                ].map(({ name, label, type, placeholder, required }) => (
                  <div key={name}>
                    <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                    <input name={name} type={type} required={required} value={form[name]}
                      onChange={handleChange} placeholder={placeholder} className="input-field" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Special Instructions</label>
                  <textarea name="notes" rows={3} value={form.notes} onChange={handleChange}
                    placeholder="Allergies, special requests..." className="input-field resize-none" />
                </div>
              </div>

              {quoteError && <p role="alert" className="text-red-400 text-sm">{quoteError}</p>}
              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button type="submit" disabled={loading || checking || !canCheckout} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Placing Order...' : `Place Order • $${grandTotal.toFixed(2)}`}
              </button>
            </form>

            {/* Summary */}
            <div className="card p-5 h-fit sticky top-24">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                {items.map(i => (
                  <div key={i.id} className="flex justify-between text-gray-400">
                    <span className="truncate pr-2">{i.name} ×{i.quantity}</span>
                    <span className="text-fuchsiusWhite shrink-0">Rs{(parseFloat(i.price) * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 space-y-2 text-sm text-gray-400">
                <div className="flex justify-between"><span>Subtotal</span><span>Rs{total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Service (10%)</span><span>Rs{tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>Rs{DELIVERY_FEE.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-fuchsiusWhite text-base pt-1">
                  <span>Total</span><span className="text-fuchsiusOrange">Rs{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
