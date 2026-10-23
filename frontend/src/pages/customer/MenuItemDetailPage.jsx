import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { menuApi } from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

const CATEGORY_LABELS = {
  APPETIZER:   'RAW BAR',
  MAIN_COURSE: 'PRIME CUTS',
  DESSERT:     'PATISSERIE',
  BEVERAGE:    'CELLAR',
  SPECIAL:     "CHEF'S TASTING",
};

export default function MenuItemDetailPage() {
  const { id }    = useParams();
  const { addItem, items: cartItems } = useCart();

  const [item,     setItem]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added,    setAdded]    = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    menuApi.getById(id)
      .then(res => {
        // Backend may return { data: {...} } or the object directly
        const found = res?.data ?? res;
        setItem(found);
      })
      .catch(err => { setItem(null); setError(err.message); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!item?.isAvailable) return;
    // Add `quantity` copies by calling addItem multiple times
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const price     = item ? parseFloat(item.price) : 0;
  const lineTotal = (price * quantity).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />

      <main className="flex-1 pt-[64px]">

        {/* ── Back link bar ────────────────────────────────────────────────── */}
        <div className="border-b border-white/[0.06] bg-[#0a0a0a]">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-gray-500
                         hover:text-fuchsiusWhite text-[12px] tracking-wide
                         transition-colors duration-200 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5
                                    transition-transform duration-200" />
              Back to Menu
            </Link>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <Loader2 className="w-8 h-8 text-fuchsiusOrange animate-spin" />
          </div>

        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 text-sm">{error}</p>
            <Link to="/menu" className="mt-4 inline-block text-fuchsiusOrange
                                        text-sm hover:underline">
              ← Back to Menu
            </Link>
          </div>

        ) : item && (
          <>
            {/* ── Two-column layout ─────────────────────────────────────── */}
            <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10 lg:py-14">
              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16
                              items-start">

                {/* Left — Image ─────────────────────────────────────────── */}
                <div className="w-full overflow-hidden bg-neutral-900">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover aspect-[5/4]"
                    />
                  ) : (
                    <div className="aspect-[5/4] flex items-center justify-center
                                    text-7xl bg-gradient-to-br from-neutral-900 to-black">
                      🍽️
                    </div>
                  )}
                </div>

                {/* Right — Details ──────────────────────────────────────── */}
                <div className="flex flex-col">

                  {/* Category badge */}
                  <div className="mb-5">
                    <span className="inline-flex items-center border border-fuchsiusOrange/55
                                     text-fuchsiusOrange text-[9px] font-bold
                                     tracking-[0.22em] uppercase px-3.5 py-1.5">
                      À LA CARTE&nbsp;•&nbsp;
                      {item.categoryName || CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  </div>

                  {/* Dish name — large italic serif */}
                  <h1 className="font-serif italic text-[36px] md:text-[44px] lg:text-[48px]
                                 font-semibold text-fuchsiusWhite leading-[1.1] mb-7">
                    {item.name}
                  </h1>

                  {/* Price row */}
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-fuchsiusOrange text-[28px] font-bold
                                     tracking-wide leading-none">
                      Rs{price.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-[12px] tracking-wide">
                      À la carte service
                    </span>
                  </div>

                  {/* Thin divider */}
                  <div className="border-t border-white/10 mb-6" />

                  {/* Description */}
                  <p className="text-gray-400 text-[13px] leading-[1.85] max-w-[440px]">
                    {item.description}
                  </p>

                  {/* Availability note */}
                  {!item.isAvailable && (
                    <p className="mt-5 text-red-400 text-xs tracking-widest uppercase
                                  border border-red-400/30 inline-flex px-3 py-1.5 self-start">
                      Currently Unavailable
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Quantity + Add to Cart bar ───────────────────────────────── */}
            <div className="border-t border-white/[0.06] bg-[#0a0a0a] sticky bottom-0 z-30">
              <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-4">
                <div className="flex items-center justify-end gap-0">

                  {/* ─ Minus ─ */}
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={!item.isAvailable}
                    aria-label="Decrease quantity"
                    className="w-12 h-12 bg-fuchsiusOrange hover:bg-orange-500 text-white
                               text-2xl font-light flex items-center justify-center
                               transition-colors duration-200 disabled:opacity-40
                               disabled:cursor-not-allowed select-none"
                  >
                    −
                  </button>

                  {/* ─ Count ─ */}
                  <div className="w-14 h-12 flex items-center justify-center
                                  bg-fuchsiusOrange/15 border-y border-fuchsiusOrange/30">
                    <span className="text-fuchsiusWhite font-semibold text-[16px]">
                      {quantity}
                    </span>
                  </div>

                  {/* ─ Plus ─ */}
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    disabled={!item.isAvailable}
                    aria-label="Increase quantity"
                    className="w-12 h-12 bg-fuchsiusOrange hover:bg-orange-500 text-white
                               text-2xl font-light flex items-center justify-center
                               transition-colors duration-200 disabled:opacity-40
                               disabled:cursor-not-allowed select-none"
                  >
                    +
                  </button>

                  {/* ─ Add to Cart CTA ─ */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!item.isAvailable}
                    className={`ml-3 flex items-center gap-3 h-12 px-7 text-[10px] font-bold
                                tracking-[0.15em] uppercase transition-all duration-200
                                disabled:opacity-40 disabled:cursor-not-allowed
                                ${added
                                  ? 'bg-green-600 text-white'
                                  : 'bg-fuchsiusOrange hover:bg-orange-500 text-white'
                                }`}
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    {added
                      ? 'ADDED TO CART ✓'
                      : `ADD TO CART — Rs${lineTotal}`
                    }
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
