import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UploadCloud, Save, Loader2, ImageIcon, X } from 'lucide-react';
import { menuApi, categoryApi } from '../../services/api.js';

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
function ImageZone({ value, onChange, onFile }) {
  return <div className="space-y-4">
    {value && <img src={value} alt="Dish preview" className="w-full h-56 object-cover" />}
    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { alert('Image must be smaller than 5 MB'); return; }
      onFile(file);
    }} />
    <p className="text-xs text-gray-400">JPEG, PNG or WebP, up to 5 MB.</p>
    <input className={inputCls} value={value.startsWith('blob:') ? '' : value} onChange={e => onChange(e.target.value)} placeholder="Or paste an image URL" />
    <button type="button" onClick={() => onChange('')} className="text-red-400 text-sm">Remove image</button>
  </div>;
}

const EMPTY = {
  name: '', description: '', price: '',
  category: 'MAIN_COURSE', image: '', isAvailable: true,
};

export default function AdminMenuForm() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [preview, setPreview] = useState('');
  useEffect(() => { categoryApi.getAll().then(res => setCategories(res.data)).catch(err => setError(err.message)); }, []);
  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
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
      const payload = { ...form, price: form.price };
      // Uploaded image paths are retained server-side; upload separately as multipart.
      if (file || payload.image?.startsWith('/uploads/menu/')) delete payload.image;
      const target = id || savedId;
      const res = target ? await menuApi.update(target, payload) : await menuApi.create(payload);
      setSavedId(res.data.id);
      if (file) await menuApi.uploadImage(res.data.id, file);
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
                    {categories.map(({ code: value, name: label }) => (
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
              <ImageZone onFile={setFile}
                value={preview || form.image}
                onChange={(val) => { setFile(null); setForm(f => ({ ...f, image: val })); }}
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
