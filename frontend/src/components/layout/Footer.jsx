import { motion, useReducedMotion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

const exploreLinks = [
  { label: "Home & Philosophy", href: "/" },
  { label: "Culinary Heritage", href: "/menu" },
  { label: "Hearth Masters", href: "/#masters" },
  { label: "Clay Pot Degustation", href: "/menu" },
  { label: "Private Hearth Booking", href: "/contact" },
];

const socials = [
  { label: "Facebook", href: "#", Icon: FaFacebookF },
  { label: "Instagram", href: "#", Icon: FaInstagram },
  { label: "WhatsApp", href: "#", Icon: FaWhatsapp },
  { label: "TikTok", href: "#", Icon: FaTiktok },
];

const headingClass =
  "mb-5 font-serif text-[11px] font-semibold tracking-[0.25em] text-stone-200";
const bodyClass = "text-[12px] leading-relaxed text-stone-400";

export default function Footer() {
  const reduceMotion = useReducedMotion();

  // The whole footer reveals once, with the columns staggered one after another.
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
  };
  const column = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const backToTop = () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  return (
    <footer className="border-t border-white/5 bg-[#0d0d0d] px-6 pb-6 pt-14 text-stone-400 md:px-12">
      <motion.div
        className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.1fr]"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Brand */}
        <motion.div variants={column}>
          <a href="/" className="mb-4 flex items-center gap-2">
            <span className="text-lg text-amber-600" aria-hidden="true">
              🔥
            </span>
            <span className="font-serif text-lg tracking-[0.3em] text-stone-100">
              PRANEETHA
            </span>
          </a>
          <p className={`${bodyClass} max-w-xs`}>
            Ancient Sri Lankan hearths, clay pot cookery, and glowing Ceylon
            ironwood embers articulated through artisanal gastronomy and
            fire-crafted ritual dining.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-stone-300 transition-colors hover:bg-amber-600/20 hover:text-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
              >
                <Icon size={14} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Explore */}
        <motion.nav variants={column} aria-label="Explore">
          <h3 className={headingClass}>EXPLORE</h3>
          <ul className="space-y-3">
            {exploreLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="inline-block text-[12px] text-stone-400 transition-all duration-300 hover:translate-x-1 hover:text-amber-500"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        {/* Service hours */}
        <motion.div variants={column}>
          <h3 className={headingClass}>SERVICE HOURS</h3>
          <p className="mb-3 text-[12px] font-medium text-stone-200">
            Tuesday — Sunday
          </p>
          <p className={`${bodyClass} mb-3`}>
            Sundown Ember Sessions: 17:30 – 20:30
          </p>
          <p className={`${bodyClass} mb-3`}>
            Nightfire Degustation: 21:00 – 23:30
          </p>
          <p className="text-[11px] italic text-stone-500">
            Mondays reserved for cinnamon wood rest
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div variants={column}>
          <h3 className={headingClass}>HEARTH SANCTUARY</h3>
          <address className={`${bodyClass} mb-4 not-italic`}>
            44 Ironwood Pavilion, Galle Fort,
            <br />
            Southern Province, Sri Lanka
          </address>
          <a
            href="mailto:reservations@praneetha.lk"
            className="mb-2 block text-[12px] text-stone-200 transition-colors hover:text-amber-500"
          >
            reservations@praneetha.lk
          </a>
          <a
            href="tel:+94914569800"
            className="block text-[12px] text-stone-200 transition-colors hover:text-amber-500"
          >
            +94 (91) 456 9800
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="mx-auto mt-14 flex max-w-6xl items-center justify-between border-t border-white/5 pt-5 text-[10px] text-stone-500">
        <p>© 2025 PRANEETHA Culinary Hearth. All rights reserved.</p>
        <button
          type="button"
          onClick={backToTop}
          className="group tracking-[0.2em] transition-colors hover:text-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
        >
          BACK TO TOP{" "}
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">
            ↑
          </span>
        </button>
      </div>
    </footer>
  );
}
