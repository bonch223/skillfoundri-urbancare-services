import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    userType: string;
    isVerified: boolean;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Access denied. No token provided.',
          statusCode: 401
        }
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Get user from database
    const result = await Database.query(
      'SELECT id, email, user_type, is_verified, is_active, is_suspended FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token - user not found.',
          statusCode: 401
        }
      });
      return;
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active || user.is_suspended) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Account is deactivated or suspended.',
          statusCode: 401
        }
      });
      return;
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      isVerified: user.is_verified
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token.',
        statusCode: 401
      }
    });
  }
};

export const requireVerification = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.isVerified) {
    res.status(403).json({
      success: false,
      error: {
        message: 'Account verification required.',
        statusCode: 403
      }
    });
    return;
  }
  next();
};

export const requireUserType = (allowedTypes: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedTypes.includes(req.user.userType)) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions.',
          statusCode: 403
        }
      });
      return;
    }
    next();
  };
};

