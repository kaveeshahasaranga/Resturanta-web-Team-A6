import React, { useEffect, useState } from 'react';
import { Eye, RotateCcw, Check, Loader2 } from 'lucide-react';
import { orderApi } from '../../services/api.js';

export const initialOrdersList = [
  {
    id: '#ORD-1052',
    date: 'Today, 14:20',
    status: 'Preparing',
    statusCode: 'active',
    items: [
      { name: 'Artisanal Dutch Burgher Lamprais', qty: 1 },
      { name: 'Spiced Ceylon Ginger Tea Reserve', qty: 2 },
    ],
    total: 'LKR 4,100',
    canReorder: false,
  },
  {
    id: '#ORD-1048',
    date: '05 October 2026',
    status: 'Completed',
    statusCode: 'completed',
    items: [
      { name: 'Chicken Kottu', qty: 2 },
      { name: 'Fresh Lime Juice', qty: 1 },
      { name: 'Signature Ceylon Black Pepper Crab Degustation', qty: 1 },
    ],
    total: 'LKR 4,850',
    canReorder: true,
  },
  {
    id: '#ORD-0988',
    date: '18 September 2026',
    status: 'Completed',
    statusCode: 'completed',
    items: [
      { name: 'Seafood Fried Rice', qty: 1 },
      { name: 'Hot Butter Cuttlefish', qty: 1 },
    ],
    total: 'LKR 4,050',
    canReorder: true,
  },
  {
    id: '#ORD-0891',
    date: '22 August 2026',
    status: 'Completed',
    statusCode: 'completed',
    items: [
      { name: 'Ceylon Spiced Mutton Biryani', qty: 1 },
      { name: 'Fresh Lime Juice', qty: 2 },
    ],
    total: 'LKR 2,400',
    canReorder: true,
  },
];

export default function MyOrdersTab({ onViewOrder, onReorder }) {
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'COMPLETED'
  const [reorderNotice, setReorderNotice] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    orderApi.getMine()
      .then(response => { if (active) setOrders(response.data || []); })
      .catch(err => { if (active) setError(err.message || 'Could not load your orders.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const isActive = status => ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(status);
  const filteredOrders = orders.filter((ord) => {
    if (activeFilter === 'ACTIVE') return isActive(ord.status);
    if (activeFilter === 'COMPLETED') return !isActive(ord.status);
    return true;
  });

  const activeCount = orders.filter((o) => isActive(o.status)).length;
  const completedCount = orders.length - activeCount;
  const money = amount => `LKR ${Number(amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleReorderClick = (order) => {
    if (onReorder) {
      onReorder(order);
    }
    setReorderNotice(`Items from ${order.id} added to degustation cart.`);
    setTimeout(() => setReorderNotice(null), 3000);
  };

  return (
    <div className="space-y-7 animate-fade-in">
      {/* ─── Header ─── */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-wide">
          My Orders
        </h1>
        <p className="text-neutral-400 text-xs sm:text-[13px] mt-1.5 font-sans leading-relaxed">
          Review your past dining reservations and orders.
        </p>
      </div>

      {/* ─── Status Filter Tabs ─── */}
      <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-md transition-all duration-200 cursor-pointer ${
            activeFilter === 'ALL'
              ? 'bg-[#18181b] text-[#e66200] border border-[#e66200] shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          ALL ORDERS ({orders.length})
        </button>

        <button
          onClick={() => setActiveFilter('ACTIVE')}
          className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-md transition-all duration-200 cursor-pointer ${
            activeFilter === 'ACTIVE'
              ? 'bg-[#18181b] text-[#e66200] border border-[#e66200] shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          ACTIVE ({activeCount})
        </button>

        <button
          onClick={() => setActiveFilter('COMPLETED')}
          className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-md transition-all duration-200 cursor-pointer ${
            activeFilter === 'COMPLETED'
              ? 'bg-[#18181b] text-[#e66200] border border-[#e66200] shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          COMPLETED ({completedCount})
        </button>
      </div>

      {reorderNotice && (
        <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#e66200] text-xs flex items-center gap-2.5 animate-slide-down">
          <Check className="w-4 h-4 shrink-0" />
          <span>{reorderNotice}</span>
        </div>
      )}

      {error && <p className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">{error}</p>}

      {/* ─── Order Cards List ─── */}
      {loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange-500" /></div> : <div className="space-y-4">
        {filteredOrders.map((order) => {
          const active = isActive(order.status);

          return (
            <div
              key={order.id}
              className="bg-[#141416] border border-white/[0.08] rounded-xl p-5 sm:p-6 transition-all duration-300 hover:border-white/20 shadow-xl"
            >
              {/* Order Card Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5 text-xs font-mono">
                  <span className="text-white font-semibold tracking-wider">
                    #{order.id}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400 font-sans">{new Date(order.createdAt).toLocaleString()}</span>
                </div>

                {/* Status Badge */}
                <div>
                  {active ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      <span>{order.status}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{order.status}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items Bullet List */}
              <div className="py-4 space-y-1.5 text-xs text-neutral-300 font-sans">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="text-[#e66200] text-sm leading-none">•</span>
                    <span className="text-neutral-300">{item.menuItem?.name || 'Menu item'}</span>
                    <span className="text-neutral-500">× {item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Order Card Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.08]">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-neutral-400 font-sans">Total</span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                    {money(order.total)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onViewOrder(order.id)}
                    className="px-4 py-2 rounded-lg bg-[#1a1a1e] border border-white/10 text-xs font-semibold text-white tracking-wider uppercase hover:border-[#e66200] hover:text-[#e66200] transition-all duration-200 cursor-pointer"
                  >
                    VIEW DETAILS
                  </button>

                  {order.status === 'DELIVERED' && onReorder && (
                    <button
                      onClick={() => handleReorderClick(order)}
                      className="px-4 py-2 rounded-lg bg-[#1a1a1e] border border-white/10 text-xs font-semibold text-[#e66200] tracking-wider uppercase hover:border-[#e66200] hover:bg-[#e66200]/10 transition-all duration-200 cursor-pointer"
                    >
                      REORDER
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {!error && filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-[#141416] border border-white/[0.08] rounded-xl text-neutral-400 text-sm">
            No orders found under this filter.
          </div>
        )}
      </div>}
    </div>
  );
}
