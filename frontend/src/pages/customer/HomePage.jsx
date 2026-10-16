import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, Flame, Clock, MapPin, Phone,
  ChevronLeft, ChevronRight, Leaf, Zap, Heart,
  Award, UtensilsCrossed, Users, ShieldCheck, Sparkles
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SIGNATURE_DISHES = [
  {
    id: 1,
    tag: "CHEF'S SIGNATURE",
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

// ─── 3D Realtime Fire Embers Canvas ───────────────────────────────────────────
function EmberCanvas3D({ count = 55, intensity = 1.0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Particles with x, y, z coordinates
    const particles = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * width * 1.2,
      y: Math.random() * height,
      z: Math.random() * 800 + 100, // 3D depth
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.5 + 0.6) * intensity,
      size: Math.random() * 2.8 + 1.2,
      hue: Math.random() > 0.3 ? 24 : 14, // Vibrant Orange (24) or Deep Red Ember (14)
      brightness: Math.random() * 30 + 60,
      alpha: Math.random() * 0.7 + 0.3,
      decay: Math.random() * 0.003 + 0.001,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04,
    }));

    const focalLength = 400;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y += p.vy;
        p.x += p.vx + Math.sin(p.angle) * 0.4;
        p.angle += p.spin;
        p.alpha -= p.decay;

        // Reset particle if it drifts off top or fades
        if (p.y < -50 || p.alpha <= 0) {
          p.x = (Math.random() - 0.5) * width * 1.2;
          p.y = height + 20;
          p.z = Math.random() * 800 + 100;
          p.alpha = Math.random() * 0.7 + 0.3;
          p.vy = -(Math.random() * 1.5 + 0.6) * intensity;
        }

        // 3D Perspective Projection
        const scale = focalLength / (focalLength + p.z);
        const projX = cx + p.x * scale;
        const projY = p.y * scale + (height - cy * scale) * 0.5;
        const radius = p.size * scale;

        if (projX < -50 || projX > width + 50 || projY < -50 || projY > height + 50) continue;

        ctx.save();
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(0.5, radius), 0, Math.PI * 2);

        // 3D glowing ember gradient
        const grad = ctx.createRadialGradient(projX, projY, 0, projX, projY, radius * 2.2);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`);
        grad.addColorStop(0.5, `hsla(${p.hue}, 95%, 50%, ${p.alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${p.hue}, 90%, 40%, 0)`);

        ctx.fillStyle = grad;
        ctx.shadowColor = '#ec6f00';
        ctx.shadowBlur = radius * 4;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}

// ─── 3D Interactive Tilt Card Component ───────────────────────────────────────
function TiltCard3D({ children, className = '', maxTilt = 10, glareEnabled = true }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
  });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`,
      transition: 'transform 0.1s cubic-bezier(0.2, 0, 0, 1)',
    });

    if (glareEnabled) {
      setGlare({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.16,
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
    });
    setGlare(g => ({ ...g, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {glareEnabled && (
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle 300px at ${glare.x}% ${glare.y}%, rgba(236,111,0,${glare.opacity}), transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}

// ─── Floating 3D Spice Badge with Mouse Parallax ──────────────────────────────
function SpiceBadge3D({ label, emoji, style, mouseX, mouseY, depth = 35 }) {
  const offsetX = (mouseX - 0.5) * depth;
  const offsetY = (mouseY - 0.5) * depth;

  return (
    <div
      style={{
        ...style,
        transform: `translate3d(${offsetX}px, ${offsetY}px, ${depth}px) rotateX(${-offsetY * 0.25}deg) rotateY(${offsetX * 0.25}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)',
      }}
      className="absolute hidden lg:flex items-center gap-2.5 bg-black/80 border border-fuchsiusOrange/30
                 backdrop-blur-md px-3.5 py-2.5 rounded-full text-xs font-semibold
                 text-fuchsiusWhite shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_15px_rgba(236,111,0,0.2)]
                 select-none z-20 hover:border-fuchsiusOrange transition-all duration-300"
    >
      <span className="text-lg drop-shadow-[0_2px_8px_rgba(236,111,0,0.5)]">{emoji}</span>
      <span className="tracking-wide font-sans text-gray-200">{label}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-fuchsiusOrange animate-pulse" />
    </div>
  );
}

// ─── Section label pill ───────────────────────────────────────────────────────
function SectionPill({ label }) {
  return (
    <div className="inline-flex items-center gap-2 bg-fuchsiusOrange/10 border border-fuchsiusOrange/30
                    text-fuchsiusOrange text-[10px] font-bold tracking-[0.25em] uppercase
                    px-4 py-1.5 mb-5 shadow-[0_0_15px_rgba(236,111,0,0.15)]">
      <Flame className="w-3 h-3 fill-fuchsiusOrange animate-pulse" />
      {label}
    </div>
  );
}

// ─── 3D Dish Card ─────────────────────────────────────────────────────────────
function DishCard({ dish }) {
  return (
    <TiltCard3D maxTilt={9} className="group flex flex-col bg-[#0a0a0a] border border-white/[0.08] hover:border-fuchsiusOrange/50 transition-colors duration-500 overflow-hidden shadow-2xl">
      {/* 3D Image Layer */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />

        {/* 3D Floating Badge */}
        <span
          style={{ transform: 'translateZ(25px)' }}
          className={`absolute top-3 left-3 text-[9px] font-black tracking-[0.2em] px-2.5 py-1 shadow-lg ${dish.badgeColor}`}
        >
          {dish.badge}
        </span>

        {/* 3D Floating Price Tag */}
        <div
          style={{ transform: 'translateZ(30px)' }}
          className="absolute bottom-3 right-3 bg-black/90 border border-fuchsiusOrange/70 px-3 py-1 text-fuchsiusOrange font-bold text-sm backdrop-blur-md shadow-[0_4px_15px_rgba(236,111,0,0.3)]"
        >
          {dish.price}
        </div>
      </div>

      {/* Body Layer */}
      <div className="flex flex-col flex-1 p-5" style={{ transform: 'translateZ(15px)' }}>
        <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
          {dish.tag}
        </p>
        <h3 className="font-serif text-fuchsiusWhite text-xl font-bold leading-tight mb-0.5 group-hover:text-fuchsiusOrange transition-colors duration-300">
          {dish.name}
        </h3>
        <p className="text-gray-600 text-[9px] tracking-[0.2em] uppercase font-semibold mb-3">
          {dish.subtitle}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(dish.rating)
                  ? 'fill-fuchsiusOrange text-fuchsiusOrange'
                  : 'text-gray-700'
              }`}
            />
          ))}
          <span className="text-gray-500 text-xs ml-1">{dish.rating} ({dish.reviews})</span>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-5">
          {dish.desc}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto" style={{ transform: 'translateZ(20px)' }}>
          <Link
            to="/menu"
            className="flex-1 bg-fuchsiusOrange text-black text-xs font-black
                       tracking-[0.14em] uppercase py-2.5 text-center
                       hover:bg-orange-500 transition-colors duration-200 shadow-md"
          >
            Order Dish
          </Link>
          <Link
            to="/menu"
            className="px-4 border border-white/15 text-gray-400 text-xs font-semibold
                       hover:border-fuchsiusOrange/50 hover:text-fuchsiusOrange
                       transition-colors duration-200 flex items-center justify-center"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </TiltCard3D>
  );
}

// ─── 3D Chef Card ─────────────────────────────────────────────────────────────
function ChefCard({ chef }) {
  return (
    <TiltCard3D maxTilt={8} className="group relative overflow-hidden bg-[#0a0a0a] border border-white/[0.08] hover:border-fuchsiusOrange/40 transition-all duration-500 shadow-2xl">
      {/* Photo */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={chef.image}
          alt={chef.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* 3D Floating Awards badge */}
        <div
          style={{ transform: 'translateZ(30px)' }}
          className="absolute top-3 right-3 flex items-center gap-1.5 bg-fuchsiusOrange px-2.5 py-1 text-black text-[9px] font-black tracking-[0.15em] shadow-[0_4px_15px_rgba(236,111,0,0.5)]"
        >
          <Award className="w-3 h-3" />
          {chef.awards}x AWARD
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5" style={{ transform: 'translateZ(20px)' }}>
          <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.3em] uppercase mb-1">
            {chef.role}
          </p>
          <h3 className="font-serif text-fuchsiusWhite text-xl font-bold">{chef.name}</h3>
          <p className="text-gray-400 text-[10px] tracking-[0.15em] font-semibold uppercase mt-0.5">
            {chef.years}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 border-t border-white/[0.06]" style={{ transform: 'translateZ(10px)' }}>
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
    </TiltCard3D>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef(null);

  // Mouse Parallax coordinates (normalized 0 to 1)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  // Auto-advance carousel every 5s
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
    <div className="min-h-screen flex flex-col bg-fuchsiusBlack selection:bg-fuchsiusOrange selection:text-black">
      <Navbar />

      {/* ════════════════════════════════════════════════════════════════════
          1 · HERO WITH 3D INTERACTIVE PERSPECTIVE & REALTIME EMBERS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative flex items-center justify-center min-h-screen overflow-hidden pt-16 perspective-[1200px]"
      >
        {/* Realtime 3D Embers Canvas */}
        <EmberCanvas3D count={65} intensity={1.2} />

        {/* Layered dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0300] via-[#020202] to-[#000000]" />

        {/* Cinematic radial orange bloom that moves with mouse */}
        <div
          className="absolute inset-0 transition-transform duration-300 pointer-events-none"
          style={{
            transform: `translate3d(${(mousePos.x - 0.5) * 40}px, ${(mousePos.y - 0.5) * 40}px, 0)`,
            backgroundImage: `radial-gradient(ellipse 70% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(236,111,0,0.18) 0%, transparent 70%)`,
          }}
        />

        {/* 3D Depth Rings in Background */}
        <div
          className="absolute w-[680px] h-[680px] rounded-full border border-fuchsiusOrange/10 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate(-50%, -50%) rotateX(${(mousePos.y - 0.5) * 20}deg) rotateY(${(mousePos.x - 0.5) * -20}deg)`,
            top: '50%',
            left: '50%',
          }}
        />
        <div
          className="absolute w-[920px] h-[920px] rounded-full border border-dashed border-fuchsiusOrange/5 pointer-events-none transition-transform duration-1000 ease-out animate-spin"
          style={{
            animationDuration: '60s',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Floating 3D Spice Badges with Parallax */}
        <SpiceBadge3D label="Red Parboiled Rice" emoji="🍚" style={{ top: '22%', left: '7%' }} mouseX={mousePos.x} mouseY={mousePos.y} depth={45} />
        <SpiceBadge3D label="Devilled Chicken" emoji="🍗" style={{ top: '38%', left: '5%' }} mouseX={mousePos.x} mouseY={mousePos.y} depth={60} />
        <SpiceBadge3D label="Pol Sambol" emoji="🥥" style={{ top: '64%', left: '8%' }} mouseX={mousePos.x} mouseY={mousePos.y} depth={35} />
        <SpiceBadge3D label="Dhal Curry" emoji="🫘" style={{ top: '20%', right: '7%' }} mouseX={mousePos.x} mouseY={mousePos.y} depth={50} />
        <SpiceBadge3D label="Ceylon Cinnamon" emoji="🌿" style={{ top: '44%', right: '5%' }} mouseX={mousePos.x} mouseY={mousePos.y} depth={65} />
        <SpiceBadge3D label="Goraka Hearth Spice" emoji="🌶️" style={{ top: '68%', right: '8%' }} mouseX={mousePos.x} mouseY={mousePos.y} depth={40} />

        {/* Hero Central 3D Content */}
        <div
          className="relative text-center px-6 max-w-5xl mx-auto z-20 transition-transform duration-200 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${(mousePos.y - 0.5) * -8}deg) rotateY(${(mousePos.x - 0.5) * 8}deg) translateZ(20px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Brand pill */}
          <div
            style={{ transform: 'translateZ(30px)' }}
            className="inline-flex items-center gap-2.5 border border-fuchsiusOrange/40
                            bg-fuchsiusOrange/10 backdrop-blur-md
                            text-fuchsiusOrange text-[10px] font-bold tracking-[0.3em] uppercase
                            px-5 py-2 mb-8 shadow-[0_0_20px_rgba(236,111,0,0.25)]"
          >
            <Flame className="w-3.5 h-3.5 fill-fuchsiusOrange animate-pulse" />
            Ceylon Hearth · Est. 1987 · Kollupitiya
          </div>

          {/* Main 3D Headline */}
          <h1
            style={{ transform: 'translateZ(40px)' }}
            className="font-serif font-bold text-fuchsiusWhite leading-[1.05] mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
          >
            <span className="block text-4xl md:text-6xl lg:text-7xl tracking-tight">
              Authentic Clay Pot
            </span>
            <span
              className="block text-5xl md:text-7xl lg:text-8xl text-fuchsiusOrange
                               italic tracking-tight mt-1 drop-shadow-[0_4px_25px_rgba(236,111,0,0.6)]"
            >
              &amp; Hearth Cooking
            </span>
            <span className="block text-3xl md:text-5xl lg:text-6xl tracking-tight mt-2 text-fuchsiusWhite/90">
              of Ceylon
            </span>
          </h1>

          {/* Divider line */}
          <div className="flex items-center justify-center gap-4 mb-6" style={{ transform: 'translateZ(25px)' }}>
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-fuchsiusOrange/70" />
            <div className="w-8 h-8 rounded-full bg-fuchsiusOrange/10 border border-fuchsiusOrange/30 flex items-center justify-center shadow-[0_0_15px_rgba(236,111,0,0.3)]">
              <Flame className="w-4 h-4 text-fuchsiusOrange fill-fuchsiusOrange animate-bounce" />
            </div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-fuchsiusOrange/70" />
          </div>

          <p
            style={{ transform: 'translateZ(20px)' }}
            className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Forged by four generations of village tradition. Every dish is
            simmered in authentic clay pots over coconut shell embers — the way
            grandmother always intended.
          </p>

          {/* 3D Interactive CTA Buttons */}
          <div
            style={{ transform: 'translateZ(45px)' }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/menu"
              className="group relative inline-flex items-center justify-center gap-2.5
                         bg-fuchsiusOrange text-black font-black text-sm
                         tracking-[0.18em] uppercase px-8 py-4
                         hover:bg-orange-500 transition-all duration-300
                         shadow-[0_10px_30px_rgba(236,111,0,0.4)] hover:shadow-[0_15px_40px_rgba(236,111,0,0.6)]
                         hover:-translate-y-1 active:translate-y-0"
            >
              <UtensilsCrossed className="w-4 h-4 transition-transform group-hover:rotate-12" />
              Explore Our Menu
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2.5
                         border border-white/20 text-fuchsiusWhite font-semibold text-sm
                         tracking-[0.12em] uppercase px-8 py-4
                         hover:border-fuchsiusOrange/70 hover:text-fuchsiusOrange
                         transition-all duration-300 backdrop-blur-md
                         hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:-translate-y-1 active:translate-y-0"
            >
              Reserve a Table
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 3D Stats Row */}
          <div
            style={{ transform: 'translateZ(25px)' }}
            className="flex items-center justify-center gap-8 md:gap-16 mt-16 border-t border-white/[0.08] pt-8"
          >
            {[
              { value: '37+', label: 'Years of Heritage' },
              { value: '120+', label: 'Authentic Recipes' },
              { value: '4.9★', label: 'Customer Rating' },
              { value: '50K+', label: 'Happy Diners' },
            ].map(stat => (
              <div key={stat.label} className="text-center group cursor-default">
                <p className="font-serif text-fuchsiusOrange text-2xl md:text-3xl font-bold group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_10px_rgba(236,111,0,0.4)]">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase font-semibold mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator with 3D bounce */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce pointer-events-none z-20">
          <div className="w-px h-10 bg-gradient-to-b from-fuchsiusOrange to-transparent" />
          <p className="text-gray-600 text-[9px] tracking-[0.3em] uppercase font-bold">Scroll Down</p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          2 · SIGNATURE DISHES — 3D CAROUSEL + 3D TILT GRID
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#000000] relative overflow-hidden">
        {/* Top dividing glowing ember border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsiusOrange/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(236,111,0,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
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
              <div className="flex gap-2">
                {SIGNATURE_DISHES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${
                      i === activeSlide
                        ? 'w-10 bg-fuchsiusOrange shadow-[0_0_10px_rgba(236,111,0,0.6)]'
                        : 'w-3 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              {/* Prev / Next buttons */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 border border-white/15 flex items-center justify-center
                             text-gray-400 hover:border-fuchsiusOrange hover:text-fuchsiusOrange hover:bg-fuchsiusOrange/10
                             transition-all duration-200 active:scale-95 shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 border border-white/15 flex items-center justify-center
                             text-gray-400 hover:border-fuchsiusOrange hover:text-fuchsiusOrange hover:bg-fuchsiusOrange/10
                             transition-all duration-200 active:scale-95 shadow-md"
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

          {/* Featured Large 3D Carousel Spotlight Card */}
          <div className="relative mb-12 overflow-hidden perspective-[1000px]">
            {SIGNATURE_DISHES.map((dish, i) => (
              <div
                key={dish.id}
                className={`transition-all duration-700 ease-out ${
                  i === activeSlide
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 absolute inset-0 pointer-events-none scale-95'
                }`}
              >
                <TiltCard3D maxTilt={6} className="grid md:grid-cols-2 gap-0 bg-[#0a0a0a] border border-white/[0.09] hover:border-fuchsiusOrange/40 transition-colors duration-500 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
                  {/* Image side */}
                  <div className="relative h-72 md:h-[440px] overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a] hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent md:hidden" />
                    <span
                      style={{ transform: 'translateZ(30px)' }}
                      className={`absolute top-4 left-4 text-[9px] font-black tracking-[0.2em] px-3 py-1.5 shadow-lg ${dish.badgeColor}`}
                    >
                      {dish.badge}
                    </span>
                  </div>

                  {/* Text side */}
                  <div className="flex flex-col justify-center p-8 md:p-12" style={{ transform: 'translateZ(20px)' }}>
                    <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      {dish.tag}
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-fuchsiusWhite leading-tight mb-1">
                      {dish.name}
                    </h3>
                    <p className="text-gray-500 text-[9px] tracking-[0.25em] uppercase font-bold mb-4">
                      {dish.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mb-5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-3.5 h-3.5 ${
                            j < Math.floor(dish.rating)
                              ? 'fill-fuchsiusOrange text-fuchsiusOrange'
                              : 'text-gray-700'
                          }`}
                        />
                      ))}
                      <span className="text-gray-400 text-xs font-medium">
                        {dish.rating} · ({dish.reviews} verified reviews)
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-8">{dish.desc}</p>

                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-gray-600 text-[9px] tracking-[0.2em] uppercase font-bold">Price</p>
                        <p className="text-fuchsiusOrange font-bold text-2xl mt-0.5">{dish.price}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to="/menu"
                        className="flex-1 bg-fuchsiusOrange text-black font-black text-xs
                                   tracking-[0.18em] uppercase py-3.5 text-center
                                   hover:bg-orange-500 transition-colors duration-200 shadow-md"
                      >
                        Order Dish
                      </Link>
                      <Link
                        to="/menu"
                        className="px-5 border border-white/15 text-gray-300 text-xs font-semibold
                                   hover:border-fuchsiusOrange hover:text-fuchsiusOrange
                                   tracking-[0.12em] uppercase transition-colors duration-200
                                   flex items-center gap-2"
                      >
                        Explore Menu <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </TiltCard3D>
              </div>
            ))}
          </div>

          {/* 4-card 3D Tilt Grid below */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SIGNATURE_DISHES.map(dish => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          3 · "BORN IN FIRE" Brand Story with 3D Depth & Embers
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-0 overflow-hidden">
        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
            alt="Kitchen preparation"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.1]"
          />

          {/* 3D Embers rising from hearth */}
          <EmberCanvas3D count={45} intensity={0.9} />

          {/* Deep dark cinematic gradients */}
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(236,111,0,0.12)_0%,transparent_75%)]" />

          {/* Top & Bottom 3D illuminated borders */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsiusOrange/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsiusOrange/50 to-transparent" />

          {/* Central 3D Content */}
          <div className="relative flex flex-col items-center justify-center text-center px-6 z-20 max-w-4xl">
            <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.5em] uppercase mb-4 shadow-[0_0_15px_rgba(236,111,0,0.3)]">
              Our Story · Our Legacy
            </p>

            <h2 className="font-serif font-bold text-fuchsiusWhite leading-none mb-6 select-none">
              <span className="block text-5xl md:text-7xl lg:text-8xl tracking-tight text-white/95">
                BORN IN
              </span>
              <span
                className="block text-6xl md:text-8xl lg:text-9xl text-fuchsiusOrange italic"
                style={{
                  textShadow:
                    '0 1px 0 #ec6f00, 0 2px 0 #cc5800, 0 3px 0 #aa4500, 0 8px 30px rgba(236,111,0,0.6)',
                }}
              >
                FIRE
              </span>
            </h2>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-20 bg-fuchsiusOrange/50" />
              <div className="w-9 h-9 rounded-full bg-fuchsiusOrange/10 border border-fuchsiusOrange/40 flex items-center justify-center shadow-[0_0_20px_rgba(236,111,0,0.4)]">
                <Flame className="w-5 h-5 text-fuchsiusOrange fill-fuchsiusOrange animate-pulse" />
              </div>
              <div className="h-px w-20 bg-fuchsiusOrange/50" />
            </div>

            <p className="text-gray-200 text-base md:text-xl max-w-2xl leading-relaxed font-light mb-3">
              Forged by generations of village tradition.
            </p>
            <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
              Simmered in authentic clay pots over coconut shell embers —
              a ritual passed from grandmother to grandmother since 1987.
              This is not just food. This is memory on a plate.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 border border-fuchsiusOrange
                           text-fuchsiusOrange font-bold text-xs tracking-[0.2em] uppercase
                           px-8 py-3.5 hover:bg-fuchsiusOrange hover:text-black
                           transition-all duration-300 shadow-[0_0_20px_rgba(236,111,0,0.2)] hover:shadow-[0_0_30px_rgba(236,111,0,0.5)]"
              >
                Our Full Story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/chefs"
                className="inline-flex items-center gap-2.5 border border-white/20
                           text-gray-300 font-semibold text-xs tracking-[0.15em] uppercase
                           px-8 py-3.5 hover:border-white/40 hover:text-white
                           transition-all duration-300 backdrop-blur-sm"
              >
                Meet the Chefs <Users className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          4 · PILLARS OF THE KITCHEN — 3D Glassmorphic Cards
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#040404] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsiusOrange/20 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionPill label="What We Stand For" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-fuchsiusWhite">
              The Pillars of Our
              <span className="block text-fuchsiusOrange italic mt-1">Kitchen</span>
            </h2>
            <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
              Four commitments we make to every guest, every service, every single day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map(val => (
              <TiltCard3D
                key={val.step}
                maxTilt={12}
                className="bg-[#090909] border border-white/[0.07] hover:border-fuchsiusOrange/40 p-7 transition-all duration-500 shadow-xl overflow-hidden"
              >
                {/* 3D Watermark number floating behind */}
                <span
                  style={{ transform: 'translateZ(-10px)' }}
                  className="absolute top-3 right-4 font-serif text-6xl font-black text-white/[0.03] select-none leading-none pointer-events-none"
                >
                  {val.step}
                </span>

                {/* 3D Icon */}
                <div
                  style={{ transform: 'translateZ(30px)' }}
                  className="w-12 h-12 bg-fuchsiusOrange/10 border border-fuchsiusOrange/25
                             flex items-center justify-center mb-6 shadow-[0_4px_15px_rgba(236,111,0,0.15)]"
                >
                  <val.icon className="w-5 h-5 text-fuchsiusOrange" />
                </div>

                <div style={{ transform: 'translateZ(20px)' }}>
                  <p className="text-fuchsiusOrange text-[9px] font-black tracking-[0.3em] uppercase mb-2">
                    Step {val.step}
                  </p>
                  <h3 className="font-serif text-fuchsiusWhite text-lg font-bold leading-tight mb-3">
                    {val.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {val.desc}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-fuchsiusOrange/40 to-transparent" />
              </TiltCard3D>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          5 · MASTERS OF THE FLAME — 3D Chef Cards
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#000000] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_20%_50%,rgba(236,111,0,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
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

          {/* Chef cards in 3D */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHEFS.map(chef => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </div>

          {/* 3D Quote strip */}
          <TiltCard3D
            maxTilt={4}
            className="mt-14 border border-white/[0.08] bg-[#0a0a0a] px-8 py-7
                       flex flex-col md:flex-row items-center gap-6 shadow-2xl"
          >
            <div
              style={{ transform: 'translateZ(25px)' }}
              className="w-12 h-12 rounded-full bg-fuchsiusOrange/15 border border-fuchsiusOrange/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(236,111,0,0.25)]"
            >
              <Flame className="w-6 h-6 text-fuchsiusOrange fill-fuchsiusOrange" />
            </div>
            <blockquote
              style={{ transform: 'translateZ(15px)' }}
              className="font-serif text-lg md:text-xl text-fuchsiusWhite/90 italic flex-1"
            >
              "We don't use recipes. We use memory. Every dish we serve has been
              tasted by our grandmothers first — and that's the only quality standard we trust."
            </blockquote>
            <div className="text-right shrink-0" style={{ transform: 'translateZ(20px)' }}>
              <p className="text-fuchsiusWhite text-sm font-bold">Rohan Samarasinghe</p>
              <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase font-semibold mt-0.5">
                Executive Head Chef
              </p>
            </div>
          </TiltCard3D>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          6 · VISIT THE SPICE HOUSE — 3D Location & Reservation Cards
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#040404] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsiusOrange/25 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_80%,rgba(236,111,0,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <SectionPill label="Come Visit Us" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-fuchsiusWhite">
              Visit The
              <span className="text-fuchsiusOrange italic"> Spice House</span>
            </h2>
            <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
              Walk in or reserve — we always have a warm clay pot and a cold toddy waiting.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Map + Address Card with 3D Tilt */}
            <TiltCard3D maxTilt={5} className="bg-[#0a0a0a] border border-white/[0.08] overflow-hidden shadow-2xl">
              <div className="relative h-60 bg-[#111] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Restaurant exterior"
                  className="w-full h-full object-cover opacity-40 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                {/* 3D Floating Pin */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(35px)' }}>
                  <div className="flex flex-col items-center animate-bounce">
                    <div className="w-12 h-12 bg-fuchsiusOrange rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(236,111,0,0.6)] border-4 border-black">
                      <MapPin className="w-5 h-5 text-black fill-black" />
                    </div>
                    <div className="w-1 h-5 bg-fuchsiusOrange" />
                  </div>
                </div>
              </div>

              {/* Address block */}
              <div className="p-7" style={{ transform: 'translateZ(15px)' }}>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-9 h-9 bg-fuchsiusOrange/10 border border-fuchsiusOrange/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-fuchsiusOrange" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
                      Address
                    </p>
                    <p className="text-fuchsiusWhite font-semibold text-sm leading-relaxed">
                      201 Muhandiram's Road,<br />Kollupitiya, Colombo 03
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-5">
                  <div className="w-9 h-9 bg-fuchsiusOrange/10 border border-fuchsiusOrange/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-fuchsiusOrange" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
                      Reservations
                    </p>
                    <p className="text-fuchsiusWhite font-semibold text-sm">+94 11 234 5678</p>
                    <p className="text-gray-400 text-xs mt-0.5">WhatsApp bookings available</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-fuchsiusOrange/10 border border-fuchsiusOrange/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-fuchsiusOrange" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
                      Opening Hours
                    </p>
                    <div className="space-y-1 mt-1">
                      {[
                        { days: 'Mon – Fri', hours: '11:00 AM – 10:30 PM' },
                        { days: 'Saturday', hours: '10:00 AM – 11:00 PM' },
                        { days: 'Sunday',   hours: '09:00 AM – 10:00 PM' },
                      ].map(h => (
                        <div key={h.days} className="flex justify-between gap-6">
                          <span className="text-gray-400 text-xs">{h.days}</span>
                          <span className="text-fuchsiusWhite text-xs font-semibold">{h.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard3D>

            {/* Right: Reservation / CTA Card with 3D Tilt */}
            <TiltCard3D maxTilt={5} className="bg-[#0a0a0a] border border-white/[0.08] p-8 md:p-10 flex flex-col shadow-2xl">
              <p className="text-fuchsiusOrange text-[9px] font-bold tracking-[0.3em] uppercase mb-4" style={{ transform: 'translateZ(15px)' }}>
                Reserve Your Hearth
              </p>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-fuchsiusWhite mb-3 leading-tight" style={{ transform: 'translateZ(20px)' }}>
                Book a Table,<br />
                <span className="italic text-fuchsiusOrange">Feel the Warmth</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1" style={{ transform: 'translateZ(10px)' }}>
                Every table at PRANEETHA is a front-row seat to the theatre of
                the hearth. Smell the coconut embers. Hear the clay pot simmer.
                Reserve now to secure your place at the feast.
              </p>

              {/* Highlights in 3D */}
              <div className="grid grid-cols-2 gap-3 mb-8" style={{ transform: 'translateZ(25px)' }}>
                {[
                  { icon: UtensilsCrossed, label: 'Clay Pot Service' },
                  { icon: Users,           label: 'Private Dining' },
                  { icon: Star,            label: "Chef's Table" },
                  { icon: Flame,           label: 'Live Hearth View' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.07] px-3.5 py-3 hover:border-fuchsiusOrange/30 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-fuchsiusOrange shrink-0" />
                    <span className="text-gray-300 text-xs font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3" style={{ transform: 'translateZ(30px)' }}>
                <Link
                  to="/contact"
                  className="w-full bg-fuchsiusOrange text-black font-black text-sm
                             tracking-[0.18em] uppercase py-4 text-center
                             hover:bg-orange-500 transition-all duration-300
                             flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(236,111,0,0.3)] hover:shadow-[0_6px_25px_rgba(236,111,0,0.5)]"
                >
                  <Phone className="w-4 h-4" />
                  Reserve a Table
                </Link>
                <Link
                  to="/menu"
                  className="w-full border border-white/15 text-gray-300 font-semibold text-sm
                             tracking-[0.12em] uppercase py-4 text-center
                             hover:border-fuchsiusOrange hover:text-fuchsiusOrange
                             transition-all duration-300
                             flex items-center justify-center gap-2.5"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Order Online Instead
                </Link>
              </div>
            </TiltCard3D>
          </div>

          {/* Trust badges strip */}
          <div className="mt-8 border border-white/[0.06] bg-[#0a0a0a] flex flex-wrap items-center justify-center gap-6 md:gap-12 px-8 py-5 shadow-lg">
            {[
              { icon: Award,       label: 'Sri Lanka Restaurant Award 2023' },
              { icon: Star,        label: 'Rated #1 in Colombo — TripAdvisor' },
              { icon: ShieldCheck, label: '100% Halal Certified' },
              { icon: Leaf,        label: 'Farm-to-Table Sourcing' },
            ].map(badge => (
              <div key={badge.label} className="flex items-center gap-2.5">
                <badge.icon className="w-4 h-4 text-fuchsiusOrange shrink-0" />
                <span className="text-gray-400 text-[11px] font-semibold">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
