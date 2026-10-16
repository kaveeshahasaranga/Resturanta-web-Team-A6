import { useRef, useState } from "react";
import { motion, AnimatePresence, Reorder, MotionConfig } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiUpload,
  FiCrop,
  FiRotateCcw,
  FiZap,
  FiArrowRight,
  FiClock,
  FiList,
  FiCheckCircle,
} from "react-icons/fi";

/* This page renders only the CONTENT area. The sidebar and top bar from the Figma
   design belong to your existing AdminLayout (this page is rendered inside its <Outlet />). */

/* ---------- initial (last published) content: replace with data from your API ---------- */
const initialContent = {
  heroVisible: true,
  hero: {
    headline: "PRIMITIVE FIRE. ANCIENT CLAY. UNBROKEN TASTE.",
    texture: "Obsidian Slate + Ember Glow",
    smoke: "Low Drift (CSS Shader)",
    scrim: "Radial 75% Dark Center",
    pillars: [
      {
        title: "Wild Cinnamon & Tamarind Timber",
        copy: "Fired exclusively with cured Southern wood cuts. Dense, aromatic coals releasing ancient terpene and mineral infusions into every pot.",
      },
      {
        title: "Kelani River Terracotta Pots",
        copy: "Single-season unglazed earthenware pots breathe heat and absorb flavors, seasoned by generational clay smiths.",
      },
      {
        title: "Fourteen-Seated Guests Per Hearth",
        copy: "An intimate perimeter around the open stone fire pit. Every guest watches the wood collapse into embers under their gaze.",
      },
    ],
  },
  spotlightVisible: true,
  spotlight: {
    image: "/images/dishes/lagoon-crab.jpg",
    name: "Lagoon Crab in Charred Coconut & Goraka",
    price: "LKR 9,500",
    origin: "Batticaloa Lagoon Wild Crab",
    description:
      "Hand-harvested daily from the brackish waters of eastern lagoons. Braised inside unglazed clay over fiery cinnamon wood with scorched coconut milk and ground Goraka reduction until broth turns dark, fragrant, and intensely savoury.",
    rating: "5.0",
    accompaniments: "String hoppers, pol sambol, kithul treacle curd",
    primaryLabel: "REQUEST ALLOCATION",
    primaryColor: "#e8751a",
    ghostLabel: "EXPLORE PAIRINGS",
    ghostEnabled: false,
  },
  specialtiesHeading: "Porous Clay Specialties",
  specialties: [
    {
      id: "s1",
      badge: "6-HOUR REDUCTION",
      image: "/images/dishes/kalu-pol-pork.jpg",
      title: "Kalu Pol Kurobuta Pork",
      price: "LKR 6,400",
      heat: "2 Chiles • 6-Hour",
      micro: "Toasted dark coconut roast core with wild black pepper and rosewood embers.",
    },
    {
      id: "s2",
      badge: "12-HOUR SIMMER",
      image: "/images/dishes/polos-ambula.jpg",
      title: "Overnight Polos Ambula",
      price: "LKR 4,200",
      heat: "Mild • 12-Hour",
      micro: "Young baby jackfruit braised into dark mahogany melt-in-mouth earthen pot.",
    },
    {
      id: "s3",
      badge: "OPEN FIRE POT",
      image: "/images/dishes/sea-prawns.jpg",
      title: "Miris Glazed Jumbo Sea Prawns",
      price: "LKR 7,900",
      heat: "3 Chiles • Flash Sizzle",
      micro: "Wild pepper oil and roasted kochchi pepper basted over open flame.",
    },
  ],
  testimonials: [
    {
      id: "t1",
      quote:
        "There is no theatrical garnish here; only the devastating truth of burning cinnamon wood and ancient clay that turns spice into high art.",
      author: "Manurita Gamli",
      role: "Gastronome & Historian",
    },
    {
      id: "t2",
      quote:
        "Eating the lagoon crab straight from the soot-blackened pot reminds me that cooking is worship. Praneetha is unrivaled in South Asia.",
      author: "Chef Toru Shishido",
      role: "Tokyo Wazoitsu Atelier",
    },
    {
      id: "t3",
      quote:
        "A masterpiece in restraint. The overnight polos ambula melts into something transcendent, it makes modern sous-vide look utterly soulless.",
      author: "Ravindra Rajapakse",
      role: "Sri Lanka Culinary Archive",
    },
  ],
};

/* TODO: replace with your real API call from src/services */
async function publishHomeContent(data) {
  await new Promise((r) => setTimeout(r, 600));
  return data;
}

/* ---------- styles & tiny components ---------- */
const display = "font-['Playfair_Display',serif]";
const inputCls =
  "w-full rounded-sm border border-white/10 bg-[#0e0e0e] px-3 py-2 text-[12px] text-stone-200 outline-none transition-colors placeholder:text-stone-600 focus:border-[#e8751a]/60";

function Label({ children, right }) {
  return (
    <span className="mb-1.5 flex items-center justify-between text-[9px] font-semibold tracking-[0.14em] text-stone-500">
      <span>{children}</span>
      {right && <span className="font-normal text-stone-600">{right}</span>}
    </span>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-[10px] text-stone-400"
    >
      <span
        className={`flex h-4 w-8 items-center rounded-full p-0.5 transition-colors ${
          checked ? "justify-end bg-[#e8751a]" : "justify-start bg-stone-700"
        }`}
      >
        <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className="h-3 w-3 rounded-full bg-white" />
      </span>
      {label}
    </button>
  );
}

function Section({ tag, title, right, delay = 0, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-md border border-white/5 bg-[#121212]"
    >
      <header className="flex items-center justify-between border-b border-white/5 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="rounded-sm bg-[#e8751a]/15 px-1.5 py-0.5 text-[8px] font-semibold tracking-[0.12em] text-[#e8751a]">
            {tag}
          </span>
          <h2 className={`${display} text-sm text-stone-100`}>{title}</h2>
        </div>
        {right}
      </header>
      <div className="p-5">{children}</div>
    </motion.section>
  );
}

/* ---------- page ---------- */
export default function AdminHomePage() {
  const [published, setPublished] = useState(initialContent);
  const [content, setContent] = useState(initialContent);
  const [publishedAt, setPublishedAt] = useState("Today, 16:15 IST");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [reorderMode, setReorderMode] = useState(false);
  const fileRef = useRef(null);

  const dirty = JSON.stringify(content) !== JSON.stringify(published);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const setHero = (patch) => setContent((c) => ({ ...c, hero: { ...c.hero, ...patch } }));
  const setPillar = (i, patch) =>
    setContent((c) => ({
      ...c,
      hero: { ...c.hero, pillars: c.hero.pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) },
    }));
  const setSpot = (patch) => setContent((c) => ({ ...c, spotlight: { ...c.spotlight, ...patch } }));
  const setSpecialty = (id, patch) =>
    setContent((c) => ({
      ...c,
      specialties: c.specialties.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  const setTestimonial = (id, patch) =>
    setContent((c) => ({
      ...c,
      testimonials: c.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));

  const handlePublish = async () => {
    setSaving(true);
    try {
      await publishHomeContent(content);
      setPublished(content);
      setPublishedAt(
        `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      );
      showToast("All changes published to the storefront");
    } catch {
      showToast("Publishing failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setContent(published);
    showToast("Draft discarded");
  };

  // Local preview only; real uploads need your backend (e.g. multipart POST to your API).
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setSpot({ image: URL.createObjectURL(file) });
  };

  const { hero, spotlight } = content;

  return (
    <MotionConfig reducedMotion="user">
      <div className="text-stone-300">
        {/* Page header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-6 flex max-w-6xl flex-wrap items-end justify-between gap-4"
        >
          <div className="max-w-xl">
            <p className="mb-2 text-[9px] font-semibold tracking-[0.14em] text-[#e8751a]">
              STOREFRONT VISUAL MERCHANDISING CMS
            </p>
            <h1 className={`${display} mb-2 text-xl text-stone-100`}>Home Content Management</h1>
            <p className="mb-3 text-[12px] leading-relaxed text-stone-400">
              Curate live storefront hero declarations, prime feature spotlight, porous clay menu
              curations, customer testimonials, and hearth sanctuary logistics.
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-white/5 px-2 py-1 text-[10px] text-stone-400">
              <FiClock size={10} /> Last published: {publishedAt}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!dirty}
              className="flex items-center gap-2 rounded-sm border border-white/10 px-4 py-2 text-[11px] text-stone-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiRotateCcw size={12} /> Discard Draft
            </button>
            <motion.button
              type="button"
              onClick={handlePublish}
              disabled={!dirty || saving}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-sm bg-[#e8751a] px-4 py-2 text-[11px] font-semibold text-stone-950 transition-colors hover:bg-[#ff8a2e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiZap size={12} /> {saving ? "Publishing…" : "Publish All Changes"}
            </motion.button>
          </div>
        </motion.header>

        <div className="mx-auto max-w-6xl space-y-6">
          {/* SECTION 01 */}
          <Section
            tag="SECTION 01"
            title="Hero Header & Three Pillar Declarations"
            right={
              <Toggle
                checked={content.heroVisible}
                onChange={(v) => setContent((c) => ({ ...c, heroVisible: v }))}
                label="Section Visible"
              />
            }
          >
            <div className="grid gap-5 md:grid-cols-[1.6fr_1fr]">
              <div>
                <Label right={`${hero.headline.length} / 80`}>MAIN HERO HEADLINE (SERIF DISPLAY)</Label>
                <textarea
                  rows={2}
                  maxLength={80}
                  value={hero.headline}
                  onChange={(e) => setHero({ headline: e.target.value })}
                  className={`${inputCls} ${display} text-sm`}
                />
                <p className="mt-2 text-[9px] text-stone-600">
                  Rendered in Playfair Display with warm ember typographic accents across viewport header.
                </p>
              </div>
              <div className="rounded-sm border border-white/5 bg-[#0e0e0e] p-4">
                <p className="mb-3 text-[9px] font-semibold tracking-[0.14em] text-[#e8751a]">
                  HERO AMBIENCE &amp; TEXTURE SETTINGS
                </p>
                {[
                  ["Background Texture", "texture", ["Obsidian Slate + Ember Glow", "Charcoal Grain", "Plain Dark"]],
                  ["Smoke Particles Overlay", "smoke", ["Low Drift (CSS Shader)", "High Drift", "Off"]],
                  ["Scrim Gradient Falloff", "scrim", ["Radial 75% Dark Center", "Linear Top-Down", "None"]],
                ].map(([label, key, options]) => (
                  <label key={key} className="mb-2 flex items-center justify-between gap-3 text-[10px] text-stone-400">
                    {label}
                    <select
                      value={hero[key]}
                      onChange={(e) => setHero({ [key]: e.target.value })}
                      className="rounded-sm border border-white/10 bg-[#0b0b0b] px-2 py-1 text-[10px] text-[#e8751a] outline-none"
                    >
                      {options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-2 mt-6 flex items-center justify-between">
              <Label>THREE HERO PILLAR DECLARATIONS (DISPLAYED AT FOOT OF HERO)</Label>
              <span className="text-[9px] text-[#e8751a]">3 Cards Bound</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {hero.pillars.map((p, i) => (
                <div key={i} className="rounded-sm border border-white/5 bg-[#0e0e0e] p-4">
                  <p className="mb-3 text-[8px] font-semibold tracking-[0.14em] text-[#e8751a]">PILLAR #0{i + 1}</p>
                  <Label>PILLAR TITLE</Label>
                  <input
                    value={p.title}
                    onChange={(e) => setPillar(i, { title: e.target.value })}
                    className={`${inputCls} mb-3`}
                  />
                  <Label>DECLARATION COPY</Label>
                  <textarea
                    rows={3}
                    value={p.copy}
                    onChange={(e) => setPillar(i, { copy: e.target.value })}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* SECTION 02 */}
          <Section
            tag="SECTION 02"
            title="Prime Feature Spotlight: Lagoon Crab Showcase"
            delay={0.08}
            right={
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-sm px-2 py-0.5 text-[9px] ${
                    content.spotlightVisible ? "bg-emerald-500/10 text-emerald-400" : "bg-stone-700/40 text-stone-400"
                  }`}
                >
                  {content.spotlightVisible ? "Active Showcase" : "Hidden"}
                </span>
                <button
                  type="button"
                  aria-label="Toggle showcase visibility"
                  onClick={() => setContent((c) => ({ ...c, spotlightVisible: !c.spotlightVisible }))}
                  className="text-stone-400 hover:text-stone-200"
                >
                  {content.spotlightVisible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                </button>
              </div>
            }
          >
            <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gradient-to-br from-stone-800 to-stone-950">
                  <img src={spotlight.image} alt={spotlight.origin} className="h-full w-full object-cover" />
                  <span className="absolute bottom-2 left-2 rounded-sm bg-black/70 px-2 py-1 text-[9px] text-stone-200">
                    {spotlight.origin}
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-sm bg-[#e8751a]/80 px-2 py-1 text-[9px] text-stone-950">
                    {spotlight.price}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-sm border border-white/10 py-2 text-[10px] text-stone-300 hover:bg-white/5"
                  >
                    <FiUpload size={11} /> Replace Image
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Coming soon"
                    className="flex cursor-not-allowed items-center justify-center gap-2 rounded-sm border border-white/5 py-2 text-[10px] text-stone-600"
                  >
                    <FiCrop size={11} /> Crop / Focal
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
                  <label>
                    <Label>DISH NAME (SERIF DISPLAY TITLE)</Label>
                    <input value={spotlight.name} onChange={(e) => setSpot({ name: e.target.value })} className={inputCls} />
                  </label>
                  <label>
                    <Label>PRICE INPUT</Label>
                    <input value={spotlight.price} onChange={(e) => setSpot({ price: e.target.value })} className={`${inputCls} font-mono`} />
                  </label>
                </div>
                <label className="block">
                  <Label>ORIGIN TAG / SUB-BADGE</Label>
                  <input value={spotlight.origin} onChange={(e) => setSpot({ origin: e.target.value })} className={inputCls} />
                </label>
                <label className="block">
                  <Label right="Editorial Copy">NARRATIVE DESCRIPTION</Label>
                  <textarea
                    rows={4}
                    value={spotlight.description}
                    onChange={(e) => setSpot({ description: e.target.value })}
                    className={inputCls}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <Label>RATING &amp; STARS</Label>
                    <div className="flex items-center gap-2 rounded-sm border border-white/10 bg-[#0e0e0e] px-3 py-2 text-[12px]">
                      <span className="text-[#e8751a]">{"★".repeat(Math.round(Number(spotlight.rating) || 0))}</span>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={spotlight.rating}
                        onChange={(e) => setSpot({ rating: e.target.value })}
                        className="w-12 bg-transparent text-stone-200 outline-none"
                      />
                      <span className="text-stone-500">/ 5</span>
                    </div>
                  </label>
                  <label>
                    <Label>SUGGESTED ACCOMPANIMENTS</Label>
                    <input
                      value={spotlight.accompaniments}
                      onChange={(e) => setSpot({ accompaniments: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                </div>
                <div>
                  <Label>SPOTLIGHT ACTION BUTTONS (DUAL CTA)</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-sm border border-white/5 bg-[#0e0e0e] p-3">
                      <p className="mb-1.5 text-[8px] tracking-[0.12em] text-stone-500">BUTTON 1 (PRIMARY SOLID)</p>
                      <div className="flex items-center gap-2">
                        <input
                          value={spotlight.primaryLabel}
                          onChange={(e) => setSpot({ primaryLabel: e.target.value })}
                          className={inputCls}
                        />
                        <input
                          type="color"
                          aria-label="Primary button colour"
                          value={spotlight.primaryColor}
                          onChange={(e) => setSpot({ primaryColor: e.target.value })}
                          className="h-7 w-8 cursor-pointer rounded-sm border-0 bg-transparent p-0"
                        />
                      </div>
                    </div>
                    <div className="rounded-sm border border-white/5 bg-[#0e0e0e] p-3">
                      <p className="mb-1.5 text-[8px] tracking-[0.12em] text-stone-500">BUTTON 2 (GHOST OUTLINE)</p>
                      <div className="flex items-center gap-2">
                        <input
                          value={spotlight.ghostLabel}
                          onChange={(e) => setSpot({ ghostLabel: e.target.value })}
                          className={inputCls}
                        />
                        <input
                          type="checkbox"
                          aria-label="Show ghost button"
                          checked={spotlight.ghostEnabled}
                          onChange={(e) => setSpot({ ghostEnabled: e.target.checked })}
                          className="h-4 w-4 accent-[#e8751a]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION 03 */}
          <Section
            tag="SECTION 03"
            title="Porous Clay Specialties (3 Storefront Cards)"
            delay={0.16}
            right={
              <a href="/admin/menu" className="flex items-center gap-1 text-[11px] text-[#e8751a] hover:underline">
                View Complete Menu Catalog <FiArrowRight size={12} />
              </a>
            }
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <label className="flex-1">
                <Label>SECTION HEADING DISPLAY</Label>
                <input
                  value={content.specialtiesHeading}
                  onChange={(e) => setContent((c) => ({ ...c, specialtiesHeading: e.target.value }))}
                  className={`${inputCls} ${display}`}
                />
              </label>
              <button
                type="button"
                onClick={() => setReorderMode((v) => !v)}
                className={`flex items-center gap-2 rounded-sm border px-3 py-2 text-[10px] transition-colors ${
                  reorderMode
                    ? "border-[#e8751a] bg-[#e8751a]/10 text-[#e8751a]"
                    : "border-white/10 text-stone-300 hover:bg-white/5"
                }`}
              >
                <FiList size={12} /> {reorderMode ? "Done Reordering" : "Reorder Cards"}
              </button>
            </div>

            <Reorder.Group
              axis="x"
              values={content.specialties}
              onReorder={(next) => setContent((c) => ({ ...c, specialties: next }))}
              className="grid gap-4 md:grid-cols-3"
            >
              {content.specialties.map((s, i) => (
                <Reorder.Item
                  key={s.id}
                  value={s}
                  dragListener={reorderMode}
                  whileDrag={{ scale: 1.03, zIndex: 10 }}
                  className={`rounded-sm border bg-[#0e0e0e] p-3 ${
                    reorderMode ? "cursor-grab border-[#e8751a]/40" : "border-white/5"
                  }`}
                >
                  <p className="mb-2 text-[8px] font-semibold tracking-[0.12em] text-[#e8751a]">
                    SLOT #0{i + 1} • {s.badge}
                  </p>
                  <div className="relative mb-3 h-24 overflow-hidden rounded-sm bg-gradient-to-br from-stone-800 to-stone-950">
                    <img src={s.image} alt={s.title} draggable={false} className="h-full w-full object-cover" />
                    <span className="absolute bottom-1.5 right-1.5 rounded-sm bg-black/70 px-1.5 py-0.5 text-[8px] text-stone-200">
                      {s.price}
                    </span>
                  </div>
                  <Label>DISH TITLE</Label>
                  <input
                    value={s.title}
                    onChange={(e) => setSpecialty(s.id, { title: e.target.value })}
                    className={`${inputCls} mb-2`}
                  />
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <label>
                      <Label>PRICE (LKR)</Label>
                      <input
                        value={s.price}
                        onChange={(e) => setSpecialty(s.id, { price: e.target.value })}
                        className={`${inputCls} font-mono`}
                      />
                    </label>
                    <label>
                      <Label>HEAT / REDUCTION</Label>
                      <input
                        value={s.heat}
                        onChange={(e) => setSpecialty(s.id, { heat: e.target.value })}
                        className={inputCls}
                      />
                    </label>
                  </div>
                  <Label>MICRO DESCRIPTION</Label>
                  <textarea
                    rows={3}
                    value={s.micro}
                    onChange={(e) => setSpecialty(s.id, { micro: e.target.value })}
                    className={inputCls}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </Section>

          {/* SECTION 04 */}
          <Section
            tag="SECTION 04"
            title="Witness to the Smoke (Customer & Critic Testimonials)"
            delay={0.24}
            right={
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <FiCheckCircle size={12} /> {content.testimonials.length} Testimonial Cards Live
              </span>
            }
          >
            <div className="grid gap-4 md:grid-cols-3">
              {content.testimonials.map((t, i) => (
                <div key={t.id} className="rounded-sm border border-white/5 bg-[#0e0e0e] p-4">
                  <p className="mb-3 text-[8px] font-semibold tracking-[0.12em] text-[#e8751a]">REVIEW #0{i + 1}</p>
                  <Label>QUOTE BODY</Label>
                  <textarea
                    rows={4}
                    value={t.quote}
                    onChange={(e) => setTestimonial(t.id, { quote: e.target.value })}
                    className={`${inputCls} mb-3`}
                  />
                  <Label>AUTHOR &amp; TITLE</Label>
                  <input
                    value={t.author}
                    onChange={(e) => setTestimonial(t.id, { author: e.target.value })}
                    className={`${inputCls} mb-2`}
                  />
                  <input
                    value={t.role}
                    onChange={(e) => setTestimonial(t.id, { role: e.target.value })}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-50 rounded-sm border border-[#e8751a]/40 bg-[#161616] px-4 py-3 text-[12px] text-stone-200 shadow-xl"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}