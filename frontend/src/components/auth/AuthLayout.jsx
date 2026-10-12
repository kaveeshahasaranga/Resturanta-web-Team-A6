import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PrivateDiningModal from './PrivateDiningModal.jsx';

export default function AuthLayout({ children }) {
  const [isPrivateDiningOpen, setIsPrivateDiningOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between overflow-x-hidden selection:bg-[#e66200] selection:text-white">
      {/* ─── Ambient Lighting Effects ─── */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          background: 'radial-gradient(circle 700px at 50% 45%, rgba(230, 98, 0, 0.08) 0%, rgba(9, 9, 11, 0.95) 75%)'
        }}
      />

      {/* Subtle Warm Particle Glow Orbs */}
      <div className="pointer-events-none fixed top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#e66200]/[0.03] blur-3xl animate-pulse-slow" />
      <div className="pointer-events-none fixed bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-orange-600/[0.025] blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* ─── Header ─── */}
      <header className="relative z-10 w-full px-6 sm:px-12 pt-8 sm:pt-10 pb-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          to="/login"
          className="group flex items-center tracking-[0.24em] font-serif text-lg sm:text-xl font-medium text-white transition-opacity duration-300 hover:opacity-90"
        >
          <span>PRANEETHA</span>
          <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#e66200] ml-2 sm:ml-2.5 shadow-[0_0_10px_#e66200] group-hover:scale-125 transition-transform duration-300" />
        </Link>

        {/* Private Dining Access Button */}
        <button
          onClick={() => setIsPrivateDiningOpen(true)}
          className="group relative text-[11px] sm:text-xs font-sans tracking-[0.18em] uppercase text-neutral-400 hover:text-white transition-colors duration-300 py-1 px-2 rounded-md hover:bg-white/[0.03]"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <span>PRIVATE DINING ACCESS</span>
          </span>
          <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-[#e66200]/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </button>
      </header>

      {/* ─── Main Content Canvas ─── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[440px] sm:max-w-[460px]">
          {children}
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 w-full py-6 text-center">
        <p className="text-[11px] sm:text-xs font-sans tracking-wide text-neutral-500">
          © 2026 PRANEETHA. Crafted dining experience.
        </p>
      </footer>

      {/* ─── Private Dining Concierge Modal ─── */}
      <PrivateDiningModal 
        isOpen={isPrivateDiningOpen} 
        onClose={() => setIsPrivateDiningOpen(false)} 
      />
    </div>
  );
}
