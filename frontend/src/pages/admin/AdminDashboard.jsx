import { useEffect, useState } from 'react';
import { ShoppingBag, UtensilsCrossed, DollarSign, MessageSquare, TrendingUp } from 'lucide-react';
import { adminApi } from '../../services/api.js';

const StatCard = ({ icon: Icon, label, value, color = 'text-fuchsiusOrange' }) => (
  <div className="card flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-fuchsiusWhite mt-0.5">{value}</p>
    </div>
  </div>
);

const MOCK_STATS = {
  totalOrders:    24,
  totalRevenue:   '18450.00',
  pendingOrders:  5,
  totalMenuItems: 6,
  unreadMessages: 3,
};

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard()
      .then(res => setStats(res.data ?? res))
      .catch(() => setStats(MOCK_STATS))   // backend offline → show demo numbers
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <p className="text-gray-700 text-[12px] mb-3">/</p>
      <h1 className="font-serif text-[30px] md:text-[36px] font-semibold
                     text-fuchsiusWhite leading-tight mb-1">
        Dashboard
      </h1>
      <p className="text-gray-600 text-[12px] tracking-wide mb-8">
        Welcome back to FUCHSIUS admin
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-24 animate-pulse bg-neutral-900" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard icon={ShoppingBag}     label="Total Orders"   value={stats.totalOrders}    />
          <StatCard icon={DollarSign}      label="Total Revenue"  value={`Rs ${parseFloat(stats.totalRevenue).toFixed(2)}`} color="text-green-400" />
          <StatCard icon={TrendingUp}      label="Pending Orders" value={stats.pendingOrders}  color="text-yellow-400" />
          <StatCard icon={UtensilsCrossed} label="Menu Items"     value={stats.totalMenuItems} color="text-blue-400" />
        </div>
      ) : (
        <p className="text-red-400">Failed to load stats.</p>
      )}

      <div className="mt-8 card">
        <h2 className="font-semibold text-gray-300 mb-2">Quick Actions</h2>
        <div className="flex flex-wrap gap-3 mt-3">
          <a href="/admin/menu/new" className="btn-primary text-sm">+ Add Menu Item</a>
          <a href="/admin/orders"   className="btn-outline text-sm">View Orders</a>
          <a href="/admin/contact"  className="btn-ghost text-sm flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Messages {stats?.unreadMessages > 0 && `(${stats.unreadMessages} new)`}
          </a>
        </div>
      </div>
    </div>
  );
}
