<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-serif text-3xl mb-4">Patron Cart</h1>
      <Link to="/login" className="praneetha-btn-primary">Return to Access Portal</Link>
=======
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import CartItem from '../../components/cart/CartItem.jsx';

export default function CartPage() {
  const { items, total, clearCart } = useCart();

  const TAX_RATE      = 0.08;
  const DELIVERY_FEE  = items.length > 0 ? 3.99 : 0;
  const tax           = total * TAX_RATE;
  const grandTotal    = total + tax + DELIVERY_FEE;

  return (
    <div className="min-h-screen flex flex-col bg-fuchsiusBlack">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold mb-8">
            Your <span className="text-fuchsiusOrange">Cart</span>
          </h1>

          {items.length === 0 ? (
            /* ─── Empty State ─────────────────────────────────────────────── */
            <div className="text-center py-24">
              <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-400 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some delicious items from our menu.</p>
              <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                Browse Menu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ─── Items list ─────────────────────────────────────────── */}
              <div className="lg:col-span-2">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-300">{items.length} item{items.length !== 1 ? 's' : ''}</h2>
                    <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                      Clear all
                    </button>
                  </div>
                  {items.map(item => <CartItem key={item.id} item={item} />)}
                </div>
              </div>

              {/* ─── Order Summary ───────────────────────────────────────── */}
              <div className="lg:col-span-1">
                <div className="card p-6 sticky top-24">
                  <h2 className="font-serif font-semibold text-lg mb-5">Order Summary</h2>

                  <div className="space-y-3 text-sm text-gray-400 mb-5">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-fuchsiusWhite">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span className="text-fuchsiusWhite">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className="text-fuchsiusWhite">${DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between font-semibold text-base text-fuchsiusWhite">
                      <span>Total</span>
                      <span className="text-fuchsiusOrange">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link to="/checkout" className="btn-primary w-full block text-center">
                    Proceed to Checkout
                  </Link>
                  <Link to="/menu" className="btn-ghost w-full block text-center mt-2 text-sm">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
    </div>
  );
}
