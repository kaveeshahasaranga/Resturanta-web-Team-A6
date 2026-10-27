import { useEffect, useState } from 'react';
import { Loader2, ChevronDown, Eye, X } from 'lucide-react';
import { adminApi } from '../../services/api.js';

const STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

const STATUS_BADGE = {
  PENDING:   'badge-pending',
  CONFIRMED: 'badge-confirmed',
  PREPARING: 'badge-preparing',
  READY:     'badge-ready',
  DELIVERED: 'badge-delivered',
  CANCELLED: 'badge-cancelled',
};

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const params = filter !== 'ALL' ? `?status=${filter}` : '';
    setLoading(true);
    setError('');
    adminApi.getOrders(params)
      .then(res => {
        setOrders(res.data || []);
      })
      .catch(err => { setOrders([]); setError(err.message || 'Could not load orders.'); })
      .finally(() => setLoading(false));
  }, [filter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.data.status } : o));
      setSelectedOrder(prev => prev?.id === orderId ? { ...prev, status: updated.data.status } : prev);
    } catch (err) {
      alert(err.message);
    }
  };

  const viewDetails = async orderId => {
    setSelectedOrder(null);
    setDetailLoading(true);
    try {
      const response = await adminApi.getOrder(orderId);
      setSelectedOrder(response.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const money = amount => `LKR ${Number(amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{orders.length} result{orders.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {['ALL', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border
                ${filter === s
                  ? 'bg-fuchsiusOrange text-white border-fuchsiusOrange'
                  : 'text-gray-400 border-white/15 hover:border-fuchsiusOrange/40'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-fuchsiusOrange animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 py-16">{error || 'No orders found.'}</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs text-gray-500 font-mono">#{order.id}</span>
                    <span className={STATUS_BADGE[order.status]}>{order.status}</span>
                  </div>
                  <h3 className="font-semibold text-fuchsiusWhite">{order.customerName}</h3>
                  <p className="text-gray-500 text-sm">{order.customerEmail}</p>
                  <p className="text-xs text-gray-600 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="text-right">
                  <p className="text-fuchsiusOrange font-bold text-lg">
                    {money(order.total)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>

                  {/* Status updater */}
                  <div className="relative mt-3">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="input-field text-xs py-1.5 pr-8 cursor-pointer appearance-none"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Items list */}
              {order.items?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map(item => (
                      <span key={item.id} className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-gray-300">
                        {item.menuItem?.name} ×{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => viewDetails(order.id)} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-fuchsiusOrange hover:text-orange-300"><Eye size={14} /> VIEW ORDER DETAILS</button>
            </div>
          ))}
        </div>
      )}

      {detailLoading && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"><Loader2 className="animate-spin text-fuchsiusOrange" /></div>}
      {selectedOrder && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-label={`Order ${selectedOrder.id} details`}>
        <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-white/10 bg-[#111] p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-mono text-gray-500">ORDER #{selectedOrder.id}</p><h2 className="mt-1 text-xl font-serif">{selectedOrder.customerName}</h2><p className="text-sm text-gray-400">{selectedOrder.customerEmail} · {selectedOrder.customerPhone || 'No phone'}</p></div><button onClick={() => setSelectedOrder(null)} aria-label="Close details" className="text-gray-400 hover:text-white"><X /></button></div>
          <p className="mt-3 text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()} · {selectedOrder.status}</p>
          <p className="mt-3 text-sm text-gray-300">{selectedOrder.deliveryAddress || 'Pickup / confirm with customer'}</p>
          {selectedOrder.notes && <p className="mt-2 text-sm text-gray-400">Notes: {selectedOrder.notes}</p>}
          <div className="mt-5 divide-y divide-white/10 border-y border-white/10">{selectedOrder.items?.map(item => <div key={item.id} className="flex justify-between gap-4 py-3 text-sm"><span>{item.menuItem?.name || 'Menu item'} × {item.quantity}</span><span>{money(item.totalPrice)}</span></div>)}</div>
          <div className="mt-4 flex justify-between font-semibold"><span>Order total</span><span className="text-fuchsiusOrange">{money(selectedOrder.total)}</span></div>
        </div>
      </div>}
    </div>
  );
}
