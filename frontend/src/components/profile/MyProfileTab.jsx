import React, { useState } from 'react';
import {
  Pencil,
  Check,
  User,
  AtSign,
  Phone,
  Building2,
  MapPin,
  Utensils,
  ShieldCheck,
  Bell,
  Sparkles,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export default function MyProfileTab({ profile, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || 'Thrishala Weerasekara',
    email: profile?.email || 'thrishala@example.lk',
    phone: profile?.phone || '077 123 4567',
    city: profile?.city || 'Colombo',
    address: profile?.address || '45 Temple Road, Colombo 05',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        city: profile.city || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || 'Thrishala Weerasekara',
      email: profile?.email || 'thrishala@example.lk',
      phone: profile?.phone || '077 123 4567',
      city: profile?.city || 'Colombo',
      address: profile?.address || '45 Temple Road, Colombo 05',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─── Header Section ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-[#e66200]" />
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#e66200] font-medium">
              PATRON DOSSIER · REGISTRY 0492
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-wide">
            My Profile
          </h1>
          <p className="text-neutral-400 text-xs sm:text-[13px] mt-1.5 font-sans leading-relaxed">
            Manage your personal details, dining coordinates, and account preferences.
          </p>
        </div>

        {/* Top Right Header Controls */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181b] border border-white/10 text-xs text-neutral-300 font-sans">
            <span className={`w-1.5 h-1.5 rounded-full ${isEditing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-[11px] font-medium tracking-wide">
              {isEditing ? 'EDITING MODE' : 'VIEWING DETAILS'}
            </span>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18181c] border border-white/10 text-xs font-medium text-white hover:border-[#e66200] hover:text-[#e66200] transition-colors duration-200 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>EDIT PROFILE</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-2 rounded-lg bg-[#18181c] border border-white/10 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e66200] text-white text-xs font-semibold hover:bg-orange-600 transition-colors shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>SAVE CHANGES</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-slide-down">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Patron coordinates successfully updated and synchronized with registry.</span>
        </div>
      )}

      {/* ─── Profile Details Card ─── */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Patron Hero Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pb-7 mb-7 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-[#1b1a1f] border border-white/10 flex items-center justify-center shadow-inner">
                <span className="font-serif text-xl font-medium tracking-wider text-[#d4af37]">
                  TW
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#e66200] rounded-sm shadow-sm" />
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-white tracking-wide">
                {formData.name}
              </h2>
              <p className="text-[11px] font-sans tracking-[0.16em] uppercase text-neutral-400 mt-0.5">
                PRIVATE DINING TIER · COLOMBO SALON
              </p>
            </div>
          </div>

          {/* Epicure Badges */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#e66200] text-xs font-medium tracking-wide">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-semibold text-[11px] tracking-wider uppercase">VERIFIED EPICURE</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#e66200] text-xs font-medium tracking-wide">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="font-semibold text-[11px] tracking-wider uppercase">PATRON SINCE 2023</span>
            </div>
          </div>
        </div>

        {/* ─── Profile Form Fields ─── */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-2">
                FULL NAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full bg-[#1a1a1e] border rounded-lg px-4 py-3 text-sm text-white pr-10 font-sans transition-all duration-200 ${
                    isEditing
                      ? 'border-[#e66200]/50 focus:border-[#e66200] focus:ring-1 focus:ring-[#e66200] bg-[#1e1e23]'
                      : 'border-white/[0.08] cursor-default'
                  }`}
                />
                <User className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full bg-[#1a1a1e] border rounded-lg px-4 py-3 text-sm text-white pr-10 font-sans transition-all duration-200 ${
                    isEditing
                      ? 'border-[#e66200]/50 focus:border-[#e66200] focus:ring-1 focus:ring-[#e66200] bg-[#1e1e23]'
                      : 'border-white/[0.08] cursor-default'
                  }`}
                />
                <AtSign className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-2">
                PHONE NUMBER
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full bg-[#1a1a1e] border rounded-lg px-4 py-3 text-sm text-white pr-10 font-sans transition-all duration-200 ${
                    isEditing
                      ? 'border-[#e66200]/50 focus:border-[#e66200] focus:ring-1 focus:ring-[#e66200] bg-[#1e1e23]'
                      : 'border-white/[0.08] cursor-default'
                  }`}
                />
                <Phone className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-2">
                CITY
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={`w-full bg-[#1a1a1e] border rounded-lg px-4 py-3 text-sm text-white pr-10 font-sans transition-all duration-200 ${
                    isEditing
                      ? 'border-[#e66200]/50 focus:border-[#e66200] focus:ring-1 focus:ring-[#e66200] bg-[#1e1e23]'
                      : 'border-white/[0.08] cursor-default'
                  }`}
                />
                <Building2 className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Default Delivery Address */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
                DEFAULT DELIVERY ADDRESS
              </label>
              <span className="text-[10px] font-mono tracking-wider text-[#e66200] font-medium">
                PRIMARY PRIVATE DISPATCH
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                disabled={!isEditing}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={`w-full bg-[#1a1a1e] border rounded-lg px-4 py-3 text-sm text-white pr-10 font-sans transition-all duration-200 ${
                  isEditing
                    ? 'border-[#e66200]/50 focus:border-[#e66200] focus:ring-1 focus:ring-[#e66200] bg-[#1e1e23]'
                    : 'border-white/[0.08] cursor-default'
                }`}
              />
              <MapPin className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </form>
      </div>

      {/* ─── 3 Feature / Perk Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Curated Pairings */}
        <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-5 hover:border-[#e66200]/30 transition-colors duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-[#e66200]/10 text-[#e66200] shrink-0">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-white font-sans">
                CURATED PAIRINGS
              </h3>
              <p className="text-neutral-400 text-xs mt-1.5 font-sans leading-relaxed">
                Spices and cellar reserves customized for Colombo 05 tasting menus.
              </p>
            </div>
          </div>
        </div>

        {/* Discretion Assured */}
        <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-5 hover:border-[#e66200]/30 transition-colors duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-[#e66200]/10 text-[#e66200] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-white font-sans">
                DISCRETION ASSURED
              </h3>
              <p className="text-neutral-400 text-xs mt-1.5 font-sans leading-relaxed">
                Patron dining addresses are dispatched strictly through encrypted staff routing.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Maître D' */}
        <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-5 hover:border-[#e66200]/30 transition-colors duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-[#e66200]/10 text-[#e66200] shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-white font-sans">
                PERSONAL MAÎTRE D'
              </h3>
              <p className="text-neutral-400 text-xs mt-1.5 font-sans leading-relaxed">
                Direct communication active for bespoke table requests and private banquets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
