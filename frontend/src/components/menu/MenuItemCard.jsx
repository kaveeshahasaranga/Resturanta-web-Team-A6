import { useCart } from '../../context/CartContext.jsx';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Maps backend category → luxury label shown on card
const CATEGORY_TAG = {
  APPETIZER:   'RAW BAR',
  MAIN_COURSE: 'PRIME CUTS',
  DESSERT:     'PATISSERIE',
  BEVERAGE:    'CELLAR',
  SPECIAL:     'CHEF\'S TASTING',
};

// Small provenance/source label shown above price (rotates by index)
const PROVENANCE_LABELS = [
  'PROVENANCE: 03', 'SALE EXTRACTION', 'ATLANTIS 1983',
  'CHAPON RESERVE', 'VENUE PROVENANCE', 'ANCIENT RESERVE',
];

export default function MenuItemCard({ item, index = 0 }) {
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const inCart    = items.some(i => i.id === item.id);
  const actNum    = String(index + 1).padStart(2, '0');
  const provLabel = PROVENANCE_LABELS[index % PROVENANCE_LABELS.length];

  const handleAdd = (e) => {
    e.stopPropagation(); // prevent navigating when clicking the button
    if (!item.isAvailable) return;
    addItem(item);
    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
  };

  const goToDetail = () => navigate(`/menu/${item.id}`);

  return (
    <article
      onClick={goToDetail}
      className="group flex flex-col bg-[#111111] border border-white/[0.06]
                 hover:border-fuchsiusOrange/25 transition-colors duration-400
                 overflow-hidden cursor-pointer"
    >

      {/* ── Image area ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden aspect-[4/3] bg-neutral-900">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105
                       transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl
                          bg-gradient-to-br from-neutral-900 to-black">
            🍽️
          </div>
        )}

        {/* Unavailable overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-xs font-bold tracking-widest uppercase text-red-400 border
                             border-red-400/50 px-3 py-1">
              UNAVAILABLE
            </span>
          </div>
        )}

        {/* Category tag — top right */}
        <div className="absolute top-3 right-3">
          <span className="text-[9px] font-bold tracking-[0.18em] uppercase
                           text-gray-300 bg-black/60 backdrop-blur-sm px-2 py-1">
            {CATEGORY_TAG[item.category] || item.category}
          </span>
        </div>

        {/* Act number — bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[9px] font-bold tracking-[0.15em] uppercase
                           text-gray-500 bg-black/60 backdrop-blur-sm px-2 py-1">
            ACT {actNum}
          </span>
        </div>
      </div>

      {/* ── Content area ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Dish name */}
        <h3 className="font-serif font-semibold text-fuchsiusWhite text-[15px]
                       leading-snug mb-2 line-clamp-2">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3 flex-1 mb-4">
          {item.description}
        </p>

        {/* Price + Button row */}
        <div className="flex items-end justify-between gap-3">
          <div>
            {/* Small provenance label */}
            <p className="text-gray-600 text-[9px] font-bold tracking-[0.16em] uppercase mb-1">
              {provLabel}
            </p>
            {/* Price */}
            <p className="text-fuchsiusOrange font-bold text-[15px] tracking-wide">
              Rs{parseFloat(item.price).toFixed(2)}
            </p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            disabled={!item.isAvailable}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold
                        tracking-[0.12em] uppercase transition-all duration-200
                        ${adding
                          ? 'bg-green-600 text-white'
                          : 'bg-fuchsiusOrange hover:bg-orange-500 text-white'
                        }
                        disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {adding ? '✓ ADDED' : (
              <>ADD TO CART <Plus className="w-3 h-3" /></>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
