import { useEffect, useState } from 'react';
import { Loader2, Trash2, ChefHat } from 'lucide-react';
import { chefApi } from '../../services/api.js';

export default function AdminChefsPage() {
  const [chefs,   setChefs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chefApi.getAll()
      .then(res => setChefs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove chef "${name}"?`)) return;
    try {
      await chefApi.delete(id);
      setChefs(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-serif font-bold mb-6">Our Chefs</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-fuchsiusOrange animate-spin" />
        </div>
      ) : chefs.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No chefs added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {chefs.map(chef => (
            <div key={chef.id} className="card flex gap-4">
              <div className="w-16 h-16 rounded-full bg-neutral-800 shrink-0 overflow-hidden flex items-center justify-center">
                {chef.image
                  ? <img src={chef.image} alt={chef.name} className="w-full h-full object-cover" />
                  : <ChefHat className="w-8 h-8 text-fuchsiusOrange" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-fuchsiusWhite">{chef.name}</h3>
                <p className="text-fuchsiusOrange text-xs font-medium">{chef.title}</p>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{chef.bio}</p>
                <p className="text-gray-600 text-xs mt-1">Specialty: {chef.specialty}</p>
              </div>
              <button onClick={() => handleDelete(chef.id, chef.name)}
                className="self-start text-gray-600 hover:text-red-400 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
