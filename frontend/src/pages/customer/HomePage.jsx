<<<<<<< HEAD
import React from 'react';
import { Navigate, Link } from 'react-router-dom';

export default function HomePage() {
  return <Navigate to="/login" replace />;
=======
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowRight, Star } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-fuchsiusBlack">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(236,111,0,0.15)_0%,_transparent_70%)]" />

        <div className="relative text-center px-4 animate-slide-up max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-fuchsiusOrange/10 border border-fuchsiusOrange/30 text-fuchsiusOrange text-sm px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 fill-fuchsiusOrange" />
            Award-winning restaurant experience
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-fuchsiusWhite mb-6 leading-tight">
            Fine Dining,<br />
            <span className="text-fuchsiusOrange">Reimagined</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience culinary excellence crafted by world-class chefs, delivered straight to your door.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
              <UtensilsCrossed className="w-5 h-5" />
              Explore Menu
            </Link>
            <Link to="/contact" className="btn-outline inline-flex items-center gap-2 text-base px-8 py-3">
              Reserve a Table <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
}
