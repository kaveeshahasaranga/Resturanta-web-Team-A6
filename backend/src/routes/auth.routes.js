import { Router } from 'express';
import {
  hashPassword,
  comparePassword,
  validateEmail,
  validatePassword,
  generateToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  sanitizeUser,
} from '../lib/auth.js';
import { protect, adminOnly, customerOnly } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * Helper: Handle Customer Sign Up logic
 */
async function handleRegister(req, res, next) {
  try {
    const rawName = req.body.name || req.body.fullName;
    const rawEmail = req.body.email;
    const password = req.body.password;

    // 1. Validate required fields
    if (!rawName || !rawEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const name = String(rawName).trim();
    const email = String(rawEmail).trim().toLowerCase();

    if (name.length < 2 || name.length > 191) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 191 characters',
      });
    }

    // 2. Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // 3. Validate password strength
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
    }

    // 4. Check for existing account
    const existing = await req.prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // 5. Hash password with bcrypt
    const hashedPassword = await hashPassword(password);

    // 6. Create customer user record (strictly force CUSTOMER role)
    const user = await req.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 7. Generate JWT authentication token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * ─── POST /api/auth/register & POST /api/auth/signup ─────────────────────────
 * Customer Sign Up API
 */
router.post('/register', handleRegister);
router.post('/signup', handleRegister);

/**
 * ─── POST /api/auth/login ────────────────────────────────────────────────────
 * Unified Login API (Supports both Customer and Admin authentication)
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await req.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify bcrypt password hash
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const cleanUser = sanitizeUser(user);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: cleanUser,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ─── POST /api/auth/customer/login ───────────────────────────────────────────
 * Dedicated Customer Login API
 */
router.post('/customer/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await req.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (user.role !== 'CUSTOMER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Customer account required.',
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      success: true,
      message: 'Customer login successful',
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ─── POST /api/auth/admin/login ──────────────────────────────────────────────
 * Dedicated Admin Login API
 * Validates credentials and ensures the user possesses ADMIN role
 */
router.post('/admin/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await req.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Role-based authorization check
    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ─── POST /api/auth/admin/forgot-password ────────────────────────────────────
 * Admin Forgot Password API
 * Dispatches a cryptographically signed 15-minute reset token for admin accounts
 */
router.post('/admin/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Administrator email is required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await req.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        message: 'No registered administrator account found with this email',
      });
    }

    const resetToken = generatePasswordResetToken(user);

    return res.json({
      success: true,
      message: `Authenticated access link dispatched to ${user.email}`,
      data: {
        email: user.email,
        resetToken,
        expiresIn: '15 minutes',
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ─── POST /api/auth/forgot-password ──────────────────────────────────────────
 * Unified Forgot Password API (Patron & Admin)
 */
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await req.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Standard security: generic response prevents email scraping
      return res.json({
        success: true,
        message: 'If an account exists with this email, an authenticated reset link has been dispatched.',
      });
    }

    const resetToken = generatePasswordResetToken(user);

    return res.json({
      success: true,
      message: `Authenticated access link dispatched to ${user.email}`,
      data: {
        email: user.email,
        resetToken,
        expiresIn: '15 minutes',
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ─── POST /api/auth/admin/reset-password ─────────────────────────────────────
 * Admin Reset Password API
 * Validates the 15-minute token and updates administrator password
 */
router.post('/admin/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required',
      });
    }

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
    }

    let decoded;
    try {
      decoded = verifyPasswordResetToken(token);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link. Please request a new one.',
      });
    }

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Token is not authorized for administrator password reset.',
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await req.prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    return res.json({
      success: true,
      message: 'Admin password reset successfully. Please sign in with your new credentials.',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ─── POST /api/auth/reset-password ───────────────────────────────────────────
 * Unified Reset Password API (Patron & Admin)
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required',
      });
    }

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
    }

    let decoded;
    try {
      decoded = verifyPasswordResetToken(token);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link. Please request a new one.',
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await req.prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    return res.json({
      success: true,
      message: 'Password reset successfully. You can now sign in with your new credentials.',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ─── GET /api/auth/me & GET /api/auth/profile ────────────────────────────────
 * Customer Profile Retrieval API
 * Protected with Authentication Middleware (`protect`)
 */
async function handleGetProfile(req, res, next) {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

router.get('/me', protect, handleGetProfile);
router.get('/profile', protect, handleGetProfile);

/**
 * ─── PUT /api/auth/profile & PATCH /api/auth/profile ─────────────────────────
 * Customer Profile Update API
 * Protected with Authentication Middleware (`protect`)
 * Persists name, phone, city, and address directly into the database model
 */
async function handleUpdateProfile(req, res, next) {
  try {
    const { name, phone, city, address } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    const updateData = { name: name.trim() };
    if (phone !== undefined) updateData.phone = phone ? String(phone).trim() : null;
    if (city !== undefined) updateData.city = city ? String(city).trim() : null;
    if (address !== undefined) updateData.address = address ? String(address).trim() : null;

    const updatedUser = await req.prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

router.put('/profile', protect, handleUpdateProfile);
router.patch('/profile', protect, handleUpdateProfile);

/**
 * ─── POST /api/auth/change-password & PUT /api/auth/change-password ──────────
 * Customer Password Change API
 * Protected with Authentication Middleware
 * Requires current password verification and validates new password strength
 */
async function handleChangePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await req.prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    return res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    next(err);
  }
}

router.post('/change-password', protect, handleChangePassword);
router.put('/change-password', protect, handleChangePassword);

export default router;
