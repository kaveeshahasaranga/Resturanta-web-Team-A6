<<<<<<< HEAD
import React from 'react';
export default function AdminMenuForm() {
  return <div className="text-white">Admin Menu Form</div>;
=======
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { menuApi } from '../../services/api.js';

const CATEGORIES = ['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'SPECIAL'];

const EMPTY_FORM = {
  name: '', description: '', price: '', category: 'MAIN_COURSE', image: '', isAvailable: true,
};

export default function AdminMenuForm() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEditing  = Boolean(id);

  const [form, setForm]     = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError]   = useState('');

  // Load existing item when editing
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

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await menuApi.update(id, { ...form, price: parseFloat(form.price) });
      } else {
        await menuApi.create({ ...form, price: parseFloat(form.price) });
      }
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
        <Loader2 className="w-8 h-8 text-fuchsiusOrange animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/menu" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold">{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEditing ? 'Update the details below' : 'Fill in the details to add a new dish'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5" htmlFor="name">Dish Name *</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange}
            placeholder="e.g. Grilled Salmon Fillet" className="input-field" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5" htmlFor="description">Description *</label>
          <textarea id="description" name="description" rows={3} required value={form.description}
            onChange={handleChange} placeholder="Describe the dish..." className="input-field resize-none" />
        </div>

        {/* Price + Category row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="price">Price (USD) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input id="price" name="price" type="number" step="0.01" min="0" required
                value={form.price} onChange={handleChange} className="input-field pl-7" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="category">Category *</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}
              className="input-field appearance-none cursor-pointer">
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5" htmlFor="image">Image URL</label>
          <input id="image" name="image" type="url" value={form.image} onChange={handleChange}
            placeholder="https://example.com/image.jpg" className="input-field" />
          {form.image && (
            <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-white/10">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }} />
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-3">
          <input id="isAvailable" name="isAvailable" type="checkbox" checked={form.isAvailable}
            onChange={handleChange}
            className="w-4 h-4 rounded border-white/20 bg-neutral-900 accent-fuchsiusOrange cursor-pointer" />
          <label htmlFor="isAvailable" className="text-sm text-gray-300 cursor-pointer">
            Item is available for ordering
          </label>
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Item'}
          </button>
          <Link to="/admin/menu" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
}
