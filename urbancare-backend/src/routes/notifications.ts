import { Router, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { ApiResponse } from '@/types';

const router = Router();

// Get user notifications
router.get('/', [
  authenticate,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('unreadOnly').optional().isBoolean()
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 50, unreadOnly = false } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereClause = 'WHERE n.user_id = $1';
    const queryParams = [req.user!.id];
    let paramIndex = 2;

    if (unreadOnly === 'true') {
      whereClause += ` AND n.is_read = false`;
    }

    const result = await Database.query(`
      SELECT 
        n.*,
        t.title as task_title,
        u.first_name || ' ' || u.last_name as related_user_name
      FROM notifications n
      LEFT JOIN tasks t ON t.id = n.related_task_id
      LEFT JOIN users u ON u.id = n.related_user_id
      ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, parseInt(limit as string), offset]);

    const notifications = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      message: row.message,
      notificationType: row.notification_type,
      relatedTaskId: row.related_task_id,
      relatedUserId: row.related_user_id,
      relatedTask: row.task_title ? { title: row.task_title } : null,
      relatedUser: row.related_user_name ? { name: row.related_user_name } : null,
      isRead: row.is_read,
      readAt: row.read_at,
      createdAt: row.created_at
    }));

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: notifications.length,
        totalPages: Math.ceil(notifications.length / parseInt(limit as string))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get notifications',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Mark notification as read
router.patch('/:id/read', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await Database.query(`
      UPDATE notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING is_read, read_at
    `, [id, req.user!.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Notification not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    const notification = result.rows[0];

    res.json({
      success: true,
      data: {
        notificationId: id,
        isRead: notification.is_read,
        readAt: notification.read_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to mark notification as read',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await Database.query(`
      UPDATE notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND is_read = false
      RETURNING id
    `, [req.user!.id]);

    logger.info(`${result.rowCount} notifications marked as read for user ${req.user!.id}`);

    res.json({
      success: true,
      data: {
        markedCount: result.rowCount
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to mark all notifications as read',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get unread notification count
router.get('/unread-count', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await Database.query(`
      SELECT COUNT(*) as unread_count
      FROM notifications 
      WHERE user_id = $1 AND is_read = false
    `, [req.user!.id]);

    const unreadCount = parseInt(result.rows[0].unread_count);

    res.json({
      success: true,
      data: {
        unreadCount
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get unread notification count error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get unread notification count',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await Database.query(`
      DELETE FROM notifications 
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `, [id, req.user!.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Notification not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    logger.info(`Notification deleted: ${id} by user ${req.user!.id}`);

    res.json({
      success: true,
      data: {
        notificationId: id,
        deleted: true
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete notification',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Create notification (internal helper function exposed as endpoint for testing)
router.post('/create', [
  authenticate,
  // This would typically be an admin-only endpoint or internal service call
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      userId,
      title,
      message,
      notificationType,
      relatedTaskId,
      relatedUserId
    } = req.body;

    const result = await Database.query(`
      INSERT INTO notifications (
        user_id, title, message, notification_type, 
        related_task_id, related_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      userId,
      title,
      message,
      notificationType,
      relatedTaskId || null,
      relatedUserId || null
    ]);

    const notification = result.rows[0];

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('new-notification', {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      notificationType: notification.notification_type,
      relatedTaskId: notification.related_task_id,
      relatedUserId: notification.related_user_id,
      createdAt: notification.created_at
    });

    logger.info(`Notification created: ${notification.id} for user ${userId}`);

    res.status(201).json({
      success: true,
      data: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        notificationType: notification.notification_type,
        createdAt: notification.created_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create notification',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

export default router;

