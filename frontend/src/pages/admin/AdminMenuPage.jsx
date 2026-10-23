import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { menuApi } from '../../services/api.js';

// ─── Category display labels ──────────────────────────────────────────────────
const CATEGORY_LABEL = {
  APPETIZER:   'RAW BAR & CAVIAR',
  MAIN_COURSE: 'PRIME CUTS',
  DESSERT:     'PATISSERIE',
  BEVERAGE:    'CELLAR',
  SPECIAL:     'ARTISANAL MAINS',
};

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ isAvailable }) {
  return isAvailable ? (
    <span className="inline-flex items-center gap-1.5 text-green-400 text-[11px]
                     font-semibold tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
      AVAILABLE
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-gray-500 text-[11px]
                     font-semibold tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />
      UNAVAILABLE
    </span>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;

  const pages = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, '...', total);
  }

  return (
    <div className="flex items-center justify-end gap-1 mt-5">
      {/* Prev */}
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center border border-white/10
                   text-gray-500 hover:border-white/30 hover:text-white
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center
                          text-gray-600 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 flex items-center justify-center text-[12px] font-semibold
                        border transition-colors duration-200
                        ${current === p
                          ? 'bg-fuchsiusOrange border-fuchsiusOrange text-white'
                          : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                        }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center border border-white/10
                   text-gray-500 hover:border-white/30 hover:text-white
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Main AdminMenuPage ───────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

export default function AdminMenuPage() {
  const navigate = useNavigate();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [page,    setPage]    = useState(1);

  const fetchItems = () => {
    setLoading(true);
    setError('');
    menuApi.getAll()
      .then(res => {
        const list = Array.isArray(res) ? res : (res.data ?? res);
        setItems(list);
      })
      .catch(err => { setError(err.message); setItems([]); })
      .finally(() => setLoading(false));
  };
  useEffect(fetchItems, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently remove "${name}" from the catalog?`)) return;
    try {
      await menuApi.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) { alert(err.message); }
  };

  // Pagination slicing
  const totalPages   = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  useEffect(() => { setPage(p => Math.min(p, totalPages)); }, [totalPages]);
  const paginated    = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="animate-fade-in">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <p className="text-gray-700 text-[12px] mb-3">/</p>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <h1 className="font-serif text-[30px] md:text-[36px] font-semibold
                       text-fuchsiusWhite leading-tight">
          Menu Catalog &amp; Allocations
        </h1>
        <Link
          to="/admin/menu/new"
          className="shrink-0 flex items-center gap-2 bg-fuchsiusOrange
                     hover:bg-orange-500 text-white text-[10px] font-bold
                     tracking-[0.14em] uppercase px-5 py-2.5
                     transition-colors duration-200"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD NEW ITEM
        </Link>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-7 h-7 text-fuchsiusOrange animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-400 text-sm py-8">{error}</p>
      ) : (
        <div className="border border-white/[0.07] overflow-hidden">

          {/* Table head */}
          <div className="grid grid-cols-[90px_1fr_160px_100px_120px_80px]
                          bg-[#0e0e0e] border-b border-white/[0.07]
                          px-4 py-3 gap-4">
            {['ITEM THUMBNAIL', 'ITEM NAME & DESCRIPTION', 'CATEGORY', 'PRICE', 'STATUS', 'ACTIONS'].map(h => (
              <span key={h} className="text-[9px] font-bold tracking-[0.2em]
                                       uppercase text-gray-600 leading-tight">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div className="text-center py-16 text-gray-700 text-sm">
              No items in catalog yet.
            </div>
          ) : (
            paginated.map((item, idx) => (
              <div
                key={item.id}
                className={`grid grid-cols-[90px_1fr_160px_100px_120px_80px]
                            items-center px-4 py-4 gap-4
                            border-b border-white/[0.05] last:border-b-0
                            hover:bg-white/[0.02] transition-colors duration-150
                            ${idx % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}
              >
                {/* Thumbnail */}
                <div className="w-[66px] h-[52px] bg-neutral-900 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center
                                    text-xl">🍽️</div>
                  )}
                </div>

                {/* Name + description */}
                <div className="min-w-0">
                  <p className="text-fuchsiusWhite text-[13px] font-semibold
                                truncate mb-1">
                    {item.name}
                  </p>
                  <p className="text-gray-600 text-[11px] leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Category badge */}
                <div>
                  <span className="inline-flex border border-white/20 text-gray-300
                                   text-[9px] font-bold tracking-[0.14em] uppercase
                                   px-3 py-1.5">
                    {item.categoryName || CATEGORY_LABEL[item.category] || item.category}
                  </span>
                </div>

                {/* Price */}
                <p className="text-fuchsiusWhite text-[13px] font-medium">
                  Rs {parseFloat(item.price).toFixed(2)}
                </p>

                {/* Status */}
                <button type="button" aria-label={`Toggle availability of ${item.name}`} onClick={async () => {
                      try { const res = await menuApi.availability(item.id, !item.isAvailable); setItems(prev => prev.map(i => i.id === item.id ? res.data : i)); }
                      catch (err) { setError(err.message); }
                    }}><StatusBadge isAvailable={item.isAvailable} /></button>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/admin/menu/edit/${item.id}`)}
                    title="Edit"
                    className="text-gray-500 hover:text-fuchsiusOrange
                               transition-colors duration-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    title="Delete"
                    className="text-gray-500 hover:text-red-400
                               transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <Pagination current={page} total={totalPages} onChange={setPage} />
      )}
    </div>
  );
}
