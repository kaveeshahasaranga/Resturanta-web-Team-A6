import { useState } from "react";
import { motion, AnimatePresence, Reorder, MotionConfig } from "framer-motion";
import { FaFire, FaUtensils, FaMortarPestle, FaLeaf } from "react-icons/fa";
import { FiUpload, FiCrop, FiTrash2, FiRotateCcw, FiZap, FiPlus, FiEdit2, FiList } from "react-icons/fi";

/* This page renders only the CONTENT area. The sidebar and top bar from the Figma
   design belong to your existing AdminLayout (this page is rendered inside its <Outlet />). */

/* ---------- initial (last published) content: replace with data from your API ---------- */
const glyphs = [
  { key: "flame", label: "Flame / Hearth", Icon: FaFire },
  { key: "pot", label: "Pot / Steam", Icon: FaUtensils },
  { key: "mill", label: "Spice Mill", Icon: FaMortarPestle },
  { key: "leaf", label: "Leaf / Herb", Icon: FaLeaf },
];

const initialContent = {
  heroVisible: true,
  hero: {
    narrative:
      "Preserving generational village recipes cooked over open wood-fire embers and authentic earthen clay pots in the deep coastal heartlands of Ceylon.",
    texture: "Obsidian Slate",
    smoke: true,
    scrim: 65,
    image: "/images/about/clay-pot-cooking.jpg",
    imageMeta: "1920 × 1080 px • WebP • 3.4 MB",
  },
  pillars: [
    {
      id: "p1",
      active: true,
      glyph: "flame",
      title: "Wood-Fired Embers",
      eyebrow: "INCANDESCENT THERMAL PRECISION",
      copy: "Seasoned Ceylon ironwood and tamarind root coals burn steadily at 420°C without flare-ups, caramelizing coconut creams and releasing delicate resinous woodsmoke into slow-simmering dishes.",
      tags: "420°C Constant Heat, Tamarind Wood",
    },
    {
      id: "p2",
      active: true,
      glyph: "pot",
      title: "Earthen Clay Cookware",
      eyebrow: "POROUS KELANI SILT VESSELS",
      copy: "Unfinished, mineral-rich river silt clay pots retain gentle heat distribution, naturally neutralizing sharp spice acidity and imparting an unmistakable earthy sweetness to each curry reduction.",
      tags: "Unglazed Terracotta, Mineral Rich",
    },
    {
      id: "p3",
      active: true,
      glyph: "mill",
      title: "Hand-Ground Spice Blends",
      eyebrow: "ANCESTRAL MILLSTONE GRINDING",
      copy: "Sun-dried Ceylon cinnamon quills, wild kochchi chilies, roasted coriander, and sun-cured goraka paste stone-ground daily at dawn to preserve the delicate volatile essential oils.",
      tags: "Stone Ground, Raw Ceylon Spices",
    },
  ],
  masters: [
    {
      id: "m1",
      label: "HEARTH MASTER",
      caption: "PRIMARY PROFILE",
      isPublic: true,
      name: "Chef Mahinda Rajapakse",
      role: "Master of the Sacred Hearth & Co-Founder",
      bio: "Trained from age twelve under Galle village elders, Mahinda orchestrates the precise temperature calibration of unglazed clay pots over ironwood embers.",
      image: "/images/about/chef-mahinda.jpg",
    },
    {
      id: "m2",
      label: "SPICE MASTER",
      caption: "DEGUSTATION LEAD",
      isPublic: true,
      name: "Chef Asanka Senanayake",
      role: "Executive Spice Master & Head of Degustation",
      bio: "Renowned for his mastery over sun-dried spice balances and raw coconut husk flash searing, creating multi-layered umami notes in high-heat earthen pottery.",
      image: "/images/about/chef-asanka.jpg",
    },
  ],
  cta: {
    live: true,
    headline: "Taste the Authentic Wood-Fired Heritage Today",
    subtext:
      "Tables at our four ironwood hearth pits are reserved by pre-allocation for the Sundown and Nightfire seatings. Early booking strongly recommended.",
    label: "EXPLORE OUR MENU",
    link: "/menu",
  },
};

/* TODO: replace with your real API call from src/services */
async function publishAboutContent(data) {
  await new Promise((r) => setTimeout(r, 600));
  return data;
}

/* ---------- styles & tiny components ---------- */
const display = "font-['Playfair_Display',serif]";
const inputCls =
  "w-full rounded-sm border border-white/10 bg-[#0e0e0e] px-3 py-2 text-[12px] text-stone-200 outline-none transition-colors placeholder:text-stone-600 focus:border-[#e8751a]/60";
const ghostBtn =
  "flex items-center justify-center gap-1.5 rounded-sm border border-white/10 px-3 py-1.5 text-[9px] font-semibold tracking-[0.1em] text-stone-300 transition-colors hover:bg-white/5";

function Label({ children, right }) {
  return (
    <span className="mb-1.5 flex items-center justify-between text-[9px] font-semibold tracking-[0.14em] text-stone-500">
      <span>{children}</span>
      {right && <span className="font-normal text-stone-600">{right}</span>}
    </span>
  );
}

function Toggle({ checked, onChange, label, labelClass = "text-stone-400" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 text-[10px] ${labelClass}`}
    >
      {label}
      <span
        className={`flex h-4 w-8 items-center rounded-full p-0.5 transition-colors ${
          checked ? "justify-end bg-[#e8751a]" : "justify-start bg-stone-700"
        }`}
      >
        <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className="h-3 w-3 rounded-full bg-white" />
      </span>
    </button>
  );
}

function Card({ title, subtitle, right, delay = 0, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-md border border-white/5 bg-[#121212] p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className={`${display} text-sm text-stone-100`}>{title}</h2>
          {subtitle && <p className="mt-1 text-[10px] text-stone-500">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </motion.section>
  );
}

function SectionTitle({ title, subtitle, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className={`${display} text-base tracking-wide text-stone-100`}>{title}</h2>
        <p className="mt-1 max-w-md text-[10px] leading-relaxed text-stone-500">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}

// Reads a chosen image file into a local preview (real uploads need your backend).
const previewFromFile = (file) => ({
  url: URL.createObjectURL(file),
  meta: `${(file.type.split("/")[1] || "image").toUpperCase()} • ${(file.size / 1048576).toFixed(1)} MB`,
});

/* ---------- page ---------- */
export default function AdminAboutPage() {
  const [published, setPublished] = useState(initialContent);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [reorderMode, setReorderMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const dirty = JSON.stringify(content) !== JSON.stringify(published);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const setHero = (patch) => setContent((c) => ({ ...c, hero: { ...c.hero, ...patch } }));
  const setCta = (patch) => setContent((c) => ({ ...c, cta: { ...c.cta, ...patch } }));
  const setPillar = (id, patch) =>
    setContent((c) => ({ ...c, pillars: c.pillars.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  const setMaster = (id, patch) =>
    setContent((c) => ({ ...c, masters: c.masters.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));

  const cycleGlyph = (p) => {
    const i = glyphs.findIndex((g) => g.key === p.glyph);
    setPillar(p.id, { glyph: glyphs[(i + 1) % glyphs.length].key });
  };

  const addMaster = () => {
    const id = `m${Date.now()}`;
    setContent((c) => ({
      ...c,
      masters: [
        ...c.masters,
        { id, label: "NEW MASTER", caption: "NEW PROFILE", isPublic: false, name: "New Chef", role: "Role / Title", bio: "Short biography.", image: "" },
      ],
    }));
    setEditingId(id);
  };

  const removeMaster = (id) => {
    if (!window.confirm("Remove this master chef from the About page?")) return;
    setContent((c) => ({ ...c, masters: c.masters.filter((m) => m.id !== id) }));
    setEditingId(null);
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      await publishAboutContent(content);
      setPublished(content);
      showToast("About page changes published");
    } catch {
      showToast("Publishing failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setContent(published);
    setEditingId(null);
    showToast("Draft discarded");
  };

  const { hero, cta } = content;

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
            <h1 className={`${display} mb-2 text-2xl text-stone-100`}>About Page Content Management</h1>
            <p className="text-[12px] leading-relaxed text-stone-400">
              Curate ancestral origins, craft storytelling, culinary pillars, and master chef dossiers
              for the PRANEETHA customer experience.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!dirty}
              className="flex items-center gap-2 rounded-sm border border-white/10 px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-stone-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiRotateCcw size={12} /> DISCARD DRAFT
            </button>
            <motion.button
              type="button"
              onClick={handlePublish}
              disabled={!dirty || saving}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-sm bg-[#e8751a] px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-stone-950 transition-colors hover:bg-[#ff8a2e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiZap size={12} /> {saving ? "PUBLISHING…" : "PUBLISH ALL CHANGES"}
            </motion.button>
          </div>
        </motion.header>

        <div className="mx-auto max-w-6xl space-y-10">
          {/* SECTION 01 */}
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <Card
              title="Section 01 // Origin & Manifesto"
              right={
                <Toggle
                  checked={content.heroVisible}
                  onChange={(v) => setContent((c) => ({ ...c, heroVisible: v }))}
                  label="Section Visible"
                  labelClass="text-emerald-400"
                />
              }
            >
              <label className="mb-5 block">
                <Label right={`${hero.narrative.length} / 200`}>HERO SUB-NARRATIVE</Label>
                <textarea
                  rows={4}
                  maxLength={200}
                  value={hero.narrative}
                  onChange={(e) => setHero({ narrative: e.target.value })}
                  className={inputCls}
                />
              </label>

              <Label>BACKGROUND &amp; AMBIENCE CONTROLS</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="rounded-sm border border-[#e8751a]/40 bg-[#0e0e0e] p-3 text-[10px] text-stone-400">
                  <span className="mb-1.5 block text-[9px] tracking-[0.1em] text-stone-500">TEXTURE</span>
                  <select
                    value={hero.texture}
                    onChange={(e) => setHero({ texture: e.target.value })}
                    className="w-full rounded-sm bg-transparent text-[11px] text-stone-200 outline-none"
                  >
                    {["Obsidian Slate", "Charcoal Grain", "Plain Dark"].map((o) => (
                      <option key={o} className="bg-[#0e0e0e]">{o}</option>
                    ))}
                  </select>
                </label>
                <div className="rounded-sm border border-white/10 bg-[#0e0e0e] p-3 text-[10px] text-stone-400">
                  <span className="mb-1.5 block text-[9px] tracking-[0.1em] text-stone-500">CHIMNEY SMOKE</span>
                  <Toggle
                    checked={hero.smoke}
                    onChange={(v) => setHero({ smoke: v })}
                    label={hero.smoke ? "ACTIVE" : "OFF"}
                    labelClass={hero.smoke ? "text-emerald-400" : "text-stone-500"}
                  />
                </div>
                <label className="rounded-sm border border-white/10 bg-[#0e0e0e] p-3 text-[10px] text-stone-400">
                  <span className="mb-1.5 flex justify-between text-[9px] tracking-[0.1em] text-stone-500">
                    <span>SCRIM FALLOFF</span>
                    <span className="text-stone-300">{hero.scrim}%</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hero.scrim}
                    onChange={(e) => setHero({ scrim: Number(e.target.value) })}
                    className="w-full accent-[#e8751a]"
                  />
                </label>
              </div>
            </Card>

            <Card title="Origin Image" delay={0.06}>
              <div className="relative aspect-video overflow-hidden rounded-sm bg-gradient-to-br from-stone-800 to-stone-950">
                {hero.image ? (
                  <img src={hero.image} alt="Origin" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] text-stone-600">No image</span>
                )}
              </div>
              <p className="mb-3 mt-2 text-center text-[9px] text-stone-500">{hero.imageMeta}</p>
              <div className="grid grid-cols-3 gap-2">
                <label className={`${ghostBtn} cursor-pointer`}>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const { url, meta } = previewFromFile(f);
                        setHero({ image: url, imageMeta: meta });
                      }
                    }}
                  />
                  <FiUpload size={10} /> REPLACE
                </label>
                <button type="button" disabled title="Coming soon" className={`${ghostBtn} cursor-not-allowed opacity-40`}>
                  <FiCrop size={10} /> CROP
                </button>
                <button
                  type="button"
                  onClick={() => window.confirm("Remove this image?") && setHero({ image: "", imageMeta: "No image" })}
                  className={`${ghostBtn} hover:border-red-500/40 hover:text-red-400`}
                >
                  <FiTrash2 size={10} /> PURGE
                </button>
              </div>
            </Card>
          </div>

          {/* PILLARS */}
          <section>
            <SectionTitle
              title="OUR CULINARY PILLARS"
              subtitle="Three indispensable disciplines that converge inside our Galle sanctuary to ignite uncompromising flavor memory."
              right={
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReorderMode((v) => !v)}
                    className={`${ghostBtn} ${reorderMode ? "border-[#e8751a] text-[#e8751a]" : ""}`}
                  >
                    <FiList size={10} /> {reorderMode ? "DONE REORDERING" : "REORDER CARDS"}
                  </button>
                  <button type="button" disabled title="Coming soon" className={`${ghostBtn} cursor-not-allowed opacity-40`}>
                    ICON GLYPHS SELECTOR
                  </button>
                </div>
              }
            />
            <Reorder.Group
              axis="x"
              values={content.pillars}
              onReorder={(next) => setContent((c) => ({ ...c, pillars: next }))}
              className="grid gap-4 md:grid-cols-3"
            >
              {content.pillars.map((p, i) => {
                const glyph = glyphs.find((g) => g.key === p.glyph) || glyphs[0];
                const tagList = p.tags.split(",").map((t) => t.trim()).filter(Boolean);
                return (
                  <Reorder.Item
                    key={p.id}
                    value={p}
                    dragListener={reorderMode}
                    whileDrag={{ scale: 1.03, zIndex: 10 }}
                    className={`rounded-sm border bg-[#121212] p-4 ${
                      reorderMode ? "cursor-grab border-[#e8751a]/40" : "border-white/5"
                    } ${p.active ? "" : "opacity-60"}`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[9px] font-semibold tracking-[0.12em] text-[#e8751a]">PILLAR #0{i + 1}</span>
                      <Toggle
                        checked={p.active}
                        onChange={(v) => setPillar(p.id, { active: v })}
                        label={p.active ? "Active" : "Hidden"}
                        labelClass={p.active ? "text-emerald-400" : "text-stone-500"}
                      />
                    </div>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#e8751a]/15 text-[#e8751a]">
                        <glyph.Icon size={14} />
                      </span>
                      <div className="text-[10px]">
                        <p className="text-stone-300">Icon: {glyph.label}</p>
                        <button type="button" onClick={() => cycleGlyph(p)} className="text-[#e8751a] hover:underline">
                          Change Glyph
                        </button>
                      </div>
                    </div>
                    <label className="mb-3 block">
                      <Label>TITLE</Label>
                      <input value={p.title} onChange={(e) => setPillar(p.id, { title: e.target.value })} className={`${inputCls} ${display}`} />
                    </label>
                    <label className="mb-3 block">
                      <Label>EYEBROW</Label>
                      <input
                        value={p.eyebrow}
                        onChange={(e) => setPillar(p.id, { eyebrow: e.target.value })}
                        className={`${inputCls} text-[10px] tracking-[0.08em] text-[#e8751a]`}
                      />
                    </label>
                    <label className="mb-3 block">
                      <Label>DESCRIPTION NARRATIVE</Label>
                      <textarea rows={4} value={p.copy} onChange={(e) => setPillar(p.id, { copy: e.target.value })} className={inputCls} />
                    </label>
                    <label className="block">
                      <Label>TAGS (COMMA SEPARATED)</Label>
                      <input value={p.tags} onChange={(e) => setPillar(p.id, { tags: e.target.value })} className={inputCls} />
                    </label>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tagList.map((t) => (
                        <span key={t} className="rounded-sm bg-white/5 px-2 py-0.5 text-[9px] text-stone-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </section>

          {/* MASTERS */}
          <section>
            <SectionTitle
              title="THE MASTERS BEHIND THE FLAMES"
              subtitle="Custodians of ancestral recipes, ironwood hearths, and volcanic spice alchemy."
              right={
                <button type="button" onClick={addMaster} className={ghostBtn}>
                  <FiPlus size={10} /> ADD MASTER CHEF
                </button>
              }
            />
            <div className="grid gap-4 md:grid-cols-2">
              <AnimatePresence initial={false}>
                {content.masters.map((m) => {
                  const editing = editingId === m.id;
                  return (
                    <motion.article
                      key={m.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="grid overflow-hidden rounded-sm border border-white/5 bg-[#121212] sm:grid-cols-[150px_1fr]"
                    >
                      <div className="relative h-56 bg-gradient-to-br from-stone-800 to-stone-950 sm:h-auto">
                        {m.image && <img src={m.image} alt={m.name} className="h-full w-full object-cover" />}
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-6 text-[8px] font-semibold tracking-[0.12em] text-stone-200">
                          {m.caption}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="mb-2 flex items-center justify-between text-[8px] font-semibold tracking-[0.12em]">
                          <span className="text-[#e8751a]">{m.label}</span>
                          <button
                            type="button"
                            onClick={() => setMaster(m.id, { isPublic: !m.isPublic })}
                            className={m.isPublic ? "text-emerald-400" : "text-stone-500"}
                          >
                            ● {m.isPublic ? "Public" : "Draft"}
                          </button>
                        </div>

                        {editing ? (
                          <div className="space-y-2">
                            <input value={m.name} onChange={(e) => setMaster(m.id, { name: e.target.value })} className={`${inputCls} ${display}`} aria-label="Name" />
                            <input value={m.role} onChange={(e) => setMaster(m.id, { role: e.target.value })} className={inputCls} aria-label="Role" />
                            <textarea rows={3} value={m.bio} onChange={(e) => setMaster(m.id, { bio: e.target.value })} className={inputCls} aria-label="Biography" />
                            <input value={m.label} onChange={(e) => setMaster(m.id, { label: e.target.value.toUpperCase() })} className={inputCls} aria-label="Label" />
                            <input value={m.caption} onChange={(e) => setMaster(m.id, { caption: e.target.value.toUpperCase() })} className={inputCls} aria-label="Photo caption" />
                          </div>
                        ) : (
                          <>
                            <h3 className={`${display} text-base text-stone-100`}>{m.name}</h3>
                            <p className="mb-2 text-[10px] text-stone-400">{m.role}</p>
                            <p className="mb-3 text-[10px] leading-relaxed text-stone-500">{m.bio}</p>
                          </>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button type="button" onClick={() => setEditingId(editing ? null : m.id)} className={ghostBtn}>
                            <FiEdit2 size={10} /> {editing ? "DONE" : "EDIT PROFILE"}
                          </button>
                          <label className={`${ghostBtn} cursor-pointer`}>
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setMaster(m.id, { image: previewFromFile(f).url });
                              }}
                            />
                            <FiUpload size={10} /> Replace Photo
                          </label>
                          {editing && (
                            <button
                              type="button"
                              onClick={() => removeMaster(m.id)}
                              className={`${ghostBtn} hover:border-red-500/40 hover:text-red-400`}
                            >
                              <FiTrash2 size={10} /> REMOVE
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* SECTION 05 */}
          <Card
            title="Section 05 // Bottom Call To Action Banner"
            subtitle="Configure customer reservation prompt displayed at the conclusion of the story."
            delay={0.1}
            right={
              <Toggle
                checked={cta.live}
                onChange={(v) => setCta({ live: v })}
                label={cta.live ? "Banner Live" : "Banner Hidden"}
                labelClass={cta.live ? "text-emerald-400" : "text-stone-500"}
              />
            }
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <label className="block">
                  <Label>BANNER HEADLINE</Label>
                  <input value={cta.headline} onChange={(e) => setCta({ headline: e.target.value })} className={`${inputCls} ${display}`} />
                </label>
                <label className="block">
                  <Label>BANNER SUBTEXT NARRATIVE</Label>
                  <textarea rows={3} value={cta.subtext} onChange={(e) => setCta({ subtext: e.target.value })} className={inputCls} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <Label>CTA BUTTON LABEL</Label>
                    <input value={cta.label} onChange={(e) => setCta({ label: e.target.value })} className={inputCls} />
                  </label>
                  <label>
                    <Label>TARGET LINK / ROUTE</Label>
                    <input value={cta.link} onChange={(e) => setCta({ link: e.target.value })} className={inputCls} />
                  </label>
                </div>
              </div>

              <div>
                <Label>LIVE STOREFRONT PREVIEW</Label>
                <motion.div
                  animate={{ opacity: cta.live ? 1 : 0.35 }}
                  className="flex h-[calc(100%-1.5rem)] min-h-[170px] flex-col items-center justify-center rounded-sm bg-gradient-to-b from-[#161616] to-[#2a1707] p-6 text-center"
                >
                  <h3 className={`${display} mb-2 text-lg leading-snug text-stone-100`}>{cta.headline}</h3>
                  <p className="mb-4 max-w-xs text-[10px] leading-relaxed text-stone-400">{cta.subtext}</p>
                  <span className="rounded-sm bg-[#e8751a] px-4 py-2 text-[9px] font-semibold tracking-[0.12em] text-stone-950">
                    {cta.label}
                  </span>
                </motion.div>
              </div>
            </div>
          </Card>
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