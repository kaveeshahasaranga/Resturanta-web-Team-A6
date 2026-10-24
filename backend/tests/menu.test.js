import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cartLines, price, quoteCart } from '../src/lib/validation.js';

test('cart rejects invalid quantities and IDs, merges duplicates safely', () => {
  for (const quantity of [-1, 0, 1.5, '2', 100]) assert.throws(() => cartLines([{ menuItemId: 1, quantity }]));
  for (const menuItemId of ['1x', -1, 0]) assert.throws(() => cartLines([{ menuItemId, quantity: 1 }]));
  assert.throws(() => cartLines([{ menuItemId: 1, quantity: 60 }, { menuItemId: 1, quantity: 60 }]));
  assert.deepEqual(cartLines([{ menuItemId: 1, quantity: 2 }, { menuItemId: 1, quantity: 3 }]), [{ menuItemId: 1, quantity: 5 }]);
});
test('prices reject negative, infinite, excessive precision and overflow amounts', () => {
  for (const value of [-1, 'NaN', Infinity, '1.234', '100000000', '', null]) assert.throws(() => price(value));
  assert.equal(price('0.00'), '0.00');
});
test('quote uses database prices, flags missing and unavailable dishes, rounds service', async () => {
  const db = { menuItem: { findMany: async () => [{ id: 1, price: '10.05', isAvailable: true }, { id: 2, price: '5.00', isAvailable: false }] } };
  const quote = await quoteCart(db, [{ menuItemId: 1, quantity: 3, price: 0 }]);
  assert.equal(quote.subtotal, '30.15'); assert.equal(quote.serviceCharge, '3.02'); assert.equal(quote.total, '33.17'); assert.equal(quote.canCheckout, true);
  const blocked = await quoteCart(db, [{ menuItemId: 2, quantity: 1 }, { menuItemId: 3, quantity: 1 }]);
  assert.equal(blocked.canCheckout, false); assert.equal(blocked.items[1].item, null);
});
