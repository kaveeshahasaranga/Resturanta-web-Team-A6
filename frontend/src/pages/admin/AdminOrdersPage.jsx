import { useEffect, useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { orderApi } from '../../services/api.js';

const STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

const STATUS_BADGE = {
  PENDING:   'badge-pending',
  CONFIRMED: 'badge-confirmed',
  PREPARING: 'badge-preparing',
  READY:     'badge-ready',
  DELIVERED: 'badge-delivered',
  CANCELLED: 'badge-cancelled',
};

// ─── Demo orders shown when backend is offline ────────────────────────────────
const MOCK_ORDERS = [
  { id: 'ord-001', customerName: 'Ashan Perera',    customerEmail: 'ashan@example.com',   total: '263.00', status: 'PENDING',   createdAt: new Date(Date.now() - 10*60000).toISOString() },
  { id: 'ord-002', customerName: 'Nimesha Silva',   customerEmail: 'nimesha@example.com', total: '330.00', status: 'PREPARING', createdAt: new Date(Date.now() - 25*60000).toISOString() },
  { id: 'ord-003', customerName: 'Kasun Fernando',  customerEmail: 'kasun@example.com',   total: '145.00', status: 'CONFIRMED', createdAt: new Date(Date.now() - 45*60000).toISOString() },
  { id: 'ord-004', customerName: 'Dilani Jayawardena', customerEmail: 'dilani@example.com', total: '448.00', status: 'DELIVERED', createdAt: new Date(Date.now() - 2*3600000).toISOString() },
  { id: 'ord-005', customerName: 'Thilina Bandara', customerEmail: 'thilina@example.com', total: '78.00',  status: 'READY',     createdAt: new Date(Date.now() - 15*60000).toISOString() },
];

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');

  useEffect(() => {
    const params = filter !== 'ALL' ? `?status=${filter}` : '';
    setLoading(true);
    orderApi.getAll(params)
      .then(res => {
        const list = Array.isArray(res) ? res : (res.data ?? res);
        setOrders(list.length > 0 ? list : MOCK_ORDERS);
      })
      .catch(() => {
        // Backend offline — filter mock data by status
        const filtered = filter === 'ALL'
          ? MOCK_ORDERS
          : MOCK_ORDERS.filter(o => o.status === filter);
        setOrders(filtered);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await orderApi.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.data.status } : o));
    } catch (err) {
      alert(err.message);
    }
  };

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
        <p className="text-center text-gray-500 py-16">No orders found.</p>
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
                    ${parseFloat(order.total).toFixed(2)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
