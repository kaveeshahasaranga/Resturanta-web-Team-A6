<<<<<<< HEAD
import React from 'react';
export default function AdminMenuPage() {
  return <div className="text-white">Admin Menu Management</div>;
=======
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { menuApi } from '../../services/api.js';

const CATEGORY_LABELS = {
  APPETIZER: 'Appetizer', MAIN_COURSE: 'Main Course',
  DESSERT: 'Dessert', BEVERAGE: 'Beverage', SPECIAL: 'Special',
};

export default function AdminMenuPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchItems = () => {
    setLoading(true);
    menuApi.getAll()
      .then(res => setItems(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchItems, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await menuApi.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggle = async (item) => {
    try {
      const updated = await menuApi.update(item.id, { isAvailable: !item.isAvailable });
      setItems(prev => prev.map(i => i.id === item.id ? updated.data : i));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold">Menu Items</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link to="/admin/menu/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-fuchsiusOrange animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/3">
                  {['Image', 'Name', 'Category', 'Price', 'Available', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors
                      ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}
                  >
                    {/* Image */}
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-800 overflow-hidden">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          : <span className="flex items-center justify-center h-full text-lg">🍽️</span>
                        }
                      </div>
                    </td>
                    {/* Name */}
                    <td className="px-5 py-3 font-medium text-fuchsiusWhite">{item.name}</td>
                    {/* Category */}
                    <td className="px-5 py-3">
                      <span className="badge bg-fuchsiusOrange/10 text-fuchsiusOrange border border-fuchsiusOrange/20">
                        {CATEGORY_LABELS[item.category]}
                      </span>
                    </td>
                    {/* Price */}
                    <td className="px-5 py-3 text-green-400 font-semibold">
                      ${parseFloat(item.price).toFixed(2)}
                    </td>
                    {/* Toggle */}
                    <td className="px-5 py-3">
                      <button onClick={() => handleToggle(item)} title="Toggle availability"
                        className={`transition-colors ${item.isAvailable ? 'text-green-400 hover:text-green-300' : 'text-gray-600 hover:text-gray-400'}`}>
                        {item.isAvailable
                          ? <ToggleRight className="w-6 h-6" />
                          : <ToggleLeft  className="w-6 h-6" />
                        }
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/menu/edit/${item.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-fuchsiusOrange hover:bg-fuchsiusOrange/10 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <p className="text-center text-gray-500 py-12">No menu items yet. Add one!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
>>>>>>> f9cef1f (add MenuPage component with menu fetching, filtering, and search functionality)
}
