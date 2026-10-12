import jwt from 'jsonwebtoken';

/**
 * Middleware: verify JWT token and attach decoded payload to req.user
 */
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated. Token missing.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Middleware: restrict access to ADMIN role only
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
  }
  next();
};
