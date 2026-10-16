import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { Flame } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-fuchsiusBlack">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Flame className="w-12 h-12 text-fuchsiusOrange fill-fuchsiusOrange mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Our <span className="text-fuchsiusOrange">Philosophy</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Ancient Sri Lankan hearths, clay pot cookery, and glowing Ceylon ironwood embers
            articulated through artisanal gastronomy and fire-crafted ritual dining.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
