import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <nav className="p-4 border-b border-white/10 flex justify-between items-center bg-[#141417]">
        <span className="font-serif text-lg tracking-wider">PRANEETHA ADMIN</span>
        <Link to="/login?role=admin" className="text-xs text-[#e66200] hover:underline">
          Switch to Admin Portal View
        </Link>
      </nav>
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
