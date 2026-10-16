import { useEffect, useState } from 'react';
import { Loader2, Trash2, ChefHat } from 'lucide-react';
import { chefApi } from '../../services/api.js';

const MOCK_CHEFS = [
  {
    id: 'chef-1',
    name: 'Chef Nalaka Perera',
    title: 'Executive Head Chef',
    bio: 'Over 18 years of mastery in traditional Sri Lankan clay-pot cuisine, charcoal hearth techniques, and modern artisanal gastronomy.',
    specialty: 'Charcoal Hearth & Black Pork Curry',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80',
  },
  {
    id: 'chef-2',
    name: 'Chef Amaya Jayawardena',
    title: 'Pastry & Patisserie Chef',
    bio: 'Trained in Paris and Colombo, specialising in fire-kissed desserts, cacao artistry, and Ceylon spice-infused confections.',
    specialty: 'Valrhona Chocolate & Ceylon Spice Desserts',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&q=80',
  },
  {
    id: 'chef-3',
    name: 'Chef Dilan Samarawickrama',
    title: 'Seafood & Raw Bar Specialist',
    bio: 'Expert in coastal Sri Lankan seafood traditions — from Jaffna crab curry to modern crudo presentations with Ceylon spice oils.',
    specialty: 'Raw Bar, Caviar & Coastal Seafood',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=200&q=80',
  },
];

export default function AdminChefsPage() {
  const [chefs,   setChefs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chefApi.getAll()
      .then(res => {
        const list = Array.isArray(res) ? res : (res.data ?? res);
        setChefs(list.length > 0 ? list : MOCK_CHEFS);
      })
      .catch(() => setChefs(MOCK_CHEFS))
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
