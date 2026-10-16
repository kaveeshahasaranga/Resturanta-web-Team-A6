import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UploadCloud, Save, Loader2, ImageIcon, X } from 'lucide-react';
import { menuApi } from '../../services/api.js';

// ─── Category options with luxury labels ──────────────────────────────────────
const CATEGORIES = [
  { value: 'APPETIZER',   label: 'Raw Bar Selection' },
  { value: 'MAIN_COURSE', label: 'Signature Mains' },
  { value: 'SPECIAL',     label: "Chef's Tasting" },
  { value: 'DESSERT',     label: 'Patisserie' },
  { value: 'BEVERAGE',    label: 'Cellar & Pairings' },
];

// ─── Small field label ─────────────────────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[9px] font-bold tracking-[0.22em] uppercase
                    text-gray-500 mb-2">
    {children}
    {required && <span className="text-fuchsiusOrange ml-1">*</span>}
  </label>
);

// ─── Shared input class ───────────────────────────────────────────────────────
const inputCls = `w-full bg-[#0a0a0a] border border-white/[0.12] text-gray-200
                  placeholder-gray-700 text-[12px] px-3.5 py-2.5
                  focus:outline-none focus:border-fuchsiusOrange/60
                  transition-colors duration-200`;

// ─── Image Upload / URL Zone ──────────────────────────────────────────────────
function ImageZone({ value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [showUrl,  setShowUrl]  = useState(false);
  const inputRef = useRef(null);

  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = ()    => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    // If a file is dropped we'd normally upload — here we read as data URL for preview
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => onChange(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onChange(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {value ? (
        /* ── Preview ─────────────────────────────────────────────────── */
        <div className="relative flex-1 min-h-[200px] bg-[#0a0a0a]
                        border border-white/[0.12]">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            style={{ minHeight: 200 }}
            onError={(e) => { e.target.style.display='none'; }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white
                       flex items-center justify-center hover:bg-red-500/80
                       transition-colors duration-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* ── Drop zone ───────────────────────────────────────────────── */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex-1 min-h-[200px] flex flex-col items-center justify-center
                      border cursor-pointer transition-all duration-200
                      ${dragging
                        ? 'border-fuchsiusOrange bg-fuchsiusOrange/5'
                        : 'border-dashed border-white/[0.15] hover:border-white/30'
                      }`}
        >
          <UploadCloud
            className={`w-8 h-8 mb-3 transition-colors duration-200
                        ${dragging ? 'text-fuchsiusOrange' : 'text-fuchsiusOrange/60'}`}
          />
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase
                        text-gray-600 text-center">
            DRAG AND DROP OR BROWSE FILES
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}

      {/* URL fallback toggle */}
      <button
        type="button"
        onClick={() => setShowUrl(v => !v)}
        className="mt-2 text-[9px] text-gray-700 hover:text-gray-400
                   tracking-widest uppercase transition-colors duration-200 self-start"
      >
        {showUrl ? '− Hide URL' : '+ Paste image URL instead'}
      </button>

      {showUrl && (
        <div className="mt-2">
          <input
            type="url"
            value={value.startsWith('http') ? value : ''}
            onChange={e => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={inputCls}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
const EMPTY = {
  name: '', description: '', price: '',
  category: 'MAIN_COURSE', image: '', isAvailable: true,
};

export default function AdminMenuForm() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const isEditing = Boolean(id);

  const [form,     setForm]     = useState(EMPTY);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error,    setError]    = useState('');

  // Pre-fill when editing
  useEffect(() => {
    if (!isEditing) return;
    menuApi.getById(id)
      .then(res => setForm({
        name:        res.data.name,
        description: res.data.description,
        price:       res.data.price.toString(),
        category:    res.data.category,
        image:       res.data.image || '',
        isAvailable: res.data.isAvailable,
      }))
      .catch(err => setError(err.message))
      .finally(() => setFetching(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      setError('Dish title, tariff, and category are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (isEditing) await menuApi.update(id, payload);
      else           await menuApi.create(payload);
      navigate('/admin/menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-7 h-7 text-fuchsiusOrange animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">

      {/* ── Page title ───────────────────────────────────────────────────── */}
      <h1 className="text-[28px] md:text-[34px] font-semibold text-fuchsiusWhite mb-7">
        Add&nbsp;/&nbsp;Edit Menu Item
      </h1>

      <form onSubmit={handleSubmit}>

        {/* ── Two-column cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 mb-8">

          {/* ── Card 01: Culina Specifications ─────────────────────────────── */}
          <div className="border border-white/[0.1] bg-[#0e0e0e] p-6">
            {/* Card number */}
            <p className="text-[9px] font-bold tracking-[0.28em] uppercase
                          text-gray-600 mb-5">
              01.&nbsp;CULINA SPECIFICATIONS
            </p>

            <div className="space-y-5">
              {/* Dish title */}
              <div>
                <FieldLabel required>DISH TITLE &amp; ATELIER NOMENCLATURE</FieldLabel>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Smoked Jaffna Black Pork Curry"
                  className={inputCls}
                  required
                />
              </div>

              {/* Category + Price row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>GASTRONOMY CATEGORY</FieldLabel>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`${inputCls} appearance-none cursor-pointer`}
                  >
                    {CATEGORIES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel required>TARIFF (Rs)</FieldLabel>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="34.00"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <FieldLabel>DESCRIPTION &amp; PROVENANCE LEDGER</FieldLabel>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Detailed culinary notes, heirloom spice profiles, artisan techniques, and source heritage..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Availability toggle */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  id="isAvailable"
                  name="isAvailable"
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 accent-fuchsiusOrange cursor-pointer"
                />
                <label htmlFor="isAvailable"
                  className="text-[10px] font-semibold tracking-[0.16em]
                             uppercase text-gray-500 cursor-pointer">
                  Mark as Available for Service
                </label>
              </div>
            </div>
          </div>

          {/* ── Card 02: Visual Master Asset ───────────────────────────────── */}
          <div className="border border-white/[0.1] bg-[#0e0e0e] p-6 flex flex-col">
            {/* Card number */}
            <p className="text-[9px] font-bold tracking-[0.28em] uppercase
                          text-gray-600 mb-5">
              02.&nbsp;VISUAL MASTER ASSET
            </p>

            <div className="flex-1">
              <ImageZone
                value={form.image}
                onChange={(val) => setForm(f => ({ ...f, image: val }))}
              />
            </div>

            {/* Image guidance */}
            <p className="mt-3 text-[9px] text-gray-700 leading-relaxed tracking-wide">
              Recommended: 800×600px or larger · JPG / PNG / WEBP · Max 5 MB
            </p>
          </div>
        </div>

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {error && (
          <p className="text-red-400 text-[12px] mb-4 border border-red-400/20
                        bg-red-500/5 px-4 py-2.5">
            {error}
          </p>
        )}

        {/* ── Bottom action bar ─────────────────────────────────────────────── */}
        <div className="border-t border-white/[0.07] pt-5 flex items-center
                        justify-end gap-3">
          <Link
            to="/admin/menu"
            className="px-6 py-2.5 border border-white/20 text-gray-400
                       hover:border-white/40 hover:text-white text-[10px]
                       font-bold tracking-[0.18em] uppercase
                       transition-colors duration-200"
          >
            CANCEL
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2.5 bg-fuchsiusOrange
                       hover:bg-orange-500 text-white text-[10px] font-bold
                       tracking-[0.15em] uppercase px-7 py-2.5
                       transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Save className="w-3.5 h-3.5" />
            }
            {loading ? 'SAVING...' : 'SAVE / UPDATE MENU ITEM'}
          </button>
        </div>
      </form>
    </div>
  );
}
