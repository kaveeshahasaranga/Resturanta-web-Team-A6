import { test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET ??= 'chef-contact-test-secret';
const { createApp } = await import('../src/app.js');

test('chef, contact, restaurant-info, and location API behavior', async t => {
  let chef = { id: 1, name: 'Test Chef', title: 'Head Chef', bio: 'Test bio', specialty: 'Sri Lankan', image: null };
  const message = { id: 1, name: 'Test Guest', email: 'guest@example.com', message: 'Hello', isRead: false };
  let settings = {
    id: 1,
    name: 'FUCHSIUS Culinary Hearth',
    address: '44 Ironwood Pavilion, Galle Fort, Southern Province, Sri Lanka',
    email: 'reservations@fuchsius.com',
    phone: '+94 (91) 458 8900',
    mapUrl: null,
  };
  const db = {
    chef: {
      findMany: async () => [chef],
      findUnique: async ({ where }) => where.id === chef.id ? chef : null,
      create: async ({ data }) => ({ id: 2, ...data }),
      update: async ({ data }) => (chef = { ...chef, ...data }),
      delete: async () => chef,
    },
    contactMessage: {
      create: async ({ data }) => ({ id: 2, ...data, isRead: false }),
      findMany: async () => [message],
      update: async ({ data }) => ({ ...message, ...data }),
      delete: async () => message,
    },
    restaurantSettings: {
      findUnique: async () => settings,
      upsert: async ({ create, update }) => (settings = { ...settings, ...create, ...update }),
    },
  };
  const app = createApp(db);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));

  const base = `http://127.0.0.1:${server.address().port}/api`;
  const token = jwt.sign({ role: 'ADMIN' }, process.env.JWT_SECRET);
  const customerToken = jwt.sign({ role: 'CUSTOMER' }, process.env.JWT_SECRET);
  async function call(path, { method = 'GET', body, auth = false, status = 200 } = {}) {
    const multipart = body instanceof FormData;
    const res = await fetch(base + path, {
      method,
      headers: {
        ...(body && !multipart ? { 'Content-Type': 'application/json' } : {}),
        ...(auth ? { Authorization: ['Bearer', auth === true ? token : auth].join(' ') } : {}),
      },
      body: body ? multipart ? body : JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    assert.equal(res.status, status, JSON.stringify(data));
    return data;
  }

  await t.test('chef list and details are public and validate IDs', async () => {
    assert.deepEqual((await call('/chefs')).data, [chef]);
    assert.deepEqual((await call('/chefs/1')).data, chef);
    await call('/chefs/invalid', { status: 400 });
    await call('/chefs/2', { status: 404 });
  });

  await t.test('chef writes require admin auth and validate fields', async () => {
    await call('/chefs', { method: 'POST', body: {}, status: 401 });
    await call('/chefs/1', { method: 'PUT', body: { title: 'Updated' }, status: 401 });
    await call('/chefs/1', { method: 'DELETE', status: 401 });
    await call('/chefs', { method: 'POST', auth: customerToken, body: {}, status: 403 });
    await call('/chefs', {
      method: 'POST', auth: true, status: 400,
      body: { name: 'Test Chef', title: 'Head Chef', bio: 'Bio', specialty: 'Cooking', image: 'javascript:alert(1)' },
    });
    const created = await call('/chefs', {
      method: 'POST', auth: true, status: 201,
      body: { name: 'New Chef', title: 'Sous Chef', bio: 'A bio', specialty: 'Pastry' },
    });
    assert.equal(created.data.name, 'New Chef');
    const updated = await call('/chefs/1', { method: 'PUT', auth: true, body: { title: 'Updated' } });
    assert.equal(updated.data.title, 'Updated');
    await call('/chefs/1', { method: 'PUT', auth: true, body: {} , status: 400 });
    const form = new FormData();
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0RsAAAAASUVORK5CYII=', 'base64');
    form.append('image', new Blob([png], { type: 'image/png' }), 'chef.png');
    const uploadResult = await call('/chefs/1/image', { method: 'POST', auth: true, body: form });
    assert.match(uploadResult.data.image, /^\/uploads\/chefs\//);
    const chefImage = new URL(uploadResult.data.image, base.replace('/api', ''));
    assert.equal((await fetch(chefImage)).status, 200);
    await call('/chefs/1/image', { method: 'POST', body: form, status: 401 });
    await call('/chefs/1/image', { method: 'DELETE', auth: true });
    assert.equal((await fetch(chefImage)).status, 404);
    await call('/chefs/1', { method: 'DELETE', auth: true });
  });

  await t.test('public contact info and map location are available', async () => {
    const info = (await call('/contact/info')).data;
    assert.equal(info.email, 'reservations@fuchsius.com');
    assert.equal(info.phone, '+94 (91) 458 8900');
    const location = (await call('/contact/location')).data;
    assert.equal(location.address, info.address);
    assert.equal(new URL(location.mapUrl).searchParams.get('query'), info.address);
    await call('/contact/settings', {
      method: 'PUT', body: { name: 'Test', address: '123 Test St', email: 'test@example.com', phone: '123' }, status: 401,
    });
    await call('/contact/settings', { status: 401 });
    await call('/contact/settings', {
      method: 'PUT', auth: customerToken,
      body: { name: 'Test', address: '123 Test St', email: 'test@example.com', phone: '123' }, status: 403,
    });
    await call('/contact/settings', { auth: customerToken, status: 403 });
    await call('/contact/settings', {
      method: 'PUT', auth: true, status: 400,
      body: { name: 'Test', address: '123 Test St', email: 'test@example.com', phone: '123', mapUrl: 'javascript:alert(1)' },
    });
    await call('/contact/settings', {
      method: 'PUT', auth: true,
      body: {
        name: 'Updated Restaurant', address: '123 Test St', email: 'hello@example.com',
        phone: '+94 11 222 3333', mapUrl: 'https://maps.google.com/?q=123+Test+St',
      },
    });
    assert.equal((await call('/contact/info')).data.name, 'Updated Restaurant');
    assert.equal((await call('/contact/location')).data.mapUrl, settings.mapUrl);
    assert.equal((await call('/contact/settings', { auth: true })).data.mapUrl, settings.mapUrl);
  });

  await t.test('contact submission is public, validates input, and inbox actions require admin auth', async () => {
    await call('/contact', { method: 'POST', body: { name: 'Guest', email: 'invalid', message: 'Hello' }, status: 400 });
    const created = await call('/contact', {
      method: 'POST',
      status: 201,
      body: { name: ' Guest ', email: 'guest@example.com', message: ' Hello ' },
    });
    assert.deepEqual(
      { name: created.data.name, email: created.data.email, message: created.data.message },
      { name: 'Guest', email: 'guest@example.com', message: 'Hello' },
    );
    await call('/contact', { status: 401 });
    await call('/contact/1/read', { method: 'PATCH', body: {}, status: 401 });
    await call('/contact/1', { method: 'DELETE', status: 401 });
    await call('/contact', { auth: customerToken, status: 403 });
    assert.equal((await call('/contact', { auth: true })).count, 1);
    assert.equal((await call('/contact/1/read', { method: 'PATCH', auth: true, body: {} })).data.isRead, true);
    await call('/contact/1/reply', { method: 'POST', body: { reply: 'Thanks for your message.' }, status: 401 });
    await call('/contact/1/reply', { method: 'POST', auth: customerToken, body: { reply: 'Thanks.' }, status: 403 });
    const reply = await call('/contact/1/reply', { method: 'POST', auth: true, body: { reply: ' Thanks for your message. ' } });
    assert.equal(reply.data.reply, 'Thanks for your message.');
    assert.ok(reply.data.repliedAt);
    assert.equal(reply.data.isRead, true);
    await call('/contact/1', { method: 'DELETE', auth: true });
  });
});
