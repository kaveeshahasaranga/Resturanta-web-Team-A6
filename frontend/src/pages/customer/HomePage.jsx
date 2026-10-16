import { useState } from "react";
import { Link } from "react-router-dom";
// import { Navigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Navbar from "../../components/layout/Navbar"; // adjust file names to match your layout folder
import Footer from "../../components/layout/Footer";
// import { useAuth } from "../../context/AuthContext";

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
const heroCards = [
  {
    title: "Wild Cinnamon & Tamarind Timber",
    text: "Cured woods gathered from Matale groves deliver resinous smoke notes and steady, incandescent thermal velocity.",
  },
  {
    title: "Kelani River Terracotta Pots",
    text: "Porous native river silts mineralize curries over twelve hours, balancing sharp sun-dried chilis with natural earth alkali.",
  },
  {
    title: "Fourteen Seated Guests Per Hearth",
    text: "Two seating cycles strictly synchronized with twilight embers and the late-night southern monsoon breeze.",
  },
];

const specialties = [
  {
    badge: "16HR REDUCTION",
    meta: "PORCINE · SPICED ASH",
    price: "LKR 6,400",
    name: "Kalu Pol Kurobuta Pork",
    text: "Toasted coconut meat ground with charred raw rice, black pepper grains, and smoked tamarind vinegar inside low-fire terracotta.",
    spice: 5,
    image: "/images/dishes/pol-pork.jpg",
  },
  {
    badge: "24 HR SIMMER",
    meta: "FOREST HARVEST · HEIRLOOM",
    price: "LKR 4,200",
    name: "Overnight Polos Ambula",
    text: "Young tender baby jackfruit braised with goraka paste until fibers dissolve like artisanal duck confit over dying palm coals.",
    spice: 3,
    image: "/images/dishes/polos-ambula.jpg",
  },
  {
    badge: "FLASH EMBER",
    meta: "INDIAN OCEAN · LINE-CAUGHT",
    price: "LKR 7,900",
    name: "Miris Glazed Jumbo Sea Prawns",
    text: "Blistered over raw coconut husks, basted in fermented kochchi chili paste and aged sweet kithul jaggery glaze.",
    spice: 4,
    image: "/images/dishes/sea-prawns.jpg",
  },
];

const testimonialsData = [
  {
    id: 1,
    initials: "MC",
    name: "Marcella Conti",
    role: "CULINARY CRITIC · LE MONDE GASTRONOMIE",
    quote:
      "There is no theatrical garnish here, only the devastating truth of burning cinnamon wood and ancient clay that turns spice into high art.",
  },
  {
    id: 2,
    initials: "TS",
    name: "Chef Toru Shishido",
    role: "THREE MICHELIN STARS · KYOTO",
    quote:
      "Eating the lagoon crab straight from the soot-blackened pot reminded me that cooking began as worship. Praneetha is unrivaled in South Asia.",
  },
  {
    id: 3,
    initials: "AR",
    name: "Aravinda Rajapakse",
    role: "EPICUREAN SOCIETY OF COLOMBO",
    quote:
      "A masterclass in restraint. The overnight polos ambula melts into something transcendent. It makes modern sous-vide look utterly soulless.",
  },
];

/* ---------- small components ---------- */
function SpiceFlames({ level, size = 10 }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Spice ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <FaFire
          key={n}
          size={size}
          className={n <= level ? "text-[#e8751a]" : "text-stone-700"}
        />
      ))}
    </span>
  );
}

function SpiceDots({ level }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.span
          key={n}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + n * 0.12, type: "spring", stiffness: 300 }}
          className={`h-2 w-2 rounded-full ${
            n <= level ? "bg-[#e8751a]" : "bg-stone-700"
          }`}
        />
      ))}
    </div>
  );
}

/* ---------- sections ---------- */
function Hero() {
  const lines = [
    { text: "PRIMITIVE FIRE.", className: "text-stone-100" },
    { text: "ANCIENT CLAY.", className: `${accent} italic font-normal` },
    { text: "UNBROKEN TASTE.", className: "text-stone-100" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0d0d0d] px-6 pb-16 pt-28 md:px-12">
      {/* HERO BACKGROUND PHOTO: put your image at public/images/hero-bg.jpg */}
      <img
        src="/images/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/70 via-transparent to-[#121212]" />

      {/* slow-breathing ember glow, the one ambient motion on the page */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(232,117,26,0.28),transparent_65%)]"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-6xl">
        <h1 className={`${display} text-4xl font-bold leading-tight md:text-6xl`}>
          {lines.map((line, i) => (
            <span key={line.text} className="block overflow-hidden pb-1">
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
        <motion.div
          className="mt-4 h-px bg-stone-600"
          initial={{ width: 0 }}
          animate={{ width: "min(26rem, 100%)" }}
          transition={{ duration: 0.9, delay: 0.9 }}
        />

        <div className="mt-24 grid gap-4 md:grid-cols-3">
          {heroCards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 + i * 0.15 }}
              className="rounded-sm bg-white/[0.03] p-5 backdrop-blur-sm"
            >
              <h3 className={`${display} mb-2 text-sm text-stone-100`}>{card.title}</h3>
              <p className="text-[11px] leading-relaxed text-stone-400">{card.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedDish() {
  return (
    <section className="bg-[#121212] px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.3fr_1fr]">
        <motion.figure
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-gradient-to-br from-stone-800 to-stone-950"
        >
          <img
            src="/images/dishes/lagoon-crab.jpg"
            alt="Batticaloa Lagoon Wild Crab"
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
            <figcaption className={`${display} text-sm text-stone-100`}>
              Batticaloa Lagoon Wild Crab
            </figcaption>
            <span className="rounded-sm bg-black/60 px-2 py-1 text-[11px] text-stone-200">
              LKR 9,800
            </span>
          </div>
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <h2 className={`${display} mb-4 text-2xl font-semibold leading-snug text-stone-100`}>
            Lagoon Crab in Charred Coconut &amp; Goraka Reduction
          </h2>
          <p className="mb-5 text-[12px] leading-relaxed text-stone-400">
            Harvested daily from the brackish depths of eastern lagoons. Braised within
            unglazed low-fired clay, infused with heirloom sun-dried black Goraka, scorched
            coconut milk, and ground Ceylon cardamom pods toasted over fragrant tamarind
            bark.
          </p>

          <div className="mb-6 space-y-4 rounded-sm bg-white/[0.04] p-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-[9px] tracking-[0.15em] text-stone-500">
                <span>SPICE INTENSITY</span>
                <span>LEVEL 4/5</span>
              </div>
              <SpiceDots level={4} />
            </div>
            <div>
              <p className="mb-1 text-[9px] tracking-[0.15em] text-stone-500">
                NATIVE ACCOUTREMENTS
              </p>
              <p className="text-[11px] text-stone-300">
                Smoked Buffalo Curd, String Hoppers of Red Kurakkan Grain, Fire-blistered
                Lime Pickle
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="block rounded-sm bg-[#e8751a] px-5 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-stone-950 hover:bg-[#ff8a2e]"
              >
                REQUEST DEGUSTATION
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/menu"
                className="flex items-center gap-2 rounded-sm bg-white/10 px-5 py-2.5 text-[10px] tracking-[0.15em] text-stone-200 hover:bg-white/15"
              >
                EXPLORE PAIRINGS <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Specialties() {
  return (
    <section className="bg-[#121212] px-6 pb-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.h2 {...reveal()} className={`${display} mb-8 text-2xl text-stone-100`}>
          Porous Clay Specialties
        </motion.h2>

        <div className="grid gap-5 md:grid-cols-3">
          {specialties.map((dish, i) => (
            <motion.article
              key={dish.name}
              {...reveal(i * 0.12)}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-sm bg-white/[0.04]"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-stone-800 to-stone-950">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute right-0 top-0 bg-black/70 px-2 py-1 text-[8px] tracking-[0.12em] text-stone-200">
                  {dish.badge}
                </span>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between text-[9px] tracking-[0.1em]">
                  <span className={accent}>{dish.meta}</span>
                  <span className="text-stone-300">{dish.price}</span>
                </div>
                <h3 className={`${display} mb-2 text-base text-stone-100`}>{dish.name}</h3>
                <p className="mb-4 text-[11px] leading-relaxed text-stone-400">{dish.text}</p>
                <div className="flex items-center gap-2 text-[9px] tracking-[0.1em] text-stone-400">
                  <SpiceFlames level={dish.spice} size={9} />
                  <span>SPICE {dish.spice}/5</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div {...reveal(0.2)} className="mt-12 text-center">
          <Link
            to="/menu"
            className={`group inline-flex items-center gap-2 text-[10px] tracking-[0.15em] ${accent}`}
          >
            VIEW COMPLETE TWELVE-COURSE HEARTH TASTING
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [items, setItems] = useState(testimonialsData);

  // Rotating the array makes the cards glide into their new positions via `layout`.
  const next = () => setItems(([first, ...rest]) => [...rest, first]);
  const prev = () => setItems((list) => [list[list.length - 1], ...list.slice(0, -1)]);

  return (
    <section className="bg-[#0d0d0d] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <motion.h2 {...reveal()} className={`${display} text-2xl text-stone-100`}>
            Witness to the Smoke
          </motion.h2>
          <div className="flex gap-2">
            {[
              { label: "Previous", onClick: prev, Icon: FiChevronLeft },
              { label: "Next", onClick: next, Icon: FiChevronRight },
            ].map(({ label, onClick, Icon }) => (
              <motion.button
                key={label}
                type="button"
                aria-label={label}
                onClick={onClick}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-stone-300 transition-colors hover:bg-[#e8751a] hover:text-stone-950"
              >
                <Icon />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <motion.blockquote
              key={t.id}
              layout
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="rounded-sm bg-white/[0.04] p-6"
            >
              <span className="mb-3 block text-2xl leading-none text-stone-600" aria-hidden="true">
                “
              </span>
              <p className={`${display} mb-6 text-[13px] italic leading-relaxed text-stone-200`}>
                “{t.quote}”
              </p>
              <footer className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-[10px] text-stone-300">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-[12px] font-medium text-stone-100">{t.name}</span>
                  <span className="block text-[8px] tracking-[0.1em] text-stone-500">{t.role}</span>
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- page ---------- */
export default function HomePage() {
  // TEMPORARY: login redirect disabled so the design can be previewed.
  // Re-enable (and uncomment the Navigate + useAuth imports) before pushing.
  // const { user, loading } = useAuth();
  // if (loading) return null;
  // if (!user) return <Navigate to="/login" replace />;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#0d0d0d] font-sans text-stone-300">
        <Navbar />
        <main>
          <Hero />
          <FeaturedDish />
          <Specialties />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}