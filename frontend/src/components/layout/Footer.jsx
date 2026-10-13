import { UtensilsCrossed, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-6 h-6 text-fuchsiusOrange" />
              <span className="text-lg font-serif font-bold tracking-widest">FUCHSIUS</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Fine dining reimagined. Experience culinary excellence from the comfort of your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-fuchsiusOrange font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[['/', 'Home'], ['/menu', 'Menu'], ['/chefs', 'Chefs'], ['/cart', 'Cart'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-fuchsiusOrange transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-fuchsiusOrange font-semibold text-sm uppercase tracking-wider mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-500 hover:text-fuchsiusOrange transition-colors p-2 rounded-lg hover:bg-fuchsiusOrange/10">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} FUCHSIUS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
