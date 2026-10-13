import { useState, useEffect } from 'react';
import { Search, Loader2, Wine } from 'lucide-react';
import { menuApi } from '../../services/api.js';
import { MOCK_MENU_ITEMS } from '../../data/mockMenu.js';
import { useCart } from '../../context/CartContext.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import MenuItemCard from '../../components/menu/MenuItemCard.jsx';
import CategoryFilter from '../../components/menu/CategoryFilter.jsx';

// ─── Sommelier Pairing Feature Banner ────────────────────────────────────────
function SommelierPairing() {
  const { addItem } = useCart();

  const pairingItem = {
    id:          'pairing-flight',
    name:        'Grand Cru Companion Flight',
    description: 'Six cellar vintages curated specifically to elevate the charcoal-fired notes of tonight\'s tasting sequence. Enquire for rare bottle acquisition.',
    price:       220,
    category:    'BEVERAGE',
    image:       null,
    isAvailable: true,
  };

  return (
    <div className="mt-12 border border-white/10 bg-[#0e0e0e] px-8 py-7
                    flex flex-col md:flex-row items-start md:items-center
                    justify-between gap-6">
      {/* Left */}
      <div className="flex-1">
        <p className="text-[9px] font-bold tracking-[0.25em] uppercase
                      text-fuchsiusOrange mb-2">
          THE SOMMELIER'S ARCHIVE
        </p>
        <h3 className="font-serif text-[22px] font-semibold text-fuchsiusWhite mb-2">
          Grand Cru Companion Flight
        </h3>
        <p className="text-gray-500 text-[12px] leading-relaxed max-w-lg">
          Six cellar vintages curated specifically to elevate the charcoal-fired notes of
          tonight's tasting sequence. Enquire for rare bottle acquisition.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6 shrink-0">
        <div>
          <p className="text-[9px] font-bold tracking-[0.18em] uppercase
                        text-gray-600 mb-1">
            PER SEAT PAIRING
          </p>
          <p className="text-fuchsiusOrange font-bold text-[17px]">
            Rs220.00
          </p>
        </div>
        <button
          onClick={() => addItem(pairingItem)}
          className="bg-fuchsiusOrange hover:bg-orange-500 text-white text-[10px]
                     font-bold tracking-[0.14em] uppercase px-5 py-3
                     flex items-center gap-2 transition-colors duration-200"
        >
          <Wine className="w-3.5 h-3.5" />
          ADD SOMMELIER PAIRING
        </button>
      </div>
    </div>
  );
}

// ─── Main MenuPage ────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [category, setCategory] = useState('ALL');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = category !== 'ALL' ? `?category=${category}` : '';
        const res = await menuApi.getAll(params);
        // Backend may return { data: [...] } or plain array
        const list = Array.isArray(res) ? res : (res.data ?? res);
        setItems(list.length > 0 ? list : MOCK_MENU_ITEMS);
      } catch {
        // Backend offline — show demo items so the grid is never blank
        const filtered = category === 'ALL'
          ? MOCK_MENU_ITEMS
          : MOCK_MENU_ITEMS.filter(i => i.category === category);
        setItems(filtered);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [category]);

  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />

      <main className="flex-1 pt-20">

        {/* ── Hero heading ───────────────────────────────────────────────── */}
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10 pt-10 pb-6">
          <h1 className="font-serif text-[42px] md:text-[52px] font-semibold
                         text-fuchsiusWhite italic leading-tight">
            Curated Offerings
          </h1>
        </div>

        {/* ── Search + Filter bar ────────────────────────────────────────── */}
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search input */}
            <div className="relative w-full sm:w-[260px] shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                                 text-gray-600" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search dishes, caviar, rare vintages..."
                className="w-full bg-[#111111] border border-white/10 text-gray-300
                           placeholder-gray-700 text-[11px] pl-9 pr-4 py-2.5
                           focus:outline-none focus:border-fuchsiusOrange/50
                           transition-colors duration-200"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-white/10 mx-1" />

            {/* Category Filter */}
            <div className="flex-1 overflow-hidden">
              <CategoryFilter active={category} onChange={setCategory} />
            </div>
          </div>
        </div>

        {/* ── Menu Grid ──────────────────────────────────────────────────── */}
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="w-8 h-8 text-fuchsiusOrange animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-sm tracking-widest uppercase">
                No offerings found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px
                            bg-white/[0.05]">
              {filtered.map((item, index) => (
                <div key={item.id} className="bg-[#0a0a0a]">
                  <MenuItemCard item={item} index={index} />
                </div>
              ))}
            </div>
          )}

          {/* ── Sommelier Pairing Banner ──────────────────────────────────── */}
          {!loading && !error && <SommelierPairing />}
        </div>

        {/* Bottom spacing */}
        <div className="h-16" />
      </main>

      <Footer />
    </div>
  );
}