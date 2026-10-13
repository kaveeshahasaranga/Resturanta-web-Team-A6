import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/10 last:border-0 animate-fade-in">
      {/* Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
        {item.image
          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-fuchsiusWhite text-sm truncate">{item.name}</h4>
        <p className="text-fuchsiusOrange text-sm font-bold mt-0.5">
          ${parseFloat(item.price).toFixed(2)} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQty(item.id, item.quantity - 1)}
          className="w-7 h-7 rounded-md border border-white/20 flex items-center justify-center
                     text-gray-400 hover:border-fuchsiusOrange hover:text-fuchsiusOrange transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQty(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-md border border-white/20 flex items-center justify-center
                     text-gray-400 hover:border-fuchsiusOrange hover:text-fuchsiusOrange transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Line total */}
      <div className="text-right min-w-[60px]">
        <p className="font-bold text-fuchsiusWhite text-sm">
          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-gray-600 hover:text-red-400 transition-colors ml-1"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
