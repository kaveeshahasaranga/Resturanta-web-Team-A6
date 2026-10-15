import React, { useState } from 'react';
import {
  Bookmark,
  ShoppingBag,
  Flame,
  Clock,
  Utensils,
  Leaf,
  Star,
  Wine,
  ShieldCheck,
  CalendarClock,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export const initialSavedDishes = [
  {
    id: 'saved-1',
    name: 'Chicken Kottu',
    price: 'LKR 1,450',
    numericPrice: 1450,
    tag: 'DEGUSTATION',
    description:
      'Flaky godamba roti tossed with shredded artisan chicken, garden leeks, country eggs, and roasted...',
    heat: 'MEDIUM HEAT',
    prepTime: '20 MINS',
    image: '/images/dishes/chicken-kottu.jpg',
  },
  {
    id: 'saved-2',
    name: 'Seafood Fried Rice',
    price: 'LKR 1,850',
    numericPrice: 1850,
    tag: 'LAGOON CATCH',
    description:
      'Jasmine rice wok-fried with wild Negombo lagoon prawns, cuttlefish morsels, young scallions, and spiced...',
    specialty: 'WOK MASTER',
    prepTime: '25 MINS',
    image: '/images/dishes/seafood-fried-rice.jpg',
  },
  {
    id: 'saved-3',
    name: 'Lamprais',
    price: 'LKR 1,650',
    numericPrice: 1650,
    tag: 'HERITAGE BATCH',
    description:
      'Traditional Dutch-Burgher recipe steamed in banana leaf with slow-cooked mixed meat curry, seeni...',
    wrapType: 'BANANA LEAF',
    badge: 'SIGNATURE',
    image: '/images/dishes/lamprais.jpg',
  },
];

export default function SavedDishesTab() {
  const [dishes, setDishes] = useState(initialSavedDishes);
  const [toastMessage, setToastMessage] = useState(null);
  const { addItem } = useCart();

  const handleToggleBookmark = (id) => {
    setDishes((prev) => prev.filter((d) => d.id !== id));
    showToast('Dish removed from your saved degustation repository.');
  };

  const handleClearAll = () => {
    setDishes([]);
    showToast('All saved dishes cleared.');
  };

  const handleRestoreDefault = () => {
    setDishes(initialSavedDishes);
    showToast('Saved dishes repository restored.');
  };

  const handleAddToCart = (dish) => {
    if (addItem) {
      addItem({
        id: dish.id,
        name: dish.name,
        price: dish.numericPrice,
        image: dish.image,
      });
    }
    showToast(`${dish.name} added to your dining order.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-[#e66200]" />
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#e66200] font-medium">
              PATRON REPOSITORY
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-wide">
            Saved Dishes
          </h1>
          <p className="text-neutral-400 text-xs sm:text-[13px] mt-1.5 font-sans leading-relaxed">
            Curated collection of your favourite Ceylon specialties and degustation courses.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18181c] border border-white/10 text-xs text-neutral-300 font-sans">
            <Bookmark className="w-3.5 h-3.5 text-[#e66200] fill-[#e66200]" />
            <span className="font-semibold text-[11px] tracking-wider uppercase">
              {dishes.length} ITEMS SAVED
            </span>
          </div>

          {dishes.length > 0 ? (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-1.5 rounded-lg bg-[#18181c] border border-white/10 text-xs font-semibold text-neutral-400 hover:text-white hover:border-white/20 tracking-wider uppercase transition-colors cursor-pointer"
            >
              CLEAR ALL
            </button>
          ) : (
            <button
              onClick={handleRestoreDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#18181c] border border-[#e66200]/40 text-xs font-semibold text-[#e66200] tracking-wider uppercase hover:bg-[#e66200]/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESTORE</span>
            </button>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#e66200] text-xs flex items-center gap-2.5 animate-slide-down">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── Dishes Grid ─── */}
      {dishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-[#141416] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-2xl group"
            >
              <div>
                {/* Image & Badge Overlay */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleToggleBookmark(dish.id)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[#e66200] hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Remove bookmark"
                  >
                    <Bookmark className="w-4 h-4 fill-[#e66200]" />
                  </button>

                  {/* Category Pill Tag */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[#e66200] text-[10px] font-semibold tracking-wider uppercase">
                    {dish.tag}
                  </div>
                </div>

                {/* Dish Info */}
                <div className="p-5 pb-2">
                  <p className="text-[10px] font-sans tracking-widest uppercase text-neutral-500 mb-1">
                    Saved Dishes — PRANEETHA
                  </p>

                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-serif text-xl text-white font-normal">
                      {dish.name}
                    </h3>
                    <span className="font-serif text-base text-white font-medium shrink-0">
                      {dish.price}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>

                  {/* Meta Badges */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 text-[11px] font-sans text-neutral-400">
                    {dish.heat && (
                      <div className="flex items-center gap-1.5 text-orange-400">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="uppercase text-[10px] font-medium tracking-wide">
                          {dish.heat}
                        </span>
                      </div>
                    )}

                    {dish.specialty && (
                      <div className="flex items-center gap-1.5 text-orange-400">
                        <Utensils className="w-3.5 h-3.5" />
                        <span className="uppercase text-[10px] font-medium tracking-wide">
                          {dish.specialty}
                        </span>
                      </div>
                    )}

                    {dish.wrapType && (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Leaf className="w-3.5 h-3.5" />
                        <span className="uppercase text-[10px] font-medium tracking-wide">
                          {dish.wrapType}
                        </span>
                      </div>
                    )}

                    {dish.badge && (
                      <div className="flex items-center gap-1.5 text-[#d4af37]">
                        <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                        <span className="uppercase text-[10px] font-medium tracking-wide">
                          {dish.badge}
                        </span>
                      </div>
                    )}

                    {dish.prepTime && (
                      <div className="flex items-center gap-1 text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] tracking-wide font-medium">
                          {dish.prepTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add To Cart Button */}
              <div className="p-5 pt-3">
                <button
                  onClick={() => handleAddToCart(dish)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#e66200] hover:bg-orange-600 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#141416] border border-white/[0.08] rounded-2xl">
          <Bookmark className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-serif text-xl text-white">No Saved Dishes</h3>
          <p className="text-neutral-400 text-xs mt-1 max-w-sm mx-auto">
            Explore our curated menu and bookmark dishes to build your personalized degustation collection.
          </p>
          <button
            onClick={handleRestoreDefault}
            className="mt-4 px-4 py-2 rounded-lg bg-[#e66200] text-white text-xs font-semibold tracking-wider uppercase"
          >
            RESTORE DEFAULT SAVED DISHES
          </button>
        </div>
      )}

      {/* ─── 3 Feature Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* Sommelier Pairing */}
        <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-5 hover:border-[#e66200]/30 transition-colors duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-[#e66200]/10 text-[#e66200] shrink-0">
              <Wine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-white font-sans">
                PRIVATE SOMMELIER PAIRING
              </h3>
              <p className="text-neutral-400 text-xs mt-1.5 font-sans leading-relaxed">
                Every saved entree includes tailored cellar recommendations upon ordering.
              </p>
            </div>
          </div>
        </div>

        {/* Spice Provenance */}
        <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-5 hover:border-[#e66200]/30 transition-colors duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-[#e66200]/10 text-[#e66200] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-white font-sans">
                AUTHENTIC SPICE PROVENANCE
              </h3>
              <p className="text-neutral-400 text-xs mt-1.5 font-sans leading-relaxed">
                Hand-milled cinnamon, Jaffna roasted chili powders, and cold-pressed coconut fats.
              </p>
            </div>
          </div>
        </div>

        {/* Scheduled Plating */}
        <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-5 hover:border-[#e66200]/30 transition-colors duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-[#e66200]/10 text-[#e66200] shrink-0">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-white font-sans">
                SCHEDULED PLATING
              </h3>
              <p className="text-neutral-400 text-xs mt-1.5 font-sans leading-relaxed">
                Pre-order your saved banquet selections up to 48 hours in advance of private dinners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
