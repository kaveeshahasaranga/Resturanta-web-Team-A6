export const fail = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });
export function id(value) {
  if (!/^[1-9]\d*$/.test(String(value)) || !Number.isSafeInteger(Number(value))) throw fail('Invalid item ID');
  return Number(value);
}
export function text(value, field, max = 10000) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw fail(`${field} is required (maximum ${max} characters)`);
  return value.trim();
}
export function price(value) {
  if (!/^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/.test(String(value))) throw fail('Price must be a non-negative amount with at most two decimal places');
  return String(value);
}
export function boolean(value) {
  if (typeof value !== 'boolean') throw fail('isAvailable must be true or false');
  return value;
}
export function cartLines(items) {
  if (!Array.isArray(items) || !items.length || items.length > 100) throw fail('Cart must contain 1–100 items');
  const lines = new Map();
  for (const item of items) {
    if (!item || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) throw fail('Quantity must be an integer between 1 and 99');
    const menuItemId = id(item.menuItemId);
    const quantity = (lines.get(menuItemId) || 0) + item.quantity;
    if (quantity > 99) throw fail('Maximum quantity per dish is 99');
    lines.set(menuItemId, quantity);
  }
  return [...lines].map(([menuItemId, quantity]) => ({ menuItemId, quantity }));
}
export const includeCategory = { categoryInfo: true };
export const publicItem = item => ({ ...item, categoryName: item.categoryInfo?.name || item.category });
export async function quoteCart(db, items) {
  const lines = cartLines(items);
  const menu = await db.menuItem.findMany({ where: { id: { in: lines.map(i => i.menuItemId) }, deletedAt: null }, include: includeCategory });
  const quoted = lines.map(line => {
    const found = menu.find(i => i.id === line.menuItemId);
    const unitCents = found ? Math.round(Number(found.price) * 100) : 0;
    return { ...line, item: found ? publicItem(found) : null, isAvailable: Boolean(found?.isAvailable), unitPrice: (unitCents / 100).toFixed(2), totalPrice: (unitCents * line.quantity / 100).toFixed(2) };
  });
  const subtotalCents = quoted.reduce((sum, i) => sum + Math.round(Number(i.totalPrice) * 100), 0);
  if (subtotalCents > 9090909000) throw fail('Order total exceeds the maximum supported amount');
  const serviceCents = Math.round(subtotalCents * 0.10);
  return { items: quoted, canCheckout: quoted.every(i => i.isAvailable), subtotal: (subtotalCents / 100).toFixed(2), serviceCharge: (serviceCents / 100).toFixed(2), total: ((subtotalCents + serviceCents) / 100).toFixed(2) };
}
