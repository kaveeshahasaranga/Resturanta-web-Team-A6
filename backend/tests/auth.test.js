import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hashPassword,
  comparePassword,
  validateEmail,
  validatePassword,
  generateToken,
  verifyToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  sanitizeUser,
} from '../src/lib/auth.js';
import {
  protect,
  adminOnly,
  customerOnly,
  requireRole,
  optionalAuth,
} from '../src/middleware/auth.middleware.js';

// ─── 1. Password Hashing Tests ───────────────────────────────────────────────

test('hashPassword creates valid bcrypt hash and never stores raw password', async () => {
  const password = 'SecretPassword123!';
  const hash = await hashPassword(password);

  assert.notEqual(hash, password);
  assert.match(hash, /^\$2[aby]\$\d{2}\$[./0-9A-Za-z]{53}$/);

  // Salt uniqueness test: same password produces different hashes
  const hash2 = await hashPassword(password);
  assert.notEqual(hash, hash2);
});

test('comparePassword accurately validates matching and non-matching passwords', async () => {
  const plain = 'StrongPass2026';
  const hash = await hashPassword(plain);

  const isValid = await comparePassword(plain, hash);
  assert.equal(isValid, true);

  const isInvalid = await comparePassword('WrongPassword', hash);
  assert.equal(isInvalid, false);

  assert.equal(await comparePassword('', hash), false);
  assert.equal(await comparePassword(null, hash), false);
  assert.equal(await comparePassword(plain, null), false);
});

test('validateEmail validates format and maximum length', () => {
  assert.equal(validateEmail('thrishala@example.lk'), true);
  assert.equal(validateEmail('admin@fuchsius.com'), true);
  assert.equal(validateEmail('user.name+tag@domain.co.uk'), true);

  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail('@domain.com'), false);
  assert.equal(validateEmail('user@'), false);
  assert.equal(validateEmail(''), false);
  assert.equal(validateEmail(null), false);
});

test('validatePassword enforces length constraints', () => {
  assert.equal(validatePassword('123456').isValid, true);
  assert.equal(validatePassword('StrongPassword123').isValid, true);

  assert.equal(validatePassword('12345').isValid, false);
  assert.equal(validatePassword('').isValid, false);
  assert.equal(validatePassword(null).isValid, false);
});

// ─── 2. JWT & Token Utilities ────────────────────────────────────────────────

test('generateToken and verifyToken correctly encode and decode payload', () => {
  const payload = { id: 42, email: 'thrishala@example.lk', role: 'CUSTOMER' };
  const token = generateToken(payload);

  assert.equal(typeof token, 'string');
  assert.equal(token.split('.').length, 3);

  const decoded = verifyToken(token);
  assert.equal(decoded.id, 42);
  assert.equal(decoded.email, 'thrishala@example.lk');
  assert.equal(decoded.role, 'CUSTOMER');
});

test('generatePasswordResetToken and verifyPasswordResetToken issue and validate 15-minute reset token', () => {
  const user = { id: 101, email: 'admin@fuchsius.com', role: 'ADMIN' };
  const resetToken = generatePasswordResetToken(user);

  assert.equal(typeof resetToken, 'string');
  const decoded = verifyPasswordResetToken(resetToken);

  assert.equal(decoded.id, 101);
  assert.equal(decoded.email, 'admin@fuchsius.com');
  assert.equal(decoded.role, 'ADMIN');
  assert.equal(decoded.type, 'pwd_reset');

  // Rejects invalid token
  assert.throws(() => verifyPasswordResetToken('fake.token.here'));
  assert.throws(() => verifyPasswordResetToken(''));
});

test('sanitizeUser excludes password from user object', () => {
  const user = {
    id: 1,
    name: 'Thrishala Weerasekara',
    email: 'thrishala@example.lk',
    password: '$2a$12$eX4mpL3h4Sh3dPa$$w0rd',
    role: 'CUSTOMER',
    createdAt: new Date(),
  };

  const clean = sanitizeUser(user);
  assert.equal('password' in clean, false);
  assert.equal(clean.id, 1);
  assert.equal(clean.name, 'Thrishala Weerasekara');
  assert.equal(clean.email, 'thrishala@example.lk');
  assert.equal(clean.role, 'CUSTOMER');
});

// ─── 3. Authentication Middleware Tests ──────────────────────────────────────

test('protect middleware rejects missing or malformed token with 401', () => {
  let statusSet = null;
  let jsonSent = null;
  const res = {
    status(code) { statusSet = code; return this; },
    json(data) { jsonSent = data; },
  };

  let nextCalled = false;
  const reqNoAuth = { headers: {} };
  protect(reqNoAuth, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(statusSet, 401);
  assert.equal(jsonSent.success, false);
  assert.match(jsonSent.message, /Token missing/i);
});

test('protect middleware rejects invalid token with 401', () => {
  let statusSet = null;
  let jsonSent = null;
  const res = {
    status(code) { statusSet = code; return this; },
    json(data) { jsonSent = data; },
  };

  let nextCalled = false;
  const reqBadToken = { headers: { authorization: 'Bearer invalid.fake.token' } };
  protect(reqBadToken, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(statusSet, 401);
  assert.equal(jsonSent.success, false);
});

test('protect middleware attaches decoded user and calls next for valid token', () => {
  const token = generateToken({ id: 99, role: 'ADMIN' });

  let nextCalled = false;
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {};

  protect(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.equal(req.user.id, 99);
  assert.equal(req.user.role, 'ADMIN');
});

// ─── 4. Role Middleware Tests ────────────────────────────────────────────────

test('adminOnly allows ADMIN role and blocks CUSTOMER with 403', () => {
  let nextCalled = false;
  const reqAdmin = { user: { role: 'ADMIN' } };
  adminOnly(reqAdmin, {}, () => { nextCalled = true; });
  assert.equal(nextCalled, true);

  let statusSet = null;
  let jsonSent = null;
  const res = {
    status(code) { statusSet = code; return this; },
    json(data) { jsonSent = data; },
  };

  nextCalled = false;
  const reqCustomer = { user: { role: 'CUSTOMER' } };
  adminOnly(reqCustomer, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(statusSet, 403);
  assert.match(jsonSent.message, /Admins only/i);
});

test('customerOnly allows CUSTOMER role and blocks ADMIN with 403', () => {
  let nextCalled = false;
  const reqCust = { user: { role: 'CUSTOMER' } };
  customerOnly(reqCust, {}, () => { nextCalled = true; });
  assert.equal(nextCalled, true);

  let statusSet = null;
  let jsonSent = null;
  const res = {
    status(code) { statusSet = code; return this; },
    json(data) { jsonSent = data; },
  };

  nextCalled = false;
  const reqAdmin = { user: { role: 'ADMIN' } };
  customerOnly(reqAdmin, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(statusSet, 403);
  assert.match(jsonSent.message, /Customers only/i);
});

test('requireRole verifies multiple permitted roles', () => {
  const staffMiddleware = requireRole('ADMIN', 'CHEF');

  let nextCalled = false;
  staffMiddleware({ user: { role: 'CHEF' } }, {}, () => { nextCalled = true; });
  assert.equal(nextCalled, true);

  nextCalled = false;
  staffMiddleware({ user: { role: 'ADMIN' } }, {}, () => { nextCalled = true; });
  assert.equal(nextCalled, true);

  let statusSet = null;
  const res = {
    status(code) { statusSet = code; return this; },
    json() {},
  };
  nextCalled = false;
  staffMiddleware({ user: { role: 'CUSTOMER' } }, res, () => { nextCalled = true; });
  assert.equal(nextCalled, false);
  assert.equal(statusSet, 403);
});

test('optionalAuth sets req.user when valid token present, null when absent', () => {
  const token = generateToken({ id: 10, role: 'CUSTOMER' });
  const reqWithAuth = { headers: { authorization: `Bearer ${token}` } };
  let next1 = false;
  optionalAuth(reqWithAuth, {}, () => { next1 = true; });
  assert.equal(next1, true);
  assert.equal(reqWithAuth.user.id, 10);

  const reqWithoutAuth = { headers: {} };
  let next2 = false;
  optionalAuth(reqWithoutAuth, {}, () => { next2 = true; });
  assert.equal(next2, true);
  assert.equal(reqWithoutAuth.user, null);
});
