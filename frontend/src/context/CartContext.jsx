import { cartApi } from '../services/api.js';
import { createContext, useContext, useReducer, useCallback, useState, useEffect } from 'react';

const CartContext = createContext(null);

// ─── Reducer ─────────────────────────────────────────────────────────────────
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SYNC': return { items: state.items.map(old => { const line = action.payload.find(i => i.menuItemId === old.id); return line ? { ...old, ...(line.item || {}), isAvailable: line.isAvailable, quantity: old.quantity } : old; }) };
    case 'ADD_ITEM': {
      if (!Number.isInteger(action.payload.id) || !action.payload.isAvailable) return state;
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: Math.min(99, i.quantity + 1) } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (!Number.isInteger(action.payload.quantity) || action.payload.quantity > 99) return state;
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

// ─── Provider ────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, () => {
    try { const items = JSON.parse(localStorage.getItem('fuchsius_cart') || '[]'); return { items: Array.isArray(items) ? items.filter(i => Number.isInteger(i.id) && Number.isInteger(i.quantity) && i.quantity > 0 && i.quantity <= 99 && Number.isFinite(Number(i.price))) : [] }; }
    catch { return { items: [] }; }
  });

  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState('');
  const [checking, setChecking] = useState(false);
  const signature = JSON.stringify(state.items.map(i => ({ menuItemId: i.id, quantity: i.quantity })));
  useEffect(() => { localStorage.setItem('fuchsius_cart', JSON.stringify(state.items)); }, [state.items]);
  const refreshCart = useCallback(async () => {
    if (signature === '[]') { setQuote(null); return null; }
    setChecking(true); setQuoteError('');
    try {
      const res = await cartApi.quote(JSON.parse(signature));
      setQuote({ ...res.data, signature }); dispatch({ type: 'SYNC', payload: res.data.items });
      return res.data;
    } catch (err) { setQuoteError(err.message); setQuote(null); throw err; }
    finally { setChecking(false); }
  }, [signature]);
  useEffect(() => {
    refreshCart().catch(() => {});
    const onFocus = () => refreshCart().catch(() => {});
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshCart]);
  const canCheckout = !checking && !quoteError && quote?.signature === signature && quote?.canCheckout;
  const addItem      = useCallback((item) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const removeItem   = useCallback((id)   => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
  const updateQty    = useCallback((id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }), []);
  const clearCart    = useCallback(()     => dispatch({ type: 'CLEAR_CART' }), []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const total     = state.items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, itemCount, total, quote, checking, quoteError, canCheckout, refreshCart, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
