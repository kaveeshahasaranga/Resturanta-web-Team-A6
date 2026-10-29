import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { contactApi } from '../../services/api.js';

const EMPTY_SETTINGS = { name: '', address: '', email: '', phone: '', mapUrl: '' };

export default function AdminRestaurantSettingsPage() {
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    contactApi.getSettings()
      .then(response => {
        if (active) setSettings(response.data);
      })
      .catch(err => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleChange = event => {
    setSettings(current => ({ ...current, [event.target.name]: event.target.value }));
    setSuccess('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await contactApi.updateSettings(settings);
      setSettings(current => ({ ...current, ...response.data, mapUrl: response.data.mapUrl || '' }));
      setSuccess('Restaurant contact and map details saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const previewMapUrl = settings.mapUrl || (() => {
    const url = new URL('https://www.google.com/maps/search/');
    url.searchParams.set('api', '1');
    url.searchParams.set('query', settings.address);
    return url.toString();
  })();

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-fuchsiusOrange" /></div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="mb-2 text-2xl font-serif font-bold">Restaurant Contact & Map</h1>
      <p className="mb-6 text-sm text-gray-500">These details are shown on the public website and contact endpoints.</p>
      {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
      {success && <p role="status" className="mb-4 text-sm text-green-400">{success}</p>}
      <form onSubmit={handleSubmit} className="card max-w-3xl space-y-4">
        <label className="block text-sm text-gray-400">
          Restaurant name
          <input required maxLength={191} name="name" value={settings.name} onChange={handleChange} className="input-field mt-1" />
        </label>
        <label className="block text-sm text-gray-400">
          Address
          <textarea required maxLength={500} rows={3} name="address" value={settings.address} onChange={handleChange}
            className="input-field mt-1 resize-y" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-gray-400">
            Contact email
            <input required type="email" maxLength={191} name="email" value={settings.email} onChange={handleChange}
              className="input-field mt-1" />
          </label>
          <label className="block text-sm text-gray-400">
            Phone
            <input required maxLength={50} name="phone" value={settings.phone} onChange={handleChange}
              className="input-field mt-1" />
          </label>
        </div>
        <label className="block text-sm text-gray-400">
          Google Maps URL (optional)
          <input type="url" maxLength={1000} name="mapUrl" value={settings.mapUrl || ''} onChange={handleChange}
            placeholder="Leave blank to build a Maps search from the address" className="input-field mt-1" />
        </label>
        <a href={previewMapUrl} target="_blank" rel="noreferrer" className="inline-block text-sm text-fuchsiusOrange hover:text-orange-300">
          Preview map link
        </a>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save details'}
        </button>
      </form>
    </div>
  );
}
