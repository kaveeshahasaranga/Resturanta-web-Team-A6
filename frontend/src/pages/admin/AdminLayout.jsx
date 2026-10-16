import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  UtensilsCrossed, 
  ShoppingBag, 
  Home, 
  Info, 
  Settings, 
  Flame, 
  LogOut,
  Mail
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/admin/categories', label: 'Categories', icon: Layers },
    { path: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/home', label: 'Home Content', icon: Home },
    { path: '/admin/about', label: 'About Content', icon: Info },       // මෙතැන /admin/about ලෙස නිවැරදි කරන ලදී
    { path: '/admin/contact', label: 'Contact Content', icon: Mail },   // Contact සඳහා ද එකතු කරන ලදී
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#000000] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col justify-between p-6 fixed h-full z-20 overflow-y-auto">
        <div>
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6 cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-[#ec6f00]/10 border border-[#ec6f00]/30 flex items-center justify-center text-[#ec6f00]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-[#ec6f00] font-serif">PRANEETHA</h1>
              <p className="text-[10px] tracking-widest text-gray-400 uppercase">CEYLON HEARTH</p>
            </div>
          </div>

          {/* Section Title */}
          <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-3 px-3">
            Hearth Management
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#ec6f00] text-black font-bold shadow-[0_0_15px_rgba(236,111,0,0.3)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Log Out Button */}
        <div className="pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 bg-[#000000] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;