import React from 'react';
import { Flame, Instagram, Facebook, MessageCircle, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PraneethaFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#070709] border-t border-white/[0.08] mt-24 text-neutral-400 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/[0.08]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#e66200]/10 flex items-center justify-center text-[#e66200]">
                <Flame className="w-5 h-5 fill-[#e66200]" />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-normal text-white tracking-[0.25em]">
                PRANEETHA
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-sans pt-1">
              Ancient Sri Lankan hearths, clay pot cookery, and glowing Ceylon ironwood embers articulated through artisanal gastronomy and fire-crafted ritual dining.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#e66200] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#e66200] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#whatsapp"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#e66200] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#tiktok"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#e66200] transition-colors"
              >
                <Music2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: EXPLORE */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white font-sans mb-4">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Culinary Heritage
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Hearth Masters
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Clay Pot Degustation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Private Hearth Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: SERVICE HOURS */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white font-sans mb-4">
              SERVICE HOURS
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400 leading-relaxed">
              <p className="text-white font-medium">Tuesday — Sunday</p>
              <p>Sundown Ember Sessions: 17:30 – 20:30</p>
              <p>Nightfire Degustation: 21:00 – 23:30</p>
              <p className="italic text-neutral-500 pt-1">
                Mondays reserved for cinnamon wood cure
              </p>
            </div>
          </div>

          {/* Column 4: HEARTH SANCTUARY */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white font-sans mb-4">
              HEARTH SANCTUARY
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400 leading-relaxed">
              <p>44 Ironwood Pavilion, Galle Fort</p>
              <p>Southern Province, Sri Lanka</p>
              <p className="text-white hover:text-[#e66200] transition-colors cursor-pointer">
                reservations@praneetha.lk
              </p>
              <p className="text-neutral-300">
                +94 (91) 458 8900
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-sans">
          <p>© 2025 PRANEETHA Culinary Hearth. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="text-neutral-400 hover:text-white font-mono text-[11px] tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1 group"
          >
            <span>BACK TO TOP</span>
            <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
