import { useEffect, useState } from 'react';
import { categoryApi } from '../../services/api.js';
const empty = { name: '', code: '', description: '' };
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = async () => { const res = await categoryApi.getAll(); setCategories(res.data); };
  useEffect(() => { load().catch(e => setError(e.message)).finally(() => setLoading(false)); }, []);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try { if (editing) await categoryApi.update(editing, form); else await categoryApi.create(form); setForm(empty); setEditing(null); await load(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function remove(c) {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    setBusy(true); setError('');
    try { await categoryApi.delete(c.id); await load(); if (editing === c.id) { setEditing(null); setForm(empty); } }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <div className="space-y-6 text-white max-w-4xl">
    <h1 className="text-3xl font-serif">Menu Categories</h1>
    <p className="text-sm text-gray-400">Create categories and assign dishes to them. Categories in use cannot be deleted.</p>
    {error && <p role="alert" className="text-red-400">{error}</p>}
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 p-5 border border-white/10">
      {['name', 'code', 'description'].map(key => <label key={key} className="text-sm capitalize">{key}
        <input required={key !== 'description'} maxLength={key === 'code' ? 64 : key === 'name' ? 100 : 10000} pattern={key === 'code' ? '[A-Z][A-Z0-9_]*' : undefined} value={form[key]} onChange={e => setForm({ ...form, [key]: key === 'code' ? e.target.value.toUpperCase() : e.target.value })} className="block w-full mt-2 p-3 bg-neutral-900 border border-white/20" />
      </label>)}
      <div className="flex gap-4 items-end"><button disabled={busy} className="bg-orange-600 px-5 py-3 disabled:opacity-50">{editing ? 'Save changes' : 'Add category'}</button>
      {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}</div>
    </form>
    {loading ? <p>Loading categories…</p> : categories.length === 0 ? <p>No categories yet.</p> : categories.map(c => <div key={c.id} className="flex flex-wrap gap-4 items-center border-b border-white/10 py-4">
      <div className="flex-1"><h2>{c.name}</h2><p className="text-xs text-gray-400">{c.code} · {c.description}</p></div>
      <button disabled={busy} onClick={() => { setEditing(c.id); setForm({ name: c.name, code: c.code, description: c.description || '' }); }}>Edit</button>
      <button disabled={busy} onClick={() => remove(c)} className="text-red-400">Delete</button>
    </div>)}
  </div>;
}
