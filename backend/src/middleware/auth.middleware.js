import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/auth.js';

/**
 * Authentication & Role Middleware
 * Authored for Thrishala's Backend Scope:
 * - JWT Verification Middleware (`protect`)
 * - Admin Role Restriction (`adminOnly`)
 * - Customer Role Restriction (`customerOnly`)
 * - Multi-Role Authorization (`requireRole` / `authorize`)
 * - Optional Guest/User Context (`optionalAuth`)
 */

/**
 * Middleware: Verify JWT Bearer token and attach decoded user to req.user
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated. Token missing.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please sign in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware: Restrict access to ADMIN role only
 * Used across admin management routes (menu, categories, orders, admin dashboard)
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.',
    });
  }
  next();
};

/**
 * Middleware: Restrict access to CUSTOMER role only
 */
export const customerOnly = (req, res, next) => {
  if (req.user?.role !== 'CUSTOMER') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Customers only.',
    });
  }
  next();
};

/**
 * Middleware: Require one or more specific roles
 * Example usage: requireRole('ADMIN', 'CHEF') or requireRole('CUSTOMER')
 * @param  {...string} roles - Permitted roles
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated. Token missing.',
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of: ${roles.join(', ')}.`,
    });
  }

  next();
};

/**
 * Alias for requireRole for standard naming conventions
 */
export const authorize = requireRole;

/**
 * Middleware: Optional authentication
 * Attaches req.user if a valid token is provided, otherwise leaves req.user as null
 */
export const optionalAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
};
