import { useCallback, useEffect, useState } from 'react';
import { ChefHat, Loader2, Pencil, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { chefApi } from '../../services/api.js';

const EMPTY_FORM = { name: '', title: '', bio: '', specialty: '' };

export default function AdminChefsPage() {
  const [chefs, setChefs] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadChefs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await chefApi.getAll();
      setChefs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadChefs(); }, [loadChefs]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setImageFile(null);
    setError('');
  };

  const startEditing = chef => {
    setForm({ name: chef.name, title: chef.title, bio: chef.bio, specialty: chef.specialty });
    setEditingId(chef.id);
    setImageFile(null);
    setError('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const creating = !editingId || editingId === 'new';
      const response = !creating
        ? await chefApi.update(editingId, form)
        : await chefApi.create(form);
      let savedChef = response.data;
      if (creating) {
        setEditingId(savedChef.id);
        setChefs(current => [...current, savedChef].sort((a, b) => a.name.localeCompare(b.name)));
      }
      if (imageFile) {
        const uploadResponse = await chefApi.uploadImage(savedChef.id, imageFile);
        savedChef = uploadResponse.data;
      }

      setChefs(current => {
        const next = !creating
          ? current.map(chef => chef.id === savedChef.id ? savedChef : chef)
          : current.map(chef => chef.id === savedChef.id ? savedChef : chef);
        return next.sort((a, b) => a.name.localeCompare(b.name));
      });
      resetForm();
    } catch (err) {
      await loadChefs();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async chef => {
    if (!window.confirm(`Remove chef "${chef.name}"?`)) return;
    setError('');
    try {
      await chefApi.delete(chef.id);
      setChefs(current => current.filter(item => item.id !== chef.id));
      if (editingId === chef.id) resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveImage = async chef => {
    setError('');
    try {
      const response = await chefApi.removeImage(chef.id);
      setChefs(current => current.map(item => item.id === chef.id ? response.data : item));
      if (editingId === chef.id) setImageFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-serif font-bold">Our Chefs</h1>
        {!editingId && (
          <button onClick={() => { setEditingId('new'); setForm(EMPTY_FORM); setError(''); }}
            className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Chef
          </button>
        )}
      </div>

      {editingId && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editingId === 'new' ? 'Add Chef' : 'Edit Chef'}</h2>
            <button type="button" onClick={resetForm} aria-label="Cancel editing" className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['name', 'Name'],
              ['title', 'Title'],
              ['specialty', 'Specialty'],
            ].map(([field, label]) => (
              <label key={field} className="block text-sm text-gray-400">
                {label}
                <input required maxLength={191} value={form[field]}
                  onChange={event => setForm(current => ({ ...current, [field]: event.target.value }))}
                  className="input-field mt-1" />
              </label>
            ))}
            <label className="block text-sm text-gray-400 sm:col-span-2">
              Biography
              <textarea required maxLength={10000} rows={4} value={form.bio}
                onChange={event => setForm(current => ({ ...current, bio: event.target.value }))}
                className="input-field mt-1 resize-y" />
            </label>
            <label className="block text-sm text-gray-400 sm:col-span-2">
              Profile image (JPEG, PNG or WebP; up to 5 MB)
              <input key={editingId} type="file" accept="image/jpeg,image/png,image/webp"
                onChange={event => setImageFile(event.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-400 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-gray-200" />
              {editingId !== 'new' && chefs.find(chef => chef.id === editingId)?.image && (
                <img src={chefs.find(chef => chef.id === editingId).image} alt="Current chef profile"
                  className="mt-3 h-20 w-20 rounded-full object-cover" />
              )}
            </label>
          </div>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Chef'}
          </button>
        </form>
      )}

      {error && !editingId && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-fuchsiusOrange" /></div>
      ) : chefs.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No chefs added yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {chefs.map(chef => (
            <div key={chef.id} className="card flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-800">
                {chef.image
                  ? <img src={chef.image} alt={chef.name} className="h-full w-full object-cover" />
                  : <ChefHat className="h-8 w-8 text-fuchsiusOrange" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-fuchsiusWhite">{chef.name}</h3>
                <p className="text-xs font-medium text-fuchsiusOrange">{chef.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{chef.bio}</p>
                <p className="mt-1 text-xs text-gray-600">Specialty: {chef.specialty}</p>
                <div className="mt-3 flex gap-3">
                  <button onClick={() => startEditing(chef)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  {chef.image && (
                    <button onClick={() => handleRemoveImage(chef)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-400">
                      <Upload className="h-3.5 w-3.5" /> Remove image
                    </button>
                  )}
                  <button onClick={() => handleDelete(chef)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
