import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import CartItem from '../../components/cart/CartItem.jsx';

// ─── Billing Summary sidebar ──────────────────────────────────────────────────
function BillingSummary({ subtotal, tax, grandTotal, onCheckout }) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const handleApply = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  return (
    <aside className="bg-[#0e0e0e] border border-white/[0.08] p-7 h-fit sticky top-24">

      {/* Label */}
      <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.28em]
                    uppercase mb-2">
        BILLING LEDGER
      </p>

      {/* Heading */}
      <h2 className="font-serif text-[26px] font-semibold text-fuchsiusWhite mb-5">
        Summary
      </h2>

      {/* Divider */}
      <div className="border-t border-white/[0.08] mb-5" />

      {/* Line items */}
      <div className="space-y-3 mb-5">
        <div className="flex justify-between items-baseline">
          <span className="text-gray-400 text-[12px]">Courses Subtotal</span>
          <span className="text-fuchsiusWhite text-[13px] font-medium">
            Rs{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-gray-400 text-[12px]">Sommelier &amp; Service (10%)</span>
          <span className="text-fuchsiusWhite text-[13px] font-medium">
            Rs{tax.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-400 text-[12px] leading-snug max-w-[160px]">
            Haute Transport<br />
            <span className="text-gray-600">(Obsidian Vault)</span>
          </span>
          <span className="text-fuchsiusOrange text-[11px] font-bold tracking-wide uppercase">
            COMPLIMENTARY
          </span>
        </div>
      </div>

      {/* Promo code */}
      <div className="mb-6">
        <p className="text-gray-600 text-[9px] font-bold tracking-[0.22em] uppercase mb-2">
          CELLAR PASS / ATELIER CODE
        </p>
        <div className="flex gap-0">
          <input
            type="text"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value.toUpperCase())}
            placeholder="PROMO CODE"
            className="flex-1 bg-transparent border border-white/15 border-r-0
                       text-gray-300 placeholder-gray-700 text-[11px] px-3 py-2.5
                       focus:outline-none focus:border-fuchsiusOrange/40
                       transition-colors duration-200"
          />
          <button
            onClick={handleApply}
            className={`px-4 py-2.5 text-[10px] font-bold tracking-[0.12em] uppercase
                        border transition-colors duration-200
                        ${promoApplied
                          ? 'bg-green-600/20 text-green-400 border-green-600/30'
                          : 'border-white/15 text-gray-400 hover:border-white/40 hover:text-white'
                        }`}
          >
            {promoApplied ? '✓' : 'APPLY'}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.08] mb-5" />

      {/* Total */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-fuchsiusWhite text-[12px] font-bold tracking-wide uppercase">
            TOTAL INVESTMENT
          </p>
          <p className="text-gray-600 text-[10px] mt-0.5">Taxes inclusive</p>
        </div>
        <span className="text-fuchsiusOrange font-bold text-[26px] leading-none tracking-tight">
          Rs{grandTotal.toFixed(2)}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={onCheckout}
        className="w-full bg-fuchsiusOrange hover:bg-orange-500 text-white
                   text-[11px] font-bold tracking-[0.18em] uppercase
                   py-4 flex items-center justify-center gap-3
                   transition-colors duration-200"
      >
        PROCEED TO CHECKOUT
        <ArrowRight className="w-4 h-4" />
      </button>
    </aside>
  );
}

// ─── Empty Cart state ─────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="text-center py-28">
      <ShoppingBag className="w-14 h-14 text-gray-800 mx-auto mb-6" />
      <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-fuchsiusOrange mb-3">
        HAUTE CUISINE ATELIER
      </p>
      <h2 className="font-serif text-[32px] font-semibold text-gray-500 mb-6 italic">
        Your cart is empty
      </h2>
      <p className="text-gray-700 text-sm mb-8">
        Explore our curated offerings and add your selections.
      </p>
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 bg-fuchsiusOrange hover:bg-orange-500
                   text-white text-[11px] font-bold tracking-[0.15em] uppercase
                   px-8 py-3.5 transition-colors duration-200"
      >
        EXPLORE MENU <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// ─── Main CartPage ────────────────────────────────────────────────────────────
export default function CartPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const SERVICE_CHARGE = 0.10;            // 10% sommelier & service
  const tax            = total * SERVICE_CHARGE;
  const grandTotal     = total + tax;     // transport is complimentary

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />

      <main className="flex-1 pt-[64px]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">

          {/* ── Page heading ─────────────────────────────────────────────── */}
          <div className="mb-8">
            <p className="flex items-center gap-2 text-[9px] font-bold
                          tracking-[0.28em] uppercase text-fuchsiusOrange mb-2">
              <span className="w-2 h-2 bg-fuchsiusOrange inline-block" />
              HAUTE CUISINE ATELIER
            </p>
            <h1 className="font-serif italic text-[46px] md:text-[54px] font-semibold
                           text-fuchsiusWhite leading-tight">
              Your Cart
            </h1>

            {/* Thin rule */}
            <div className="border-t border-white/[0.08] mt-5" />
          </div>

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

              {/* ── Left — Items list ───────────────────────────────────── */}
              <div>
                {/* Clear all */}
                {items.length > 1 && (
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={clearCart}
                      className="text-[10px] text-gray-700 hover:text-red-400
                                 tracking-widest uppercase transition-colors duration-200"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {/* Items */}
                <div>
                  {items.map((item, index) => (
                    <CartItem key={item.id} item={item} index={index} />
                  ))}
                </div>
              </div>

              {/* ── Right — Billing Summary ─────────────────────────────── */}
              <BillingSummary
                subtotal={total}
                tax={tax}
                grandTotal={grandTotal}
                onCheckout={() => navigate('/checkout')}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
