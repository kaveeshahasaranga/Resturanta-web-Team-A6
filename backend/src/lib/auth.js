import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Authentication and Cryptographic Utilities
 * Authored for Thrishala's Backend Scope:
 * - Password Hashing & Verification (bcryptjs)
 * - JWT Token Generation & Verification
 * - Password Reset Token Generation & Verification (Admin & Customer)
 * - Input Validation & User Sanitization
 */

export const JWT_SECRET = process.env.JWT_SECRET || 'fuchsius_jwt_secret_key_change_in_production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const RESET_TOKEN_EXPIRES_IN = '15m'; // 15 minutes security expiry
export const BCRYPT_SALT_ROUNDS = 12;

/**
 * Hash a plain text password using bcrypt
 * @param {string} password - Raw password to hash
 * @param {number} [saltRounds=12] - Number of bcrypt salt rounds
 * @returns {Promise<string>} Hashed password string
 */
export async function hashPassword(password, saltRounds = BCRYPT_SALT_ROUNDS) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a bcrypt hash
 * @param {string} password - Raw password provided during login
 * @param {string} hash - Hashed password stored in database
 * @returns {Promise<boolean>} True if match, false otherwise
 */
export async function comparePassword(password, hash) {
  if (!password || !hash) {
    return false;
  }
  return bcrypt.compare(password, hash);
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed) && trimmed.length <= 191;
}

/**
 * Validate password requirements
 * Minimum 6 characters (matches customer register minimum)
 * Returns object with validation status and error message
 * @param {string} password
 * @returns {{ isValid: boolean, message?: string }}
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'Password cannot exceed 128 characters' };
  }
  return { isValid: true };
}

/**
 * Generate a signed JWT authentication token
 * @param {object} payload - Payload to sign (e.g. { id, email, role })
 * @param {string} [expiresIn] - Expiry string (default: process.env.JWT_EXPIRES_IN or '7d')
 * @returns {string} JWT token string
 */
export function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT authentication token
 * @param {string} token - Bearer JWT token
 * @returns {object} Decoded token payload
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Generate a signed 15-minute Password Reset token
 * @param {object} user - User object containing { id, email, role }
 * @param {string} [expiresIn='15m']
 * @returns {string} Signed password reset JWT
 */
export function generatePasswordResetToken(user, expiresIn = RESET_TOKEN_EXPIRES_IN) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'pwd_reset',
    },
    JWT_SECRET,
    { expiresIn }
  );
}

/**
 * Verify a Password Reset token
 * Validates expiration and confirms the token type is 'pwd_reset'
 * @param {string} token - Reset token string
 * @returns {object} Decoded reset token payload
 */
export function verifyPasswordResetToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Reset token is required');
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.type !== 'pwd_reset') {
    throw new Error('Invalid token type');
  }
  return decoded;
}

/**
 * Sanitize a user record before returning in API response
 * Removes sensitive fields such as password hash
 * @param {object} user - User record from Prisma
 * @returns {object} Clean user object
 */
export function sanitizeUser(user) {
  if (!user) return null;
  const { password: _, ...cleanUser } = user;
  return cleanUser;
}
