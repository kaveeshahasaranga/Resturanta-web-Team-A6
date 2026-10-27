import { test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET ??= 'chef-contact-test-secret';
const { createApp } = await import('../src/app.js');

test('chef, contact, restaurant-info, and location API behavior', async t => {
  const chef = { id: 1, name: 'Test Chef', title: 'Head Chef', bio: 'Test bio', specialty: 'Sri Lankan', image: null };
  const message = { id: 1, name: 'Test Guest', email: 'guest@example.com', message: 'Hello', isRead: false };
  const db = {
    chef: {
      findMany: async () => [chef],
      findUnique: async ({ where }) => where.id === chef.id ? chef : null,
      create: async ({ data }) => ({ id: 2, ...data }),
      update: async ({ data }) => ({ ...chef, ...data }),
      delete: async () => chef,
    },
    contactMessage: {
      create: async ({ data }) => ({ id: 2, ...data, isRead: false }),
      findMany: async () => [message],
      update: async ({ data }) => ({ ...message, ...data }),
      delete: async () => message,
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
    const res = await fetch(base + path, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(auth ? { Authorization: ['Bearer', auth === true ? token : auth].join(' ') } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
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
    await call('/chefs/1', { method: 'DELETE', auth: true });
  });

  await t.test('public contact info and map location are available', async () => {
    const info = (await call('/contact/info')).data;
    assert.equal(info.email, 'reservations@fuchsius.com');
    assert.equal(info.phone, '+94 (91) 458 8900');
    const location = (await call('/contact/location')).data;
    assert.equal(location.address, info.address);
    assert.equal(new URL(location.mapUrl).searchParams.get('query'), info.address);
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
    await call('/contact/1', { method: 'DELETE', auth: true });
  });
});
