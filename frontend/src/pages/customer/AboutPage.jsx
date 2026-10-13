<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  MotionConfig,
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { FaFire, FaUtensils, FaMortarPestle } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Navbar from "../../components/layout/Navbar"; // adjust file names to match your layout folder
import Footer from "../../components/layout/Footer";

/* ---------- shared styles & helpers ---------- */
const display = "font-['Playfair_Display',serif]";
const accent = "text-[#e8751a]";

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

/* ---------- content (replace image paths with your exported Figma images) ---------- */
const stats = [
  { to: 130, suffix: "+", label: "YEARS OF GENERATIONAL RECIPES" },
  { to: 100, suffix: "%", label: "AUTHENTIC EARTHEN COOKWARE" },
  { to: 0, suffix: "g", label: "ARTIFICIAL ADDITIVES OR GAS" },
];

const pillars = [
  {
    Icon: FaFire,
    title: "Wood-Fired Embers",
    tag: "INCANDESCENT THERMAL PRECISION",
    text: "Seasoned Ceylon ironwood and tamarind root coals burn steadily at 420°C without flare-ups, caramelizing coconut creams and releasing delicate resinous woodsmoke into slow-simmering dishes.",
  },
  {
    Icon: FaUtensils,
    title: "Earthen Clay Cookware",
    tag: "POROUS KELANI SILT VESSELS",
    text: "Unfinished, mineral-rich river silt clay pots retain gentle heat distribution, naturally neutralizing sharp spice acidity and imparting an unmistakable earthy sweetness to each curry reduction.",
  },
  {
    Icon: FaMortarPestle,
    title: "Hand-Ground Spice Blends",
    tag: "ANCESTRAL MILESTONE GRINDING",
    text: "Sun-dried Ceylon cinnamon quills, wild kochchi chilies, roasted coriander, and sun-cured goraka paste stone-ground daily at dawn to preserve the delicate volatile essential oils.",
  },
];

const masters = [
  {
    name: "Chef Mahinda Rajapakse",
    role: "Master of the Sacred Hearth & Co-Founder",
    text: "Trained from age twelve under Galle village elders, Mahinda orchestrates the precise temperature calibration of unglazed clay pots over ironwood embers.",
    image: "/images/dishes/chef-mahinda.jpg",
  },
  {
    name: "Chef Asanka Senanayake",
    role: "Executive Spice Master & Head of Degustation",
    text: "Renowned for his mastery over sun-dried spice balances and raw coconut husk flash searing, creating multi-layered umami notes in high-heat earthen pottery.",
    image: "/images/dishes/chef-asanka.jpg",
  },
];

/* ---------- small components ---------- */
function CountUp({ to, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);

  useEffect(() => {
    if (!inView || reduceMotion) {
      if (reduceMotion) setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <motion.div {...reveal()} className="mx-auto mb-12 max-w-xl text-center">
      <h2 className={`${display} mb-3 text-2xl font-semibold tracking-wide text-stone-100 md:text-3xl`}>
        {title}
      </h2>
      <p className="text-[11px] leading-relaxed text-stone-400">{subtitle}</p>
    </motion.div>
  );
}

/* ---------- sections ---------- */
function Hero() {
  const lines = [
    { text: "BORN IN FIRE,", className: "text-stone-100" },
    {
      text: "ROOTED IN HERITAGE",
      className: "bg-gradient-to-b from-[#f5a25d] to-[#e8751a] bg-clip-text text-transparent",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0d0d0d] px-6 pb-28 pt-32 text-center md:px-12">
      {/* ember glow behind the headline, the one ambient motion on this page */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(232,117,26,0.22),transparent_65%)]"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-3xl">
        <h1 className={`${display} text-4xl font-bold leading-tight md:text-6xl`}>
          {lines.map((line, i) => (
            <span key={line.text} className="block overflow-hidden pb-2">
              <motion.span
                className={`block ${line.className}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto mt-6 max-w-lg text-[12px] leading-relaxed text-stone-400"
        >
          Preserving generational village recipes cooked over open wood-fire embers and
          authentic earthen clay pots in the deep coastal heartlands of Ceylon.
        </motion.p>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="bg-[#121212] px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <motion.figure
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group aspect-[4/5] overflow-hidden rounded-sm bg-gradient-to-br from-stone-800 to-stone-950"
        >
          <img
            src="/images/dishes/clay-pot-cooking.jpg"
            alt="A village cook preparing curry in a clay pot over open embers"
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <h2 className={`${display} mb-4 text-2xl font-semibold leading-snug text-stone-100`}>
            Crafting Timeless Flavors Through Earthen Clay Pots
          </h2>
          <p className="mb-6 text-[12px] leading-relaxed text-stone-400">
            At Praneetha, every meal tells a story of tradition, patience, and authentic
            spice blends passed down through generations. Cooked exclusively in porous
            unglazed clay vessels over seasoned Ceylon ironwood and tamarind coals, our
            recipes honor ancestral island gastronomy that modern stainless steel and gas
            burners can never replicate.
          </p>

          <div className="mb-6 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-sm bg-white/[0.04] p-4">
                <p className={`${display} text-3xl ${accent}`}>
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[8px] leading-snug tracking-[0.1em] text-stone-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <blockquote className="rounded-sm bg-white/[0.04] p-5">
            <p className={`${display} mb-2 text-[13px] italic leading-relaxed text-stone-200`}>
              “The clay breathes mineral sweetness into the curry, while the embers infuse
              primordial smoke.”
            </p>
            <footer className={`text-[9px] tracking-[0.1em] ${accent}`}>
              — MASTER POTTER DHARMADASA, KELANI VALLEY GUILD
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="bg-[#0d0d0d] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="OUR CULINARY PILLARS"
          subtitle="Three indispensable disciplines that converge inside our Galle sanctuary to ignite uncompromising flavor memory."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map(({ Icon, title, tag, text }, i) => (
            <motion.article
              key={title}
              {...reveal(i * 0.12)}
              whileHover={{ y: -6 }}
              className="rounded-sm bg-white/[0.04] p-6"
            >
              <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-[#e8751a]/15 text-[#e8751a]">
                <Icon size={14} />
              </span>
              <h3 className={`${display} mb-1 text-lg text-stone-100`}>{title}</h3>
              <p className={`mb-3 text-[8px] font-semibold tracking-[0.12em] ${accent}`}>{tag}</p>
              <p className="text-[11px] leading-relaxed text-stone-400">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Masters() {
  return (
    <section className="bg-[#121212] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="THE MASTERS BEHIND THE FLAMES"
          subtitle="Custodians of ancestral recipes, ironwood hearths, and volcanic spice alchemy."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {masters.map((m, i) => (
            <motion.article
              key={m.name}
              {...reveal(i * 0.15)}
              className="group grid overflow-hidden rounded-sm bg-white/[0.04] sm:grid-cols-[1fr_1fr]"
            >
              <div className="h-64 overflow-hidden bg-gradient-to-br from-stone-800 to-stone-950 sm:h-auto">
                <img
                  src={m.image}
                  alt={m.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-5">
                <h3 className={`${display} mb-1 text-lg leading-snug text-stone-100`}>{m.name}</h3>
                <p className={`mb-3 text-[9px] font-semibold ${accent}`}>{m.role}</p>
                <p className="text-[11px] leading-relaxed text-stone-400">{m.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="bg-[#0d0d0d] px-6 py-24 md:px-12">
      <motion.div
        {...reveal()}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-md bg-[#161616] px-8 py-12 md:px-12"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(ellipse_at_right,rgba(232,117,26,0.25),transparent_70%)]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <h2 className={`${display} mb-3 text-2xl font-semibold leading-snug text-stone-100 md:text-3xl`}>
              Taste the Authentic Wood-Fired Heritage Today
            </h2>
            <p className="text-[11px] leading-relaxed text-stone-400">
              Tables at our four ironwood hearth pits are reserved by pre-allocation for the
              Sundown and Nightfire seatings. Early booking strongly recommended.
            </p>
          </div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-sm bg-[#e8751a] px-6 py-3 text-[10px] font-semibold tracking-[0.15em] text-stone-950 hover:bg-[#ff8a2e]"
            >
              EXPLORE OUR MENU <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- page ---------- */
export default function AboutPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#0d0d0d] font-sans text-stone-300">
        <Navbar />
        <main>
          <Hero />
          <Story />
          <Pillars />
          <Masters />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
=======
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
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
