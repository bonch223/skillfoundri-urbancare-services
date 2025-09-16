import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { ApiResponse } from '@/types';

const router = Router();

// Send a message
router.post('/', [
  authenticate,
  body('recipientId').isUUID(),
  body('content').trim().isLength({ min: 1, max: 2000 }),
  body('taskId').optional().isUUID(),
  body('messageType').optional().isIn(['text', 'image', 'document']),
  body('attachmentUrl').optional().isURL()
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

    const {
      recipientId,
      content,
      taskId,
      messageType = 'text',
      attachmentUrl
    } = req.body;

    // Verify recipient exists
    const recipientResult = await Database.query(
      'SELECT id, first_name, last_name FROM users WHERE id = $1 AND is_active = true',
      [recipientId]
    );

    if (recipientResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Recipient not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    // If taskId is provided, verify user is involved in the task
    if (taskId) {
      const taskResult = await Database.query(
        'SELECT client_id, assigned_provider_id FROM tasks WHERE id = $1',
        [taskId]
      );

      if (taskResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Task not found',
            statusCode: 404
          }
        } as ApiResponse);
        return;
      }

      const task = taskResult.rows[0];
      const isInvolved = req.user!.id === task.client_id || 
                        req.user!.id === task.assigned_provider_id ||
                        recipientId === task.client_id ||
                        recipientId === task.assigned_provider_id;

      if (!isInvolved) {
        res.status(403).json({
          success: false,
          error: {
            message: 'Not authorized to message about this task',
            statusCode: 403
          }
        } as ApiResponse);
        return;
      }
    }

    // Create message
    const result = await Database.query(`
      INSERT INTO messages (
        sender_id, recipient_id, task_id, content, message_type, attachment_url
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      req.user!.id,
      recipientId,
      taskId || null,
      content,
      messageType,
      attachmentUrl || null
    ]);

    const message = result.rows[0];

    // Emit real-time message
    const io = req.app.get('io');
    const recipient = recipientResult.rows[0];
    
    io.to(`user-${recipientId}`).emit('new-message', {
      id: message.id,
      senderId: req.user!.id,
      content: message.content,
      messageType: message.message_type,
      attachmentUrl: message.attachment_url,
      taskId: message.task_id,
      createdAt: message.created_at
    });

    // Send to task room if task-related
    if (taskId) {
      io.to(`task-${taskId}`).emit('task-message', {
        messageId: message.id,
        taskId,
        senderId: req.user!.id,
        content: message.content
      });
    }

    logger.info(`Message sent: ${message.id} from ${req.user!.id} to ${recipientId}`);

    res.status(201).json({
      success: true,
      data: {
        id: message.id,
        recipientId: message.recipient_id,
        content: message.content,
        messageType: message.message_type,
        attachmentUrl: message.attachment_url,
        taskId: message.task_id,
        createdAt: message.created_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to send message',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get conversation between two users
router.get('/conversation/:userId', [
  authenticate,
  query('taskId').optional().isUUID(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { taskId, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions = [
      '((m.sender_id = $1 AND m.recipient_id = $2) OR (m.sender_id = $2 AND m.recipient_id = $1))'
    ];
    let queryParams = [req.user!.id, userId];
    let paramIndex = 3;

    if (taskId) {
      whereConditions.push(`m.task_id = $${paramIndex}`);
      queryParams.push(taskId);
      paramIndex++;
    }

    const result = await Database.query(`
      SELECT 
        m.*,
        sender.first_name || ' ' || sender.last_name as sender_name,
        sender.profile_picture_url as sender_avatar
      FROM messages m
      JOIN users sender ON sender.id = m.sender_id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY m.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, parseInt(limit as string), offset]);

    // Mark messages as read
    await Database.query(`
      UPDATE messages 
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE recipient_id = $1 AND sender_id = $2 AND is_read = false
      ${taskId ? 'AND task_id = $3' : ''}
    `, taskId ? [req.user!.id, userId, taskId] : [req.user!.id, userId]);

    const messages = result.rows.map(row => ({
      id: row.id,
      senderId: row.sender_id,
      recipientId: row.recipient_id,
      content: row.content,
      messageType: row.message_type,
      attachmentUrl: row.attachment_url,
      taskId: row.task_id,
      isRead: row.is_read,
      readAt: row.read_at,
      sender: {
        name: row.sender_name,
        avatar: row.sender_avatar
      },
      createdAt: row.created_at
    })).reverse(); // Reverse to show oldest first

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: messages.length,
        totalPages: Math.ceil(messages.length / parseInt(limit as string))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get conversation',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get all conversations for user
router.get('/conversations', [
  authenticate,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Get latest message for each conversation
    const result = await Database.query(`
      WITH latest_messages AS (
        SELECT DISTINCT ON (
          CASE 
            WHEN sender_id = $1 THEN recipient_id 
            ELSE sender_id 
          END,
          task_id
        )
          *,
          CASE 
            WHEN sender_id = $1 THEN recipient_id 
            ELSE sender_id 
          END as other_user_id
        FROM messages 
        WHERE (sender_id = $1 OR recipient_id = $1)
        ORDER BY 
          CASE 
            WHEN sender_id = $1 THEN recipient_id 
            ELSE sender_id 
          END,
          task_id,
          created_at DESC
      )
      SELECT 
        lm.*,
        u.first_name || ' ' || u.last_name as other_user_name,
        u.profile_picture_url as other_user_avatar,
        t.title as task_title,
        COUNT(unread.id) as unread_count
      FROM latest_messages lm
      JOIN users u ON u.id = lm.other_user_id
      LEFT JOIN tasks t ON t.id = lm.task_id
      LEFT JOIN messages unread ON (
        unread.sender_id = lm.other_user_id AND 
        unread.recipient_id = $1 AND 
        unread.is_read = false AND
        (lm.task_id IS NULL OR unread.task_id = lm.task_id)
      )
      GROUP BY lm.id, lm.other_user_id, lm.content, lm.message_type, lm.created_at, 
               lm.task_id, u.first_name, u.last_name, u.profile_picture_url, t.title
      ORDER BY lm.created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.user!.id, parseInt(limit as string), offset]);

    const conversations = result.rows.map(row => ({
      otherUserId: row.other_user_id,
      otherUser: {
        name: row.other_user_name,
        avatar: row.other_user_avatar
      },
      taskId: row.task_id,
      task: row.task_title ? { title: row.task_title } : null,
      lastMessage: {
        id: row.id,
        content: row.content,
        messageType: row.message_type,
        senderId: row.sender_id,
        createdAt: row.created_at
      },
      unreadCount: parseInt(row.unread_count),
      updatedAt: row.created_at
    }));

    res.json({
      success: true,
      data: conversations,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: conversations.length,
        totalPages: Math.ceil(conversations.length / parseInt(limit as string))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get conversations',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Mark messages as read
router.patch('/mark-read', [
  authenticate,
  body('senderId').isUUID(),
  body('taskId').optional().isUUID()
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

    const { senderId, taskId } = req.body;

    let query = `
      UPDATE messages 
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE recipient_id = $1 AND sender_id = $2 AND is_read = false
    `;
    let queryParams = [req.user!.id, senderId];

    if (taskId) {
      query += ' AND task_id = $3';
      queryParams.push(taskId);
    }

    const result = await Database.query(query + ' RETURNING id', queryParams);

    logger.info(`${result.rowCount} messages marked as read by ${req.user!.id} from ${senderId}`);

    res.json({
      success: true,
      data: {
        markedCount: result.rowCount
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Mark messages read error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to mark messages as read',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get unread message count
router.get('/unread-count', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await Database.query(`
      SELECT COUNT(*) as unread_count
      FROM messages 
      WHERE recipient_id = $1 AND is_read = false
    `, [req.user!.id]);

    const unreadCount = parseInt(result.rows[0].unread_count);

    res.json({
      success: true,
      data: {
        unreadCount
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get unread count',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Delete a message
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify message ownership
    const messageResult = await Database.query(
      'SELECT sender_id FROM messages WHERE id = $1',
      [id]
    );

    if (messageResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Message not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    if (messageResult.rows[0].sender_id !== req.user!.id) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to delete this message',
          statusCode: 403
        }
      } as ApiResponse);
      return;
    }

    // Delete message
    await Database.query('DELETE FROM messages WHERE id = $1', [id]);

    logger.info(`Message deleted: ${id} by user ${req.user!.id}`);

    res.json({
      success: true,
      data: {
        messageId: id,
        deleted: true
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete message',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

export default router;

