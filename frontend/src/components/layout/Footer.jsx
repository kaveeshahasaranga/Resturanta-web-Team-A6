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
                Mondays reserved for cinnamon wood cure
              </p>
            </div>
          </div>

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
              </p>
            </div>
          </div>
        </div>
      </div>

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
          </button>
        </div>
      </div>
    </footer>
  );
}
