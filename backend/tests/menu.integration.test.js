import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const url = process.env.TEST_DATABASE_URL;
test('menu/category/cart/order/image API lifecycle with real MySQL', { skip: !url }, async t => {
  assert.match(url, /\/[^/?]*_test(?:\?|$)/, 'Use a dedicated database ending in _test');
  process.env.DATABASE_URL = url;
  process.env.JWT_SECRET = 'isolated-integration-test-secret';
  process.env.NODE_ENV = 'test';
  const { createApp, prisma } = await import('../src/app.js');
  const db = new PrismaClient({ datasources: { db: { url } } });
  const server = createApp(db).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  let token, dish, category, order, user;
  const stamp = Date.now();
  async function call(path, { method = 'GET', body, auth = false, status = 200 } = {}) {
    const headers = { ...(auth ? { Authorization: `Bearer ${token}` } : {}) };
    if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
    const res = await fetch(base + path, { method, headers, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
    const data = await res.json();
    assert.equal(res.status, status, JSON.stringify(data));
    return data.data;
  }
  try {
    user = await db.user.create({ data: { name: 'API Test Admin', email: `test-${stamp}@example.com`, password: await bcrypt.hash('test-password', 4), role: 'ADMIN' } });
    token = (await call('/auth/login', { method: 'POST', body: { email: user.email, password: 'test-password' } })).token;
    await t.test('writes require admin authentication', async () => {
      await call('/menu', { method: 'POST', body: {}, status: 401 });
      await call('/categories', { method: 'POST', body: {}, status: 401 });
      await call('/menu/1/availability', { method: 'PATCH', body: { isAvailable: false }, status: 401 });
    });
    await t.test('category create/edit/duplicate validation', async () => {
      category = await call('/categories', { method: 'POST', auth: true, status: 201, body: { name: 'Test Category', code: `TEST_${stamp}` } });
      await call('/categories', { method: 'POST', auth: true, status: 409, body: { name: 'Duplicate', code: category.code } });
      category = await call(`/categories/${category.id}`, { method: 'PUT', auth: true, body: { name: 'Renamed Category' } });
      assert.equal(category.name, 'Renamed Category');
    });
    await t.test('create dish, filter, detail and validate bad prices', async () => {
      const body = { name: 'Test Dish', description: 'Integration test', price: '10.05', category: category.code, isAvailable: true };
      await call('/menu', { method: 'POST', auth: true, body: { ...body, price: -1 }, status: 400 });
      dish = await call('/menu', { method: 'POST', auth: true, body, status: 201 });
      assert.equal(dish.categoryName, 'Renamed Category');
      assert.equal((await call(`/menu?category=${category.code}`)).length, 1);
      assert.equal((await call(`/menu/${dish.id}`)).id, dish.id);
      await call('/menu/not-an-id', { status: 400 });
      await call('/menu?available=wrong', { status: 400 });
      await call(`/categories/${category.id}`, { method: 'DELETE', auth: true, status: 409 });
      category = await call(`/categories/${category.id}`, { method: 'PUT', auth: true, body: { code: `CHANGED_${stamp}` } });
      assert.equal((await call(`/menu/${dish.id}`)).category, category.code);
    });
    await t.test('upload, serve and remove images; reject disguised files', async () => {
      const bad = new FormData(); bad.append('image', new Blob(['<svg>bad</svg>'], { type: 'image/png' }), 'bad.png');
      await call(`/menu/${dish.id}/image`, { method: 'POST', auth: true, body: bad, status: 400 });
      const form = new FormData();
      const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0RsAAAAASUVORK5CYII=', 'base64');
      form.append('image', new Blob([png], { type: 'image/png' }), 'dish.png');
      const uploaded = await call(`/menu/${dish.id}/image`, { method: 'POST', auth: true, body: form });
      assert.match(uploaded.image, /^\/uploads\/menu\//);
      const imageUrl = base.replace('/api', '') + uploaded.image;
      assert.equal((await fetch(imageUrl)).status, 200);
      await call(`/menu/${dish.id}/image`, { method: 'DELETE', auth: true });
      assert.equal((await fetch(imageUrl)).status, 404);
    });
    await t.test('cart quotes authoritative totals and orders reject negative quantities', async () => {
      const quote = await call('/cart/quote', { method: 'POST', body: { items: [{ menuItemId: dish.id, quantity: 3, price: 0 }] } });
      assert.equal(quote.total, '33.17');
      await call('/orders', { method: 'POST', status: 400, body: { customerName: 'Test', customerEmail: 'test@example.com', items: [{ menuItemId: dish.id, quantity: -1 }] } });
      order = await call('/orders', { method: 'POST', status: 201, body: { customerName: 'Test', customerEmail: 'test@example.com', total: 0, userId: 999999, items: [{ menuItemId: dish.id, quantity: 3, price: 0 }] } });
      assert.equal(order.total, '33.17'); assert.equal(order.userId, null);
      await call(`/menu/${dish.id}`, { method: 'PUT', auth: true, body: { price: '20.00' } });
      const updated = await call('/cart/quote', { method: 'POST', body: { items: [{ menuItemId: dish.id, quantity: 3 }] } });
      assert.equal(updated.total, '66.00');
      await call(`/menu/${dish.id}/availability`, { method: 'PATCH', auth: true, body: { isAvailable: false } });
      assert.equal((await call('/cart/quote', { method: 'POST', body: { items: [{ menuItemId: dish.id, quantity: 1 }] } })).canCheckout, false);
      await call('/orders', { method: 'POST', status: 409, body: { customerName: 'Test', customerEmail: 'test@example.com', items: [{ menuItemId: dish.id, quantity: 1 }] } });
    });
    await t.test('deleting dish preserves historical order and hides it from menu/cart', async () => {
      await call(`/menu/${dish.id}`, { method: 'DELETE', auth: true });
      await call(`/menu/${dish.id}`, { status: 404 });
      assert.equal((await call(`/menu?category=${category.code}`)).length, 0);
      assert.equal((await call(`/orders/${order.id}`)).items[0].unitPrice, '10.05');
      assert.equal((await call('/cart/quote', { method: 'POST', body: { items: [{ menuItemId: dish.id, quantity: 1 }] } })).canCheckout, false);
      await db.order.delete({ where: { id: order.id } }); order = null;
      await db.menuItem.delete({ where: { id: dish.id } }); dish = null;
      await call(`/categories/${category.id}`, { method: 'DELETE', auth: true }); category = null;
    });
  } finally {
    if (order) await db.order.delete({ where: { id: order.id } });
    if (dish) await db.menuItem.delete({ where: { id: dish.id } });
    if (category) await db.menuCategory.delete({ where: { id: category.id } });
    if (user) await db.user.delete({ where: { id: user.id } });
    await new Promise(resolve => server.close(resolve));
    await db.$disconnect(); await prisma.$disconnect();
  }
});
