import { useState, useEffect } from 'react';
import { Search, Loader2, Wine } from 'lucide-react';
import { menuApi, categoryApi } from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import MenuItemCard from '../../components/menu/MenuItemCard.jsx';
import CategoryFilter from '../../components/menu/CategoryFilter.jsx';

// ─── Main MenuPage ────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  useEffect(() => { categoryApi.getAll().then(res => setCategories(res.data)).catch(err => setError(err.message)); }, []);
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
        setItems(list);
      } catch (err) {
        setItems([]);
        setError(err.message);
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
              <CategoryFilter categories={categories} active={category} onChange={setCategory} />
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
          {!loading && !error && }
        </div>

        {/* Bottom spacing */}
        <div className="h-16" />
      </main>

      <Footer />
    </div>
  );
}