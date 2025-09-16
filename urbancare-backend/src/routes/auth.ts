import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { ApiResponse, User } from '@/types';

const router = Router();

// Registration endpoint
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('userType').isIn(['individual', 'small_business']),
  body('phone').optional().isMobilePhone('any'),
  body('city').optional().trim()
], async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          statusCode: 400,
          details: errors.array()
        }
      } as ApiResponse);
      return;
    }

    const {
      email,
      password,
      firstName,
      lastName,
      userType,
      phone,
      city = 'Tagum City'
    } = req.body;

    // Check if user already exists
    const existingUser = await Database.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({
        success: false,
        error: {
          message: 'User with this email already exists',
          statusCode: 409
        }
      } as ApiResponse);
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await Database.query(`
      INSERT INTO users (
        email, password_hash, first_name, last_name, user_type, phone, city,
        province, country, preferred_language, notification_preferences
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, email, first_name, last_name, user_type, city, created_at
    `, [
      email,
      passwordHash,
      firstName,
      lastName,
      userType,
      phone,
      city,
      'Davao del Norte',
      'Philippines',
      'en',
      JSON.stringify({ email: true, sms: true, push: true })
    ]);

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`New user registered: ${email} (${userType})`);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type,
          city: user.city,
          createdAt: user.created_at
        },
        token
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Registration failed',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          statusCode: 400,
          details: errors.array()
        }
      } as ApiResponse);
      return;
    }

    const { email, password } = req.body;

    // Get user from database
    const result = await Database.query(`
      SELECT 
        id, email, password_hash, first_name, last_name, user_type,
        city, is_verified, is_active, is_suspended, created_at
      FROM users 
      WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          statusCode: 401
        }
      } as ApiResponse);
      return;
    }

    const user = result.rows[0];

    // Check account status
    if (!user.is_active || user.is_suspended) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Account is deactivated or suspended',
          statusCode: 401
        }
      } as ApiResponse);
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          statusCode: 401
        }
      } as ApiResponse);
      return;
    }

    // Update last login timestamp
    await Database.query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type,
          city: user.city,
          isVerified: user.is_verified,
          createdAt: user.created_at
        },
        token
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Login failed',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get current user profile
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await Database.query(`
      SELECT 
        id, email, first_name, last_name, user_type, phone, city, province, country,
        profile_picture_url, is_verified, preferred_language, notification_preferences,
        created_at, updated_at, last_login_at
      FROM users 
      WHERE id = $1
    `, [req.user!.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        userType: user.user_type,
        phone: user.phone,
        city: user.city,
        province: user.province,
        country: user.country,
        profilePictureUrl: user.profile_picture_url,
        isVerified: user.is_verified,
        preferredLanguage: user.preferred_language,
        notificationPreferences: user.notification_preferences,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLoginAt: user.last_login_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get user profile',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Logout endpoint (mainly for logging purposes)
router.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  logger.info(`User logged out: ${req.user!.email}`);
  
  res.json({
    success: true,
    data: {
      message: 'Logged out successfully'
    }
  } as ApiResponse);
});

// Change password
router.post('/change-password', [
  authenticate,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          statusCode: 400,
          details: errors.array()
        }
      } as ApiResponse);
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const result = await Database.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user!.id]
    );

    const user = result.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Current password is incorrect',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await Database.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.user!.id]
    );

    logger.info(`Password changed for user: ${req.user!.email}`);

    res.json({
      success: true,
      data: {
        message: 'Password changed successfully'
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to change password',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

export default router;

