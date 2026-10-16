import React, { useState } from 'react';
import { 
  Eye, 
  RotateCcw, 
  CheckCircle2, 
  Bell, 
  Flame, 
  CloudDrizzle, 
  Sparkles, 
  Plus, 
  ArrowUpDown, 
  Grid, 
  Image as ImageIcon, 
  Crop, 
  Trash2, 
  Edit3 
} from 'lucide-react';

const AdminAboutContentManagement = () => {
  // ---------------- STATE MANAGEMENT ----------------

  const [section1Visible, setSection1Visible] = useState(true);
  const [heroSubNarrative, setHeroSubNarrative] = useState(
    "Preserving generational village recipes cooked over open wood-fire embers and authentic earthen clay pots in the deep coastal lowlands of Ceylon."
  );
  const [activeAmbience, setActiveAmbience] = useState('chimney');
  const [heroImage, setHeroImage] = useState(
    "/images/dishes/clay-pot-cooking.jpg"
  );

  // Culinary Pillars State
  const [pillars, setPillars] = useState([
    {
      id: "01",
      title: "Wood-Fired Embers",
      eyebrow: "INCANDESCENT THERMAL PRECISION",
      description: "Seasoned Ceylon ironwood and tamarind root coals burn steadily at 420°C without flare-ups.",
      subText1: "420°C Constant Heat",
      subText2: "Tamarind Wood",
      icon: "flame"
    },
    {
      id: "02",
      title: "Earthen Clay Cookware",
      eyebrow: "POROUS KELANI SILT VESSELS",
      description: "Unfinished, mineral-rich river silt clay pots retain gentle heat distribution, naturally neutralizing acidity.",
      subText1: "Unglazed Terracotta",
      subText2: "Mineral Rich",
      icon: "pot"
    },
    {
      id: "03",
      title: "Hand-Ground Spice Blends",
      eyebrow: "ANCESTRAL MILLSTONE GRINDING",
      description: "Sun-dried Ceylon cinnamon quills, wild kochchi chilies, roasted coriander, and sun-dried spices.",
      subText1: "Stone Ground",
      subText2: "Raw Ceylon Spices",
      icon: "spice"
    }
  ]);

  // Master Chefs State
  const [chefs, setChefs] = useState([
    {
      id: 1,
      role: "HEARTH MASTER",
      name: "Chef Mahinda Rajapakse",
      subtitle: "Master of the Sacred Hearth & Co-Founder",
      description: "Trained from age twelve under Galle village elders, Mahinda orchestrates our ancestral fire pits.",
      image: "/images/dishes/chef-mahinda.jpg",
      badge: "PRIMARY PROFILE"
    },
    {
      id: 2,
      role: "SPICE MASTER",
      name: "Chef Asanka Senanayake",
      subtitle: "Executive Spice Master & Head of Degustation",
      description: "Renowned for his mastery over sun-dried spice balances and raw roasted infusion techniques.",
      image: "/images/dishes/chef-asanka.jpg",
      badge: "DEGUSTATION LEAD"
    }
  ]);

  // Section 05 State (CTA Banner)
  const [bannerLive, setBannerLive] = useState(true);
  const [bannerHeadline, setBannerHeadline] = useState("Taste the Authentic Wood-Fired Heritage Today");
  const [bannerSubtext, setBannerSubtext] = useState(
    "Tables at our four ironwood hearth pits are reserved by pre-allocation for the Sundown and Nightfire seatings. Early booking strongly recommended."
  );
  const [ctaButtonLabel, setCtaButtonLabel] = useState("EXPLORE OUR MENU");
  const [targetRoute, setTargetRoute] = useState("/menu");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handlePublish = () => {
    setSaving(true);
    setMessage('');
    setTimeout(() => {
      setSaving(false);
      setMessage('All changes published successfully!');
      setTimeout(() => setMessage(''), 4000);
    }, 1200);
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen font-sans p-6 md:p-8 space-y-8 border-l border-white/10 selection:bg-[#ec6f00] selection:text-black">
      
      {/* ---------------- TOP HEADER / NAVIGATION BAR ---------------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono mb-1">
            <span className="text-[#ec6f00] font-bold">PRANEETHA</span>
            <span>/</span>
            <span>Admin Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wide">About Page Content Management</h1>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Curate ancestral origins, craft storytelling, culinary pillars, and master chef dossiers for the PRANEETHA customer experience.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {message && <span className="text-xs text-emerald-400 font-mono">{message}</span>}
          
          <button className="flex items-center gap-2 bg-[#101010] hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all">
            <Eye className="w-3.5 h-3.5 text-[#ec6f00]" /> Preview About Site
          </button>
          
          <div className="relative p-2 bg-[#101010] border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
            <Bell className="w-4 h-4 text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ec6f00] rounded-full"></span>
          </div>

          <div className="flex items-center gap-2 bg-[#101010] border border-white/10 px-3 py-1.5 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-[#ec6f00] text-black font-bold text-[10px] flex items-center justify-center">
              M
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold leading-tight">Master Hearth Admin</p>
              <p className="text-[9px] text-[#ec6f00] tracking-widest uppercase">Superuser</p>
            </div>
          </div>

          <button className="flex items-center gap-1.5 bg-[#101010] hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 transition-all">
            <RotateCcw className="w-3.5 h-3.5" /> Discard Draft
          </button>

          <button 
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 bg-[#ec6f00] hover:bg-[#ec6f00]/90 text-black px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(236,111,0,0.3)] transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" /> {saving ? 'Publishing...' : 'PUBLISH ALL CHANGES'}
          </button>
        </div>
      </div>

      {/* ---------------- SECTION 01 // ORIGIN & MANIFESTO ---------------- */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-[#ec6f00] font-mono font-bold text-xs uppercase tracking-widest">Section 01</div>
            <div className="text-gray-500">//</div>
            <h2 className="font-serif font-bold tracking-wider text-base text-white">Origin & Manifesto</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-400 font-mono">Section Visible</span>
            <button 
              onClick={() => setSection1Visible(!section1Visible)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${section1Visible ? 'bg-[#ec6f00]' : 'bg-white/20'}`}
            >
              <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${section1Visible ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-2">
                <span>Hero Sub-Narrative</span>
                <span>{heroSubNarrative.length} / 360</span>
              </div>
              <textarea 
                rows="3"
                value={heroSubNarrative}
                onChange={(e) => setHeroSubNarrative(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#ec6f00] transition-colors leading-relaxed font-sans"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest block">Background & Ambience Controls</span>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setActiveAmbience('obsidian')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeAmbience === 'obsidian' 
                      ? 'bg-[#181818] border-[#ec6f00]' 
                      : 'bg-[#121212] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Obsidian Slate</span>
                    <span className="w-2 h-2 rounded-full bg-[#ec6f00]"></span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono block">Ember Glow</span>
                </button>

                <button 
                  onClick={() => setActiveAmbience('chimney')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeAmbience === 'chimney' 
                      ? 'bg-[#181818] border-[#ec6f00]' 
                      : 'bg-[#121212] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Chimney Smoke</span>
                    <span className="text-[9px] font-mono font-bold text-[#ec6f00] bg-[#ec6f00]/10 px-1.5 py-0.5 rounded">ACTIVE</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono block">Particle Layer</span>
                </button>

                <button 
                  onClick={() => setActiveAmbience('scrim')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeAmbience === 'scrim' 
                      ? 'bg-[#181818] border-[#ec6f00]' 
                      : 'bg-[#121212] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Scrim Gradient</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono block">Falloff 65%</span>
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#121212] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10">
              <img 
                src={heroImage} 
                alt="Origin Narrative" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono px-1">
              <span>1920 x 1080 px • WebP • 2.4 MB</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="flex items-center justify-center gap-1.5 bg-[#1c1c1c] hover:bg-white/10 py-2 rounded-lg text-[11px] font-mono transition-colors text-gray-300">
                <ImageIcon className="w-3.5 h-3.5 text-[#ec6f00]" /> REPLACE
              </button>
              <button className="flex items-center justify-center gap-1.5 bg-[#1c1c1c] hover:bg-white/10 py-2 rounded-lg text-[11px] font-mono transition-colors text-gray-300">
                <Crop className="w-3.5 h-3.5 text-[#ec6f00]" /> CROP
              </button>
              <button className="flex items-center justify-center gap-1.5 bg-[#1c1c1c] hover:bg-red-500/20 py-2 rounded-lg text-[11px] font-mono transition-colors text-red-400">
                <Trash2 className="w-3.5 h-3.5" /> PURGE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- OUR CULINARY PILLARS ---------------- */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-white/10 pb-3 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-white tracking-wider uppercase">
              <Flame className="w-4 h-4 text-[#ec6f00]" /> Our Culinary Pillars
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-light">
              Three indispensable disciplines that converge inside our Galle sanctuary to ignite uncompromising flavor memory.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[#101010] hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-mono text-gray-300">
              <ArrowUpDown className="w-3 h-3 text-[#ec6f00]" /> REORDER CARDS
            </button>
            <button className="flex items-center gap-1.5 bg-[#101010] hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-mono text-gray-300">
              <Grid className="w-3 h-3 text-[#ec6f00]" /> ICON GLYPHS SELECTOR
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4 relative">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">PILLAR #{pillar.id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                  <div className="w-8 h-4 bg-[#ec6f00] rounded-full p-0.5 flex items-center justify-end">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#121212] p-2.5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#ec6f00]/10 border border-[#ec6f00]/30 flex items-center justify-center text-[#ec6f00]">
                  {pillar.icon === 'flame' && <Flame className="w-4 h-4" />}
                  {pillar.icon === 'pot' && <CloudDrizzle className="w-4 h-4" />}
                  {pillar.icon === 'spice' && <Sparkles className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-mono leading-tight">Icon : {pillar.icon === 'flame' ? 'Flame / Hearth' : pillar.icon === 'pot' ? 'Pot / Steam' : 'Spice Mill'}</p>
                  <button className="text-[10px] text-[#ec6f00] font-bold font-mono hover:underline">Change Glyph</button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-gray-500 font-mono uppercase block mb-1">TITLE</label>
                  <input 
                    type="text" 
                    defaultValue={pillar.title}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs font-serif font-bold text-white focus:outline-none focus:border-[#ec6f00]"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-gray-500 font-mono uppercase block mb-1">EYEBROW</label>
                  <input 
                    type="text" 
                    defaultValue={pillar.eyebrow}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-2 text-[10px] font-mono text-[#ec6f00] tracking-wider focus:outline-none focus:border-[#ec6f00]"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-gray-500 font-mono uppercase block mb-1">DESCRIPTION NARRATIVE</label>
                  <textarea 
                    rows="3"
                    defaultValue={pillar.description}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-[11px] text-gray-300 focus:outline-none focus:border-[#ec6f00] leading-relaxed"
                  />
                </div>

                <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-gray-500 space-y-1">
                  <p>{pillar.subText1}</p>
                  <p>{pillar.subText2}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- THE MASTERS BEHIND THE FLAMES ---------------- */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-end border-b border-white/10 pb-3 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-white tracking-wider uppercase">
              <Flame className="w-4 h-4 text-[#ec6f00]" /> The Masters Behind The Flames
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-light">
              Custodians of ancestral recipes, ironwood hearths, and volcanic spice alchemy.
            </p>
          </div>
          <button className="flex items-center gap-1.5 bg-[#101010] hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-mono text-gray-300">
            <Plus className="w-3.5 h-3.5 text-[#ec6f00]" /> ADD MASTER CHEF
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {chefs.map((chef) => (
            <div key={chef.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex gap-5 items-start relative">
              <div className="relative w-36 h-48 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                <img src={chef.image} alt={chef.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-black/80 border border-white/10 text-[8px] font-mono text-[#ec6f00] px-2 py-0.5 rounded">
                  {chef.badge}
                </span>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{chef.role}</span>
                  <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">● Public</span>
                </div>

                <h3 className="font-serif font-bold text-base text-white">{chef.name}</h3>
                <p className="text-[10px] font-mono text-[#ec6f00] leading-tight">{chef.subtitle}</p>
                <p className="text-[11px] text-gray-400 leading-relaxed font-light">{chef.description}</p>

                <div className="pt-3 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 bg-[#121212] hover:bg-white/10 border border-white/10 py-1.5 rounded-lg text-[10px] font-mono text-gray-300">
                    <Edit3 className="w-3 h-3 text-[#ec6f00]" /> EDIT PROFILE
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 bg-[#121212] hover:bg-white/10 border border-white/10 py-1.5 rounded-lg text-[10px] font-mono text-gray-300">
                    <ImageIcon className="w-3 h-3 text-[#ec6f00]" /> Replace Photo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- SECTION 05 // BOTTOM CALL TO ACTION BANNER ---------------- */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-[#ec6f00] font-mono font-bold text-xs uppercase tracking-widest">Section 05</div>
            <div className="text-gray-500">//</div>
            <h2 className="font-serif font-bold tracking-wider text-base text-white">Bottom Call To Action Banner</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-400 font-mono">Banner Live</span>
            <button 
              onClick={() => setBannerLive(!bannerLive)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${bannerLive ? 'bg-[#ec6f00]' : 'bg-white/20'}`}
            >
              <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${bannerLive ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="text-[9px] text-gray-500 font-mono uppercase block mb-1">BANNER HEADLINE</label>
              <input 
                type="text" 
                value={bannerHeadline} 
                onChange={(e) => setBannerHeadline(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs font-serif font-bold text-white focus:outline-none focus:border-[#ec6f00]"
              />
            </div>

            <div>
              <label className="text-[9px] text-gray-500 font-mono uppercase block mb-1">BANNER SUBTEXT NARRATIVE</label>
              <textarea 
                rows="3"
                value={bannerSubtext}
                onChange={(e) => setBannerSubtext(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-[11px] text-gray-300 focus:outline-none focus:border-[#ec6f00] leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] text-gray-500 font-mono uppercase block mb-1">CTA BUTTON LABEL</label>
                <input 
                  type="text" 
                  value={ctaButtonLabel}
                  onChange={(e) => setCtaButtonLabel(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#ec6f00]"
                />
              </div>
              <div>
                <label className="text-[9px] text-gray-500 font-mono uppercase block mb-1">TARGET LINK / ROUTE</label>
                <input 
                  type="text" 
                  value={targetRoute}
                  onChange={(e) => setTargetRoute(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-[#ec6f00] font-mono focus:outline-none focus:border-[#ec6f00]"
                />
              </div>
            </div>
          </div>

          {/* Live Storefront Preview Box */}
          <div className="md:col-span-5 bg-[#121212] border border-white/10 rounded-2xl p-5 text-center space-y-3">
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block">LIVE STOREFRONT PREVIEW</span>
            <div className="bg-[#050505] border border-white/10 p-6 rounded-xl space-y-3 relative overflow-hidden">
              <h4 className="font-serif font-bold text-sm text-white">{bannerHeadline}</h4>
              <p className="text-[10px] text-gray-400 font-light leading-relaxed">{bannerSubtext}</p>
              <div className="pt-2">
                <span className="bg-[#ec6f00] text-black font-bold text-[9px] px-4 py-2 rounded-lg tracking-wider uppercase inline-block shadow-[0_0_12px_rgba(236,111,0,0.4)]">
                  {ctaButtonLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminAboutContentManagement;