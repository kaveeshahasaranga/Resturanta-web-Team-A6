import React, { useState } from 'react';
import { Eye, RotateCcw, Check, Sparkles } from 'lucide-react';

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

  const filteredOrders = initialOrdersList.filter((ord) => {
    if (activeFilter === 'ACTIVE') return ord.statusCode === 'active';
    if (activeFilter === 'COMPLETED') return ord.statusCode === 'completed';
    return true;
  });

  const activeCount = initialOrdersList.filter((o) => o.statusCode === 'active').length;
  const completedCount = initialOrdersList.filter((o) => o.statusCode === 'completed').length;

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
          ALL ORDERS ({initialOrdersList.length})
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

      {/* ─── Order Cards List ─── */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isPreparing = order.status === 'Preparing';

          return (
            <div
              key={order.id}
              className="bg-[#141416] border border-white/[0.08] rounded-xl p-5 sm:p-6 transition-all duration-300 hover:border-white/20 shadow-xl"
            >
              {/* Order Card Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5 text-xs font-mono">
                  <span className="text-white font-semibold tracking-wider">
                    {order.id}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400 font-sans">{order.date}</span>
                </div>

                {/* Status Badge */}
                <div>
                  {isPreparing ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      <span>Preparing</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items Bullet List */}
              <div className="py-4 space-y-1.5 text-xs text-neutral-300 font-sans">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[#e66200] text-sm leading-none">•</span>
                    <span className="text-neutral-300">{item.name}</span>
                    <span className="text-neutral-500">× {item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Order Card Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.08]">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-neutral-400 font-sans">Total</span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                    {order.total}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onViewOrder(order.id)}
                    className="px-4 py-2 rounded-lg bg-[#1a1a1e] border border-white/10 text-xs font-semibold text-white tracking-wider uppercase hover:border-[#e66200] hover:text-[#e66200] transition-all duration-200 cursor-pointer"
                  >
                    VIEW DETAILS
                  </button>

                  {order.canReorder && (
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-[#141416] border border-white/[0.08] rounded-xl text-neutral-400 text-sm">
            No orders found under this filter.
          </div>
        )}
      </div>
    </div>
  );
}
