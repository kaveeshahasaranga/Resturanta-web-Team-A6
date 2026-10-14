import React from 'react';
import { UserRound, Receipt, Bookmark, Shield, LogOut } from 'lucide-react';

export default function ProfileSidebar({ activeTab, onSelectTab, onLogout, userProfile }) {
  const patronName = userProfile?.name || 'Thrishala Weerasekara';
  const patronEmail = userProfile?.email || 'thrishala@example.lk';
  const patronPhone = userProfile?.phone || '077 123 4567';

  const menuItems = [
    {
      id: 'profile',
      label: 'MY PROFILE',
      icon: UserRound,
    },
    {
      id: 'orders',
      label: 'MY ORDERS',
      icon: Receipt,
    },
    {
      id: 'saved',
      label: 'SAVED DISHES',
      icon: Bookmark,
    },
    {
      id: 'security',
      label: 'SECURITY',
      icon: Shield,
    },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-sm sticky top-6">
        {/* Patron Avatar & Info */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-white/[0.08]">
          <div className="w-20 h-20 rounded-xl bg-[#1b1a1f] border border-white/10 flex items-center justify-center shadow-inner relative group mb-4">
            <span className="font-serif text-2xl font-medium tracking-wider text-[#d4af37]">
              TW
            </span>
          </div>

          <h2 className="font-serif text-xl sm:text-[22px] font-normal text-white tracking-wide">
            {patronName}
          </h2>

          <p className="text-neutral-400 text-xs mt-1 font-sans">
            {patronEmail}
          </p>
          <p className="text-neutral-500 text-xs font-sans mt-0.5">
            {patronPhone}
          </p>

          <div className="mt-3.5 inline-flex items-center px-3 py-1 rounded bg-[#221710] border border-[#e66200]/30 text-[#e66200] text-[10px] font-semibold tracking-widest uppercase">
            PATRON ACCOUNT
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-5 space-y-1.5" aria-label="Customer Profile Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-medium tracking-wider uppercase transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#202024] text-white border-l-2 border-[#e66200] shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#e66200]' : 'text-neutral-400'
                  }`}
                />
                <span className="font-sans">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider & Logout */}
        <div className="pt-4 border-t border-white/[0.08]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-medium tracking-wider uppercase text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200 text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0 text-neutral-400" />
            <span className="font-sans">LOGOUT</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
