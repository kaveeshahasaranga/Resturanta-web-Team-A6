<<<<<<< HEAD
import React from 'react';
import { Flame, Instagram, Facebook, MessageCircle, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#070709] border-t border-white/[0.08] mt-auto text-neutral-400 font-sans">
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
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/chefs" className="hover:text-white transition-colors">
                  Chefs
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
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
=======
import { Flame, Facebook, Instagram, MessageCircle, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const EXPLORE_LINKS = [
  { label: 'Home & Philosophy',    to: '/' },
  { label: 'Culinary Heritage',    to: '/about' },
  { label: 'Hearth Masters',       to: '/chefs' },
  { label: 'Clay Pot Degustation', to: '/menu' },
  { label: 'Private Hearth Booking', to: '/contact' },
];

const SOCIAL_LINKS = [
  { icon: Facebook,       href: '#', label: 'Facebook' },
  { icon: Instagram,      href: '#', label: 'Instagram' },
  { icon: MessageCircle,  href: '#', label: 'WhatsApp' },
  { icon: Music,          href: '#', label: 'TikTok' },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#111111] border-t border-white/8 mt-auto">

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">

          {/* ── Col 1: Brand ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <Flame className="w-5 h-5 text-fuchsiusOrange fill-fuchsiusOrange" />
              <span className="font-serif font-bold tracking-[0.25em] text-fuchsiusOrange
                               text-[13px] uppercase">
                FUCHSIUS
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-gray-500 text-[13px] leading-relaxed max-w-[220px]">
              Ancient Sri Lankan hearths, clay pot cookery, and glowing Ceylon ironwood embers
              articulated through artisanal gastronomy and fire-crafted ritual dining.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center
                             justify-center text-gray-400 hover:text-fuchsiusWhite
                             hover:border-white/50 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Explore ───────────────────────────────────────────── */}
          <div>
            <h3 className="text-fuchsiusWhite text-[11px] font-bold tracking-[0.22em]
                           uppercase mb-5">
              EXPLORE
            </h3>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 text-[13px] hover:text-fuchsiusWhite
                               transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Service Hours ─────────────────────────────────────── */}
          <div>
            <h3 className="text-fuchsiusWhite text-[11px] font-bold tracking-[0.22em]
                           uppercase mb-5">
              SERVICE HOURS
            </h3>
            <div className="space-y-3">
              <p className="text-fuchsiusWhite text-[13px] font-semibold">
                Tuesday — Sunday
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Sundown Ember Sessions: 17:30 – 20:30
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Nightfire Degustation: 21:00 – 23:30
              </p>
              <p className="text-gray-600 text-[12px] italic leading-relaxed">
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
                Mondays reserved for cinnamon wood cure
              </p>
            </div>
          </div>

<<<<<<< HEAD
          {/* Column 4: HEARTH SANCTUARY */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white font-sans mb-4">
              HEARTH SANCTUARY
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400 leading-relaxed">
              <p>44 Ironwood Pavilion, Galle Fort</p>
              <p>Southern Province, Sri Lanka</p>
              <p className="text-[#d4af37] hover:text-[#e66200] transition-colors cursor-pointer">
                reservations@praneetha.lk
              </p>
              <p className="text-neutral-300">
                +94 (91) 458 8900
=======
          {/* ── Col 4: Hearth Sanctuary ──────────────────────────────────── */}
          <div>
            <h3 className="text-fuchsiusWhite text-[11px] font-bold tracking-[0.22em]
                           uppercase mb-5">
              HEARTH SANCTUARY
            </h3>
            <div className="space-y-3 text-[13px]">
              <p className="text-gray-400 leading-relaxed">
                44 Ironwood Pavilion, Galle Fort<br />
                Southern Province, Sri Lanka
              </p>
              <p className="text-gray-400 mt-4">
                <a
                  href="mailto:reservations@fuchsius.com"
                  className="hover:text-fuchsiusWhite transition-colors duration-200"
                >
                  reservations@fuchsius.com
                </a>
              </p>
              <p className="text-gray-400">
                <a
                  href="tel:+94914588900"
                  className="hover:text-fuchsiusWhite transition-colors duration-200"
                >
                  +94 (91) 458 8900
                </a>
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
              </p>
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-sans">
          <p>© 2025 PRANEETHA Culinary Hearth. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="text-neutral-400 hover:text-white font-mono text-[11px] tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1 group"
          >
            <span>BACK TO TOP</span>
            <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
=======
      {/* ── Bottom Bar ─────────────────────────────────────────────────────── */}
      <div className="border-t border-white/8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4
                        flex items-center justify-between">
          <p className="text-gray-600 text-[12px]">
            © {new Date().getFullYear()} FUCHSIUS Culinary Hearth. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="text-gray-500 text-[12px] tracking-[0.12em] uppercase
                       hover:text-fuchsiusWhite transition-colors duration-200"
          >
            BACK TO TOP ↑
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
          </button>
        </div>
      </div>
    </footer>
  );
}
