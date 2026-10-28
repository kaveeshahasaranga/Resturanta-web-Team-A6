import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { createApp } from '../src/app.js';

// In-memory mock database for unit/integration testing without requiring live MySQL
function createMockDb() {
  const users = [];
  let nextId = 1;

  return {
    user: {
      async findUnique({ where }) {
        if (where.email) {
          return users.find(u => u.email.toLowerCase() === where.email.toLowerCase()) || null;
        }
        if (where.id) {
          return users.find(u => u.id === where.id) || null;
        }
        return null;
      },
      async create({ data, select }) {
        const newUser = {
          id: nextId++,
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role || 'CUSTOMER',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        users.push(newUser);

        if (select) {
          const selected = {};
          for (const key of Object.keys(select)) {
            if (select[key]) selected[key] = newUser[key];
          }
          return selected;
        }
        return newUser;
      },
      async update({ where, data, select }) {
        const user = users.find(u => u.id === where.id);
        if (!user) throw new Error('User not found');
        if (data.name !== undefined) user.name = data.name;
        if (data.password !== undefined) user.password = data.password;
        if (data.phone !== undefined) user.phone = data.phone;
        if (data.city !== undefined) user.city = data.city;
        if (data.address !== undefined) user.address = data.address;
        user.updatedAt = new Date();

        if (select) {
          const selected = {};
          for (const key of Object.keys(select)) {
            if (select[key]) selected[key] = user[key];
          }
          return selected;
        }
        return user;
      },
      async count() {
        return users.length;
      },
    },
    order: {
      async count() { return 5; },
      async aggregate() { return { _sum: { total: 12500 } }; },
    },
    menuItem: {
      async count() { return 11; },
    },
    contactMessage: {
      async count() { return 2; },
    },
  };
}

test('Thrishala Auth API full lifecycle integration tests', async t => {
  process.env.JWT_SECRET = 'thrishala-test-jwt-secret-2026';
  process.env.NODE_ENV = 'test';

  const mockDb = createMockDb();

  // Seed default admin and customer into mock DB
  const hashedAdminPw = await bcrypt.hash('admin123', 4);
  const hashedCustomerPw = await bcrypt.hash('customer123', 4);

  await mockDb.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@fuchsius.com',
      password: hashedAdminPw,
      role: 'ADMIN',
    },
  });

  await mockDb.user.create({
    data: {
      name: 'Kasun Bandara',
      email: 'customer@fuchsius.com',
      password: hashedCustomerPw,
      role: 'CUSTOMER',
    },
  });

  const app = createApp(mockDb);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;

  async function api(path, { method = 'GET', body, token, status = 200 } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${base}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    assert.equal(res.status, status, `Expected ${status} for ${method} ${path}, got ${res.status}: ${JSON.stringify(data)}`);
    return data;
  }

  t.after(() => {
    server.close();
  });

  let registeredToken = null;
  let adminToken = null;
  let adminResetToken = null;

  await t.test('Customer Sign Up: rejects missing fields and invalid emails', async () => {
    // Missing fields
    await api('/auth/register', { method: 'POST', body: { email: 'test@example.com' }, status: 400 });
    await api('/auth/register', { method: 'POST', body: { name: 'Test', password: 'password123' }, status: 400 });

    // Invalid email format
    await api('/auth/register', { method: 'POST', body: { name: 'Test', email: 'not-an-email', password: 'password123' }, status: 400 });

    // Short password
    await api('/auth/register', { method: 'POST', body: { name: 'Test', email: 'test@example.com', password: '123' }, status: 400 });
  });

  await t.test('Customer Sign Up: successfully creates customer account with hashed password', async () => {
    const res = await api('/auth/register', {
      method: 'POST',
      body: {
        name: 'Thrishala Weerasekara',
        email: 'thrishala@example.lk',
        password: 'PatronPassword123',
      },
      status: 201,
    });

    assert.equal(res.success, true);
    assert.equal(res.data.user.name, 'Thrishala Weerasekara');
    assert.equal(res.data.user.email, 'thrishala@example.lk');
    assert.equal(res.data.user.role, 'CUSTOMER');
    assert.equal('password' in res.data.user, false);
    assert.ok(res.data.token);

    registeredToken = res.data.token;
  });

  await t.test('Customer Sign Up: prevents duplicate registration with 409 Conflict', async () => {
    const res = await api('/auth/register', {
      method: 'POST',
      body: {
        name: 'Duplicate Thrishala',
        email: 'thrishala@example.lk',
        password: 'AnotherPassword123',
      },
      status: 409,
    });

    assert.equal(res.success, false);
    assert.match(res.message, /Email already registered/i);
  });

  await t.test('Unified Login: authenticates customer and rejects invalid credentials', async () => {
    // Missing fields
    await api('/auth/login', { method: 'POST', body: {}, status: 400 });

    // Incorrect password
    await api('/auth/login', {
      method: 'POST',
      body: { email: 'thrishala@example.lk', password: 'WrongPassword' },
      status: 401,
    });

    // Unknown email
    await api('/auth/login', {
      method: 'POST',
      body: { email: 'unknown@example.lk', password: 'Password123' },
      status: 401,
    });

    // Valid customer credentials
    const loginRes = await api('/auth/login', {
      method: 'POST',
      body: { email: 'thrishala@example.lk', password: 'PatronPassword123' },
      status: 200,
    });

    assert.equal(loginRes.success, true);
    assert.equal(loginRes.data.user.email, 'thrishala@example.lk');
    assert.equal(loginRes.data.user.role, 'CUSTOMER');
    assert.ok(loginRes.data.token);
  });

  await t.test('Admin Login: allows ADMIN role and rejects CUSTOMER with 403', async () => {
    // Customer attempting admin login
    const forbiddenRes = await api('/auth/admin/login', {
      method: 'POST',
      body: { email: 'thrishala@example.lk', password: 'PatronPassword123' },
      status: 403,
    });
    assert.match(forbiddenRes.message, /Administrator privileges required/i);

    // Valid admin login
    const adminRes = await api('/auth/admin/login', {
      method: 'POST',
      body: { email: 'admin@fuchsius.com', password: 'admin123' },
      status: 200,
    });
    assert.equal(adminRes.success, true);
    assert.equal(adminRes.data.user.role, 'ADMIN');
    assert.ok(adminRes.data.token);

    adminToken = adminRes.data.token;
  });

  await t.test('Admin Forgot Password API: generates 15-minute token and rejects non-admin', async () => {
    // Non-admin email
    await api('/auth/admin/forgot-password', {
      method: 'POST',
      body: { email: 'thrishala@example.lk' },
      status: 404,
    });

    // Valid admin email
    const res = await api('/auth/admin/forgot-password', {
      method: 'POST',
      body: { email: 'admin@fuchsius.com' },
      status: 200,
    });

    assert.equal(res.success, true);
    assert.ok(res.data.resetToken);
    assert.equal(res.data.expiresIn, '15 minutes');
    adminResetToken = res.data.resetToken;
  });

  await t.test('Admin Reset Password API: updates admin password with valid token', async () => {
    // Weak password
    await api('/auth/admin/reset-password', {
      method: 'POST',
      body: { token: adminResetToken, newPassword: '123' },
      status: 400,
    });

    // Valid password reset
    const res = await api('/auth/admin/reset-password', {
      method: 'POST',
      body: { token: adminResetToken, newPassword: 'newAdminPassword2026' },
      status: 200,
    });
    assert.equal(res.success, true);

    // Verify login with new password
    const loginRes = await api('/auth/admin/login', {
      method: 'POST',
      body: { email: 'admin@fuchsius.com', password: 'newAdminPassword2026' },
      status: 200,
    });
    assert.equal(loginRes.success, true);
  });

  await t.test('Authentication & Admin Access Protection: guards /admin/dashboard', async () => {
    // Unauthenticated
    await api('/admin/dashboard', { status: 401 });

    // Customer token forbidden
    await api('/admin/dashboard', { token: registeredToken, status: 403 });

    // Admin token allowed
    const dashRes = await api('/admin/dashboard', { token: adminToken, status: 200 });
    assert.equal(dashRes.success, true);
    assert.equal(dashRes.data.totalOrders, 5);
  });

  await t.test('Customer Profile Retrieval and Update APIs', async () => {
    // Retrieve profile
    const meRes = await api('/auth/profile', { token: registeredToken, status: 200 });
    assert.equal(meRes.data.email, 'thrishala@example.lk');
    assert.equal(meRes.data.name, 'Thrishala Weerasekara');

    // Update profile
    const updateRes = await api('/auth/profile', {
      method: 'PUT',
      token: registeredToken,
      body: {
        name: 'Thrishala W.',
        phone: '077 123 4567',
        city: 'Colombo',
        address: '45 Temple Road, Colombo 05',
      },
      status: 200,
    });
    assert.equal(updateRes.data.name, 'Thrishala W.');
    assert.equal(updateRes.data.phone, '077 123 4567');
  });

  await t.test('Customer Password Change API: updates password and allows subsequent login', async () => {
    // Wrong current password
    await api('/auth/change-password', {
      method: 'POST',
      token: registeredToken,
      body: { currentPassword: 'WrongPassword', newPassword: 'NewPassword999' },
      status: 401,
    });

    // Valid password update
    const pwRes = await api('/auth/change-password', {
      method: 'POST',
      token: registeredToken,
      body: { currentPassword: 'PatronPassword123', newPassword: 'NewPassword999' },
      status: 200,
    });
    assert.equal(pwRes.success, true);

    // Login with new password
    await api('/auth/login', {
      method: 'POST',
      body: { email: 'thrishala@example.lk', password: 'NewPassword999' },
      status: 200,
    });
  });
});
