import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

// Per-category subtitle shown after "COURSE XX ·"
const CATEGORY_SUBTITLE = {
  APPETIZER:   'Raw Bar Selection',
  MAIN_COURSE: 'Heritage Prime Cuts',
  DESSERT:     'Patisserie Atelier',
  BEVERAGE:    'Cellar Reserve',
  SPECIAL:     "Chef's Tasting Flight",
};

export default function CartItem({ item, index }) {
  const { updateQty, removeItem } = useCart();

  const courseNum  = String(index + 1).padStart(2, '0');
  const subtitle   = CATEGORY_SUBTITLE[item.category] || item.category;
  const lineTotal  = (parseFloat(item.price) * item.quantity).toFixed(2);

  return (
    <div className="py-6 border-t border-white/[0.08] first:border-t-0">
      <div className="flex gap-5 items-start">

        {/* ── Thumbnail ──────────────────────────────────────────────────── */}
        <div className="w-[130px] h-[110px] shrink-0 overflow-hidden bg-neutral-900">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🍽️
            </div>
          )}
        </div>

        {/* ── Details ────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Course label row */}
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1.5">
            <span className="text-fuchsiusOrange">COURSE {courseNum}</span>
            <span className="text-gray-600"> · {subtitle}</span>
          </p>

          {/* Dish name */}
          <h3 className="font-serif text-[22px] font-semibold text-fuchsiusWhite
                         leading-snug mb-4">
            {item.name}
          </h3>

          {/* Qty controls + line price + delete — inline row */}
          <div className="flex items-center gap-3">

            {/* − */}
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="w-8 h-8 border border-white/20 flex items-center justify-center
                         text-gray-400 hover:border-fuchsiusOrange hover:text-fuchsiusOrange
                         text-lg transition-colors duration-200 select-none"
            >
              −
            </button>

            {/* Qty */}
            <span className="w-5 text-center text-fuchsiusWhite font-semibold text-[15px]">
              {item.quantity}
            </span>

            {/* + */}
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="w-8 h-8 border border-white/20 flex items-center justify-center
                         text-gray-400 hover:border-fuchsiusOrange hover:text-fuchsiusOrange
                         text-lg transition-colors duration-200 select-none"
            >
              +
            </button>

            {/* Line total */}
            <span className="ml-2 text-fuchsiusWhite font-semibold text-[14px]">
              Rs{lineTotal}
            </span>

            {/* Delete */}
            <button
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name}`}
              className="ml-1 text-gray-600 hover:text-red-400 transition-colors
                         duration-200 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Unit price */}
          <p className="mt-3 text-gray-600 text-[11px]">
            Unit Price: Rs{parseFloat(item.price).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
