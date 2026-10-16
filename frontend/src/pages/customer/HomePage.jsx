import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, Flame, Clock, MapPin, Phone,
  ChevronLeft, ChevronRight, Leaf, Zap, Heart,
  Award, UtensilsCrossed, Users, ShieldCheck,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SIGNATURE_DISHES = [
  {
    id: 1,
    tag: 'CHEF\'S SIGNATURE',
    name: 'Village Clay Pot Feast',
    subtitle: 'CLAY POT · HEARTH FIRED',
    price: 'LKR 1,850',
    rating: 4.9,
    reviews: 312,
    desc: 'Slow-simmered country chicken in a hand-thrown clay pot over coconut shell embers. Tempered with green cardamom, goraka, and fresh turmeric from our hill-country garden. Served with red parboiled rice and pol sambol.',
    badge: 'BESTSELLER',
    badgeColor: 'bg-fuchsiusOrange text-black',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
  },
  {
    id: 2,
    tag: 'VILLAGE CLASSIC',
    name: 'Creamy Coconut Kiri Hodhi',
    subtitle: 'COCONUT · TURMERIC BROTH',
    price: 'LKR 980',
    rating: 4.8,
    reviews: 198,
    desc: 'Velvety coconut milk gravy tempered with mustard seed, curry leaf, and dried Maldive fish. Poured warm over string hoppers pressed at dawn. A soul-restoring breakfast reimagined for every hour.',
    badge: 'VEGETARIAN',
    badgeColor: 'bg-emerald-600 text-white',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&q=80',
  },
  {
    id: 3,
    tag: 'HERITAGE RECIPE',
    name: 'Dutch-Era Lamprais',
    subtitle: 'DUTCH BURGHER · BANANA LEAF',
    price: 'LKR 1,450',
    rating: 4.9,
    reviews: 421,
    desc: 'The legendary Burgher parcel — saffron-scented Dutch rice, two meat curries, frikkadels, seeni sambol, and brinjal pahi — sealed in banana leaf and oven-baked for a ceremonial unwrap at your table.',
    badge: 'HERITAGE',
    badgeColor: 'bg-amber-700 text-white',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
  },
  {
    id: 4,
    tag: 'STREET FIRE',
    name: 'Fiery Street-Style Kottu Roti',
    subtitle: 'IRON GRIDDLE · STREET FIRE',
    price: 'LKR 1,150',
    rating: 4.7,
    reviews: 567,
    desc: 'Ceylon-style shredded roti chopped live on a screaming-hot iron griddle with devilled chicken, egg, leek, and a house chilli paste that honours the original Galle Face Green vendors of the 1970s.',
    badge: 'SPICY',
    badgeColor: 'bg-red-700 text-white',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
  },
];

const CORE_VALUES = [
  {
    step: '01',
    icon: Zap,
    title: 'Authentic Spice Kick',
    desc: 'Every spice blend is hand-pounded in stone mortars. We source whole spices from Matale and Kandy markets — never pre-ground, never a compromise.',
  },
  {
    step: '02',
    icon: Heart,
    title: 'Generous Portions',
    desc: 'Our grandmothers never served a half-plate. Each dish arrives abundant, nourishing, and made to be shared — because generosity is a love language here.',
  },
  {
    step: '03',
    icon: ShieldCheck,
    title: 'Commercial Precision',
    desc: 'Kitchen-grade consistency for every order. Our prep systems ensure the clay pot you get on a Tuesday is identical in love to the one you got on Saturday.',
  },
  {
    step: '04',
    icon: Leaf,
    title: 'Honest Colombo Soul',
    desc: 'No shortcuts. No artificial flavours. No imported shortcuts. What grows here feeds here — and that philosophy runs from our garden straight to your plate.',
  },
];

const CHEFS = [
  {
    id: 1,
    name: 'Rohan Samarasinghe',
    role: 'Executive Head Chef',
    years: '22 Years Mastery',
    specialty: 'Clay Pot & Wood-Fire Cuisine',
    signature: 'Village Clay Pot Feast',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80',
    awards: 3,
  },
  {
    id: 2,
    name: 'Mahinda Jayawardena',
    role: 'Senior Sous Chef',
    years: '16 Years Mastery',
    specialty: 'Heritage & Burgher Recipes',
    signature: 'Dutch-Era Lamprais',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80',
    awards: 2,
  },
  {
    id: 3,
    name: 'Dilani Perera',
    role: 'Pastry & Dessert Chef',
    years: '12 Years Mastery',
    specialty: 'Jaggery & Coconut Sweets',
    signature: 'Watalappam Soufflé',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=600&q=80',
    awards: 4,
  },
];

// ─── Floating spice badge component ──────────────────────────────────────────
function SpiceBadge({ label, emoji, style }) {
  return (
    <div
      style={style}
      className="absolute hidden lg:flex items-center gap-2 bg-black/70 border border-white/10
                 backdrop-blur-md px-3 py-2 rounded-full text-xs font-semibold
                 text-fuchsiusWhite shadow-lg animate-float-slow select-none"
    >
      <span className="text-base">{emoji}</span>
      {label}
    </div>
  );
}

// ─── Section label pill ───────────────────────────────────────────────────────
function SectionPill({ label }) {
  return (
    <div className="inline-flex items-center gap-2 bg-fuchsiusOrange/10 border border-fuchsiusOrange/30
                    text-fuchsiusOrange text-[10px] font-bold tracking-[0.25em] uppercase
                    px-4 py-1.5 mb-5">
      <Flame className="w-3 h-3 fill-fuchsiusOrange" />
      {label}
    </div>
  );
}

// ─── Dish Card ────────────────────────────────────────────────────────────────
function DishCard({ dish }) {
  return (
    <div className="group relative flex flex-col bg-[#0a0a0a] border border-white/[0.07]
                    hover:border-fuchsiusOrange/40 transition-all duration-500
                    overflow-hidden">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Badge */}
        <span className={`absolute top-3 left-3 text-[9px] font-black tracking-[0.2em]
                          px-2.5 py-1 ${dish.badgeColor}`}>
          {dish.badge}
        </span>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-black/80 border border-fuchsiusOrange/50
                        px-3 py-1 text-fuchsiusOrange font-bold text-sm backdrop-blur-sm">
          {dish.price}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
          {dish.tag}
        </p>
        <h3 className="font-serif text-fuchsiusWhite text-xl font-bold leading-tight mb-0.5">
          {dish.name}
        </h3>
        <p className="text-gray-600 text-[9px] tracking-[0.2em] uppercase font-semibold mb-3">
          {dish.subtitle}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(dish.rating)
              ? 'fill-fuchsiusOrange text-fuchsiusOrange'
              : 'text-gray-700'}`} />
          ))}
          <span className="text-gray-500 text-xs ml-1">{dish.rating} ({dish.reviews})</span>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed flex-1 mb-5">
          {dish.desc}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            to="/menu"
            className="flex-1 bg-fuchsiusOrange text-black text-xs font-black
                       tracking-[0.12em] uppercase py-2.5 text-center
                       hover:bg-orange-500 transition-colors duration-200"
          >
            Order Dish
          </Link>
          <Link
            to="/menu"
            className="px-4 border border-white/15 text-gray-400 text-xs font-semibold
                       hover:border-fuchsiusOrange/50 hover:text-fuchsiusOrange
                       transition-colors duration-200 flex items-center"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Chef Card ────────────────────────────────────────────────────────────────
function ChefCard({ chef }) {
  return (
    <div className="group relative overflow-hidden bg-[#0a0a0a] border border-white/[0.07]
                    hover:border-fuchsiusOrange/30 transition-all duration-500">
      {/* Photo */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={chef.image}
          alt={chef.name}
          className="w-full h-full object-cover object-top transition-transform duration-700
                     group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Awards */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5
                        bg-fuchsiusOrange/90 px-2.5 py-1 text-black text-[9px] font-black
                        tracking-[0.15em]">
          <Award className="w-3 h-3" />
          {chef.awards}x AWARD
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.3em] uppercase mb-1">
            {chef.role}
          </p>
          <h3 className="font-serif text-fuchsiusWhite text-xl font-bold">{chef.name}</h3>
          <p className="text-gray-500 text-[10px] tracking-[0.15em] font-semibold uppercase mt-0.5">
            {chef.years}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 border-t border-white/[0.06]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-gray-600 text-[9px] tracking-[0.2em] uppercase font-bold mb-1">
              Mastery
            </p>
            <p className="text-gray-300 text-xs font-semibold">{chef.specialty}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-[9px] tracking-[0.2em] uppercase font-bold mb-1">
              Signature
            </p>
            <p className="text-fuchsiusOrange text-xs font-semibold">{chef.signature}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef(null);

  // Auto-advance carousel every 5 s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide(s => (s + 1) % SIGNATURE_DISHES.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (idx) => {
    clearInterval(intervalRef.current);
    setActiveSlide(idx);
  };
  const prev = () => goTo((activeSlide - 1 + SIGNATURE_DISHES.length) % SIGNATURE_DISHES.length);
  const next = () => goTo((activeSlide + 1) % SIGNATURE_DISHES.length);

  return (
    <div className="min-h-screen flex flex-col bg-fuchsiusBlack">
      <Navbar />

      {/* ════════════════════════════════════════════════════════════════════
          1 · HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden pt-16">

        {/* Layered dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0200] via-[#000000] to-[#060200]" />

        {/* Cinematic radial orange bloom */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_55%,rgba(236,111,0,0.12)_0%,transparent_70%)]" />

        {/* Top-right corner accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px]
                        bg-[radial-gradient(circle,rgba(236,111,0,0.08)_0%,transparent_65%)]" />

        {/* Subtle grain overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        {/* Floating spice badges */}
        <SpiceBadge label="Red Parboiled Rice"  emoji="🍚" style={{ top: '22%', left: '6%',  animationDelay: '0s'   }} />
        <SpiceBadge label="Devilled Chicken"    emoji="🍗" style={{ top: '35%', left: '4%',  animationDelay: '1.2s' }} />
        <SpiceBadge label="Pol Sambol"          emoji="🥥" style={{ top: '60%', left: '7%',  animationDelay: '0.6s' }} />
        <SpiceBadge label="Dhal Curry"          emoji="🫘" style={{ top: '20%', right: '6%', animationDelay: '1.8s' }} />
        <SpiceBadge label="Ceylon Cinnamon"     emoji="🌿" style={{ top: '45%', right: '4%', animationDelay: '0.3s' }} />
        <SpiceBadge label="Goraka Spice"        emoji="🌶️" style={{ top: '68%', right: '7%', animationDelay: '2.1s' }} />

        {/* Hero content */}
        <div className="relative text-center px-6 max-w-5xl mx-auto">

          {/* Brand pill */}
          <div className="inline-flex items-center gap-2.5 border border-fuchsiusOrange/30
                          bg-fuchsiusOrange/5 backdrop-blur-sm
                          text-fuchsiusOrange text-[10px] font-bold tracking-[0.3em] uppercase
                          px-5 py-2 mb-8">
            <Flame className="w-3.5 h-3.5 fill-fuchsiusOrange" />
            Ceylon Hearth · Est. 1987 · Kollupitiya
          </div>

          {/* Main headline */}
          <h1 className="font-serif font-bold text-fuchsiusWhite leading-[1.05] mb-6">
            <span className="block text-4xl md:text-6xl lg:text-7xl tracking-tight">
              Authentic Clay Pot
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl text-fuchsiusOrange
                             italic tracking-tight mt-1">
              &amp; Hearth Cooking
            </span>
            <span className="block text-3xl md:text-5xl lg:text-6xl tracking-tight mt-2
                             text-fuchsiusWhite/80">
              of Ceylon
            </span>
          </h1>

          {/* Divider line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-fuchsiusOrange/60" />
            <Flame className="w-4 h-4 text-fuchsiusOrange fill-fuchsiusOrange" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-fuchsiusOrange/60" />
          </div>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Forged by four generations of village tradition. Every dish is
            simmered in authentic clay pots over coconut shell embers — the way
            grandmother always intended.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2.5
                         bg-fuchsiusOrange text-black font-black text-sm
                         tracking-[0.18em] uppercase px-8 py-4
                         hover:bg-orange-500 transition-all duration-300
                         shadow-orange-glow hover:shadow-orange-glow"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Explore Our Menu
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2.5
                         border border-white/20 text-fuchsiusWhite font-semibold text-sm
                         tracking-[0.12em] uppercase px-8 py-4
                         hover:border-fuchsiusOrange/60 hover:text-fuchsiusOrange
                         transition-all duration-300 backdrop-blur-sm"
            >
              Reserve a Table
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-16
                          border-t border-white/[0.06] pt-8">
            {[
              { value: '37+', label: 'Years of Heritage' },
              { value: '120+', label: 'Authentic Recipes' },
              { value: '4.9★', label: 'Customer Rating' },
              { value: '50K+', label: 'Happy Diners' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-fuchsiusOrange text-2xl md:text-3xl font-bold">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase font-semibold mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-fuchsiusOrange/60 to-transparent" />
          <p className="text-gray-700 text-[9px] tracking-[0.3em] uppercase font-bold">Scroll</p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          2 · SIGNATURE DISHES — CAROUSEL + GRID
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#000000] relative overflow-hidden">

        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
                        from-transparent via-fuchsiusOrange/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(236,111,0,0.05)_0%,transparent_70%)]" />

        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <SectionPill label="Curated Offerings" />
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-fuchsiusWhite leading-tight">
                Signature Dish
                <span className="block text-fuchsiusOrange italic text-3xl md:text-4xl mt-1">
                  Village Clay Pot Feast
                </span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Carousel dots */}
              <div className="flex gap-1.5">
                {SIGNATURE_DISHES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1 transition-all duration-300 ${
                      i === activeSlide
                        ? 'w-8 bg-fuchsiusOrange'
                        : 'w-3 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              {/* Prev / Next */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-9 h-9 border border-white/15 flex items-center justify-center
                             text-gray-500 hover:border-fuchsiusOrange/60 hover:text-fuchsiusOrange
                             transition-colors duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 border border-white/15 flex items-center justify-center
                             text-gray-500 hover:border-fuchsiusOrange/60 hover:text-fuchsiusOrange
                             transition-colors duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-fuchsiusOrange text-xs
                           font-bold tracking-[0.15em] uppercase hover:gap-3 transition-all duration-200"
              >
                Full Menu <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Featured (large) carousel card */}
          <div className="relative mb-10 overflow-hidden">
            {SIGNATURE_DISHES.map((dish, i) => (
              <div
                key={dish.id}
                className={`transition-all duration-700 ${
                  i === activeSlide ? 'block' : 'hidden'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-0 bg-[#0a0a0a] border border-white/[0.07]
                                hover:border-fuchsiusOrange/30 transition-colors duration-500 overflow-hidden">
                  {/* Image side */}
                  <div className="relative h-72 md:h-[420px] overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]/80
                                    md:bg-gradient-to-r" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                    <span className={`absolute top-4 left-4 text-[9px] font-black tracking-[0.2em]
                                      px-3 py-1.5 ${dish.badgeColor}`}>
                      {dish.badge}
                    </span>
                  </div>

                  {/* Text side */}
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.3em] uppercase mb-3">
                      {dish.tag}
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-fuchsiusWhite leading-tight mb-1">
                      {dish.name}
                    </h3>
                    <p className="text-gray-600 text-[9px] tracking-[0.25em] uppercase font-bold mb-4">
                      {dish.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mb-5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < Math.floor(dish.rating)
                          ? 'fill-fuchsiusOrange text-fuchsiusOrange' : 'text-gray-700'}`} />
                      ))}
                      <span className="text-gray-500 text-xs">{dish.rating} · {dish.reviews} reviews</span>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-8">{dish.desc}</p>

                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-gray-700 text-[9px] tracking-[0.2em] uppercase font-bold">Price</p>
                        <p className="text-fuchsiusOrange font-bold text-2xl mt-0.5">{dish.price}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to="/menu"
                        className="flex-1 bg-fuchsiusOrange text-black font-black text-xs
                                   tracking-[0.18em] uppercase py-3.5 text-center
                                   hover:bg-orange-500 transition-colors duration-200"
                      >
                        Order Dish
                      </Link>
                      <Link
                        to="/menu"
                        className="px-5 border border-white/15 text-gray-400 text-xs font-semibold
                                   hover:border-fuchsiusOrange/50 hover:text-fuchsiusOrange
                                   tracking-[0.12em] uppercase transition-colors duration-200
                                   flex items-center gap-2"
                      >
                        Explore Menu <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4-card grid below */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SIGNATURE_DISHES.map(dish => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          3 · "BORN IN FIRE" Brand Story Banner
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-0 overflow-hidden">
        {/* Dark cinematic photo layer */}
        <div className="relative h-[480px] md:h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
            alt="Kitchen preparation"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Heavy dark overlay */}
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(236,111,0,0.08)_0%,transparent_70%)]" />

          {/* Horizontal scan lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)' }} />

          {/* Top + Bottom borders */}
          <div className="absolute top-0 left-0 right-0 h-px bg-fuchsiusOrange/30" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-fuchsiusOrange/30" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.5em] uppercase mb-6">
              Our Story · Our Legacy
            </p>

            <h2 className="font-serif font-bold text-fuchsiusWhite leading-none mb-6">
              <span className="block text-5xl md:text-7xl lg:text-8xl tracking-tight">BORN IN</span>
              <span className="block text-6xl md:text-8xl lg:text-9xl text-fuchsiusOrange italic">
                FIRE
              </span>
            </h2>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-20 bg-fuchsiusOrange/40" />
              <Flame className="w-5 h-5 text-fuchsiusOrange fill-fuchsiusOrange" />
              <div className="h-px w-20 bg-fuchsiusOrange/40" />
            </div>

            <p className="text-gray-300 text-base md:text-xl max-w-2xl leading-relaxed font-light mb-4">
              Forged by generations of village tradition.
            </p>
            <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed">
              Simmered in authentic clay pots over coconut shell embers —
              a ritual passed from grandmother to grandmother since 1987.
              This is not just food. This is memory on a plate.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 border border-fuchsiusOrange/60
                           text-fuchsiusOrange font-bold text-xs tracking-[0.2em] uppercase
                           px-7 py-3.5 hover:bg-fuchsiusOrange hover:text-black
                           transition-all duration-300"
              >
                Our Full Story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/chefs"
                className="inline-flex items-center gap-2.5 border border-white/15
                           text-gray-400 font-semibold text-xs tracking-[0.15em] uppercase
                           px-7 py-3.5 hover:border-white/30 hover:text-white
                           transition-all duration-300"
              >
                Meet the Chefs <Users className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          4 · PILLARS OF THE KITCHEN — Core Values
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#050505] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
                        from-transparent via-fuchsiusOrange/20 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionPill label="What We Stand For" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-fuchsiusWhite">
              The Pillars of Our
              <span className="block text-fuchsiusOrange italic mt-1">Kitchen</span>
            </h2>
            <p className="text-gray-600 text-sm mt-4 max-w-md mx-auto">
              Four commitments we make to every guest, every service, every single day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CORE_VALUES.map((val, i) => (
              <div
                key={val.step}
                className="group relative bg-[#0a0a0a] border border-white/[0.06]
                           hover:border-fuchsiusOrange/40 p-7
                           transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Step number watermark */}
                <span className="absolute top-4 right-5 font-serif text-5xl font-black
                                  text-white/[0.03] select-none leading-none">
                  {val.step}
                </span>

                {/* Icon */}
                <div className="w-11 h-11 bg-fuchsiusOrange/10 border border-fuchsiusOrange/20
                                flex items-center justify-center mb-5
                                group-hover:bg-fuchsiusOrange/20 transition-colors duration-300">
                  <val.icon className="w-5 h-5 text-fuchsiusOrange" />
                </div>

                {/* Step label */}
                <p className="text-fuchsiusOrange text-[9px] font-black tracking-[0.3em] uppercase mb-3">
                  Step {val.step}
                </p>

                <h3 className="font-serif text-fuchsiusWhite text-lg font-bold leading-tight mb-3">
                  {val.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {val.desc}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-fuchsiusOrange/0
                                group-hover:bg-fuchsiusOrange/50 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          5 · MASTERS OF THE FLAME — Chefs
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#000000] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_20%_50%,rgba(236,111,0,0.05)_0%,transparent_70%)]" />

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <SectionPill label="Masters of the Flame" />
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-fuchsiusWhite">
                Executive
                <span className="block text-fuchsiusOrange italic mt-1">Culinary Team</span>
              </h2>
            </div>
            <Link
              to="/chefs"
              className="self-start md:self-end inline-flex items-center gap-2
                         text-fuchsiusOrange text-xs font-bold tracking-[0.15em] uppercase
                         hover:gap-3 transition-all duration-200"
            >
              All Chefs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Chef cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CHEFS.map(chef => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </div>

          {/* Quote strip */}
          <div className="mt-14 border border-white/[0.06] bg-[#0a0a0a] px-8 py-7
                          flex flex-col md:flex-row items-center gap-6">
            <Flame className="w-8 h-8 text-fuchsiusOrange fill-fuchsiusOrange shrink-0" />
            <blockquote className="font-serif text-lg md:text-xl text-fuchsiusWhite/80 italic flex-1">
              "We don't use recipes. We use memory. Every dish we serve has been
              tasted by our grandmothers first — and that's the only quality standard we trust."
            </blockquote>
            <div className="text-right shrink-0">
              <p className="text-fuchsiusWhite text-sm font-bold">Rohan Samarasinghe</p>
              <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase font-semibold mt-0.5">
                Executive Head Chef
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          6 · VISIT THE SPICE HOUSE — CTA / Location
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
                        from-transparent via-fuchsiusOrange/25 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_80%,rgba(236,111,0,0.06)_0%,transparent_70%)]" />

        <div className="max-w-7xl mx-auto relative">

          {/* Section header */}
          <div className="text-center mb-16">
            <SectionPill label="Come Visit Us" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-fuchsiusWhite">
              Visit The
              <span className="text-fuchsiusOrange italic"> Spice House</span>
            </h2>
            <p className="text-gray-600 text-sm mt-4 max-w-md mx-auto">
              Walk in or reserve — we always have a warm clay pot and a cold toddy waiting.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Left: Map placeholder + address */}
            <div className="relative bg-[#0a0a0a] border border-white/[0.07] overflow-hidden">
              {/* Map mockup (dark styled) */}
              <div className="relative h-56 bg-[#111] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Restaurant exterior"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                {/* Pin */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-fuchsiusOrange rounded-full flex items-center
                                    justify-center shadow-orange-glow border-4 border-black">
                      <MapPin className="w-5 h-5 text-black fill-black" />
                    </div>
                    <div className="w-1 h-6 bg-fuchsiusOrange mt-0" />
                  </div>
                </div>
              </div>

              {/* Address block */}
              <div className="p-7">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-9 h-9 bg-fuchsiusOrange/10 border border-fuchsiusOrange/20
                                  flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-fuchsiusOrange" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
                      Address
                    </p>
                    <p className="text-fuchsiusWhite font-semibold text-sm leading-relaxed">
                      201 Muhandiram's Road,<br />Kollupitiya, Colombo 03
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-5">
                  <div className="w-9 h-9 bg-fuchsiusOrange/10 border border-fuchsiusOrange/20
                                  flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-fuchsiusOrange" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
                      Reservations
                    </p>
                    <p className="text-fuchsiusWhite font-semibold text-sm">+94 11 234 5678</p>
                    <p className="text-gray-500 text-xs mt-0.5">WhatsApp bookings available</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-fuchsiusOrange/10 border border-fuchsiusOrange/20
                                  flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-fuchsiusOrange" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
                      Opening Hours
                    </p>
                    <div className="space-y-0.5">
                      {[
                        { days: 'Mon – Fri', hours: '11:00 AM – 10:30 PM' },
                        { days: 'Saturday', hours: '10:00 AM – 11:00 PM' },
                        { days: 'Sunday',   hours: '09:00 AM – 10:00 PM' },
                      ].map(h => (
                        <div key={h.days} className="flex justify-between gap-6">
                          <span className="text-gray-500 text-xs">{h.days}</span>
                          <span className="text-fuchsiusWhite text-xs font-semibold">{h.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Reservation / CTA card */}
            <div className="bg-[#0a0a0a] border border-white/[0.07] p-8 md:p-10 flex flex-col">
              <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.3em] uppercase mb-4">
                Reserve Your Hearth
              </p>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-fuchsiusWhite mb-3 leading-tight">
                Book a Table,<br />
                <span className="italic text-fuchsiusOrange">Feel the Warmth</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                Every table at PRANEETHA is a front-row seat to the theatre of
                the hearth. Smell the coconut embers. Hear the clay pot simmer.
                Reserve now to secure your place at the feast.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: UtensilsCrossed, label: 'Clay Pot Service' },
                  { icon: Users,           label: 'Private Dining' },
                  { icon: Star,            label: 'Chef\'s Table' },
                  { icon: Flame,           label: 'Live Hearth View' },
                ].map(item => (
                  <div key={item.label}
                    className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06]
                               px-3.5 py-3">
                    <item.icon className="w-4 h-4 text-fuchsiusOrange shrink-0" />
                    <span className="text-gray-400 text-xs font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  to="/contact"
                  className="w-full bg-fuchsiusOrange text-black font-black text-sm
                             tracking-[0.18em] uppercase py-4 text-center
                             hover:bg-orange-500 transition-colors duration-300
                             flex items-center justify-center gap-2.5"
                >
                  <Phone className="w-4 h-4" />
                  Reserve a Table
                </Link>
                <Link
                  to="/menu"
                  className="w-full border border-white/15 text-gray-400 font-semibold text-sm
                             tracking-[0.12em] uppercase py-4 text-center
                             hover:border-fuchsiusOrange/50 hover:text-fuchsiusOrange
                             transition-colors duration-300
                             flex items-center justify-center gap-2.5"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Order Online Instead
                </Link>
              </div>
            </div>
          </div>

          {/* Trust badges strip */}
          <div className="mt-8 border border-white/[0.05] bg-[#0a0a0a]
                          flex flex-wrap items-center justify-center gap-6 md:gap-12 px-8 py-5">
            {[
              { icon: Award,       label: 'Sri Lanka Restaurant Award 2023' },
              { icon: Star,        label: 'Rated #1 in Colombo — TripAdvisor' },
              { icon: ShieldCheck, label: '100% Halal Certified' },
              { icon: Leaf,        label: 'Farm-to-Table Sourcing' },
            ].map(badge => (
              <div key={badge.label} className="flex items-center gap-2.5">
                <badge.icon className="w-4 h-4 text-fuchsiusOrange shrink-0" />
                <span className="text-gray-500 text-[11px] font-semibold">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
