import { Flame, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-fuchsiusOrange" />
              <span className="text-lg font-serif font-bold tracking-[0.24em]">PRANEETHA</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ancient Sri Lankan hearths, clay pot cookery, and glowing Ceylon ironwood embers articulated through ancestral gastronomy and fire-crafted ritual dining.
            </p>
            <div className="flex gap-2 mt-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" aria-label={['Facebook', 'Instagram', 'Twitter'][i]} className="text-gray-500 hover:text-fuchsiusOrange transition-colors p-2 rounded-full border border-white/[0.08] hover:bg-fuchsiusOrange/10">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-fuchsiusOrange font-semibold text-xs uppercase tracking-[0.2em] mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[['/', 'Home & Philosophy'], ['/menu', 'Culinary Heritage'], ['/menu', 'Hearth Masters'], ['/menu', 'Clay Pot Degustation'], ['/contact', 'Private Hearth Booking']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-fuchsiusOrange transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-fuchsiusOrange font-semibold text-xs uppercase tracking-[0.2em] mb-4">Service hours</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Tuesday — Sunday</li>
              <li>Sundown Ember Sessions: 17:30 – 20:30</li>
              <li>Nightfire Degustation: 21:00 – 23:30</li>
              <li className="text-gray-600 italic">Mondays reserved for cinnamon wood care</li>
            </ul>
          </div>

          <div>
            <h3 className="text-fuchsiusOrange font-semibold text-xs uppercase tracking-[0.2em] mb-4">Hearth sanctuary</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>44 Ironwood Pavilion, Galle Fort</li>
              <li>Southern Province, Sri Lanka</li>
              <li className="pt-2"><a href="mailto:reservations@praneetha.lk" className="text-stone-300 hover:text-orange-300">reservations@praneetha.lk</a></li>
              <li><a href="tel:+94914588900" className="hover:text-orange-300">+94 (91) 458 8900</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-gray-600 text-xs">
          <span>&copy; {new Date().getFullYear()} PRANEETHA Culinary Hearth. All rights reserved.</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="sm:ml-auto hover:text-orange-300">Back to top ↑</button>
        </div>
      </div>
    </footer>
  );
}
