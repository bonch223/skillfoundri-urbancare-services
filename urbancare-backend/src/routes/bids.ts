import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { ApiResponse } from '@/types';

const router = Router();

// Create a new bid
router.post('/', [
  authenticate,
  body('taskId').isUUID(),
  body('bidType').isIn(['accept_budget', 'custom_quote']),
  body('amount').isFloat({ min: 20, max: 100000 }),
  body('message').trim().isLength({ min: 10, max: 1000 }),
  body('estimatedCompletionTime').optional().trim(),
  body('includesMaterials').optional().isBoolean(),
  body('warrantyOffered').optional().trim(),
  body('additionalServices').optional().isArray()
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
      taskId,
      bidType,
      amount,
      message,
      estimatedCompletionTime,
      includesMaterials = false,
      warrantyOffered,
      additionalServices = []
    } = req.body;

    // Verify task exists and is open
    const taskResult = await Database.query(
      'SELECT id, client_id, status, budget FROM tasks WHERE id = $1',
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

    if (task.status !== 'open') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Task is no longer accepting bids',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    if (task.client_id === req.user!.id) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Cannot bid on your own task',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    // Check if provider already has a bid for this task
    const existingBid = await Database.query(
      'SELECT id FROM bids WHERE task_id = $1 AND provider_id = $2',
      [taskId, req.user!.id]
    );

    if (existingBid.rows.length > 0) {
      res.status(409).json({
        success: false,
        error: {
          message: 'You have already submitted a bid for this task',
          statusCode: 409
        }
      } as ApiResponse);
      return;
    }

    // Create bid
    const result = await Database.query(`
      INSERT INTO bids (
        task_id, provider_id, bid_type, amount, message,
        estimated_completion_time, includes_materials, warranty_offered,
        additional_services
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      taskId,
      req.user!.id,
      bidType,
      amount,
      message,
      estimatedCompletionTime,
      includesMaterials,
      warrantyOffered,
      JSON.stringify(additionalServices)
    ]);

    const bid = result.rows[0];

    // Update task bids count
    await Database.query(
      'UPDATE tasks SET bids_count = bids_count + 1 WHERE id = $1',
      [taskId]
    );

    // Emit real-time notification to client
    const io = req.app.get('io');
    io.to(`user-${task.client_id}`).emit('new-bid', {
      taskId,
      bidId: bid.id,
      providerId: req.user!.id,
      amount: bid.amount,
      bidType: bid.bid_type
    });

    logger.info(`Bid created: ${bid.id} for task ${taskId} by provider ${req.user!.id}`);

    res.status(201).json({
      success: true,
      data: {
        id: bid.id,
        taskId: bid.task_id,
        bidType: bid.bid_type,
        amount: parseFloat(bid.amount),
        message: bid.message,
        estimatedCompletionTime: bid.estimated_completion_time,
        includesMaterials: bid.includes_materials,
        warrantyOffered: bid.warranty_offered,
        additionalServices: bid.additional_services,
        status: bid.status,
        createdAt: bid.created_at,
        expiresAt: bid.expires_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Create bid error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create bid',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get bids for a task (for task owner)
router.get('/task/:taskId', [
  authenticate,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Verify user owns the task
    const taskResult = await Database.query(
      'SELECT client_id FROM tasks WHERE id = $1',
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

    if (taskResult.rows[0].client_id !== req.user!.id) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to view bids for this task',
          statusCode: 403
        }
      } as ApiResponse);
      return;
    }

    // Get bids with provider information
    const result = await Database.query(`
      SELECT 
        b.*,
        u.first_name || ' ' || u.last_name as provider_name,
        u.profile_picture_url as provider_avatar,
        pp.average_rating, pp.total_jobs_completed, pp.total_reviews,
        pp.response_time_minutes, pp.years_of_experience
      FROM bids b
      JOIN users u ON u.id = b.provider_id
      LEFT JOIN provider_profiles pp ON pp.user_id = u.id
      WHERE b.task_id = $1
      ORDER BY 
        CASE WHEN b.status = 'accepted' THEN 1 ELSE 2 END,
        pp.average_rating DESC,
        b.created_at ASC
      LIMIT $2 OFFSET $3
    `, [taskId, parseInt(limit as string), offset]);

    const bids = result.rows.map(row => ({
      id: row.id,
      bidType: row.bid_type,
      amount: parseFloat(row.amount),
      message: row.message,
      estimatedCompletionTime: row.estimated_completion_time,
      includesMaterials: row.includes_materials,
      warrantyOffered: row.warranty_offered,
      additionalServices: row.additional_services,
      status: row.status,
      provider: {
        id: row.provider_id,
        name: row.provider_name,
        avatar: row.provider_avatar,
        averageRating: row.average_rating ? parseFloat(row.average_rating) : 0,
        totalJobsCompleted: row.total_jobs_completed || 0,
        totalReviews: row.total_reviews || 0,
        responseTimeMinutes: row.response_time_minutes || 0,
        yearsOfExperience: row.years_of_experience || 0
      },
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      respondedAt: row.responded_at
    }));

    res.json({
      success: true,
      data: bids,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: bids.length,
        totalPages: Math.ceil(bids.length / parseInt(limit as string))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get task bids error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get task bids',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Accept/reject a bid
router.patch('/:id/respond', [
  authenticate,
  body('action').isIn(['accept', 'reject']),
  body('message').optional().trim()
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

    const { id } = req.params;
    const { action, message } = req.body;

    // Get bid and verify ownership
    const bidResult = await Database.query(`
      SELECT b.*, t.client_id, t.status as task_status
      FROM bids b
      JOIN tasks t ON t.id = b.task_id
      WHERE b.id = $1
    `, [id]);

    if (bidResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Bid not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    const bid = bidResult.rows[0];

    if (bid.client_id !== req.user!.id) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to respond to this bid',
          statusCode: 403
        }
      } as ApiResponse);
      return;
    }

    if (bid.status !== 'pending') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Bid has already been responded to',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    if (bid.task_status !== 'open') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Task is no longer accepting bids',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected';

    // Start transaction for accepting bid
    await Database.transaction(async (client) => {
      // Update bid status
      await client.query(`
        UPDATE bids 
        SET status = $1, response_message = $2, responded_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `, [newStatus, message, id]);

      if (action === 'accept') {
        // Assign task to provider
        await client.query(`
          UPDATE tasks 
          SET status = 'assigned', assigned_provider_id = $1, assigned_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `, [bid.provider_id, bid.task_id]);

        // Reject all other pending bids for this task
        await client.query(`
          UPDATE bids 
          SET status = 'rejected', response_message = 'Task assigned to another provider', responded_at = CURRENT_TIMESTAMP
          WHERE task_id = $1 AND id != $2 AND status = 'pending'
        `, [bid.task_id, id]);
      }
    });

    // Emit real-time notifications
    const io = req.app.get('io');
    
    // Notify the provider
    io.to(`user-${bid.provider_id}`).emit('bid-response', {
      bidId: id,
      taskId: bid.task_id,
      action,
      message
    });

    if (action === 'accept') {
      // Notify about task assignment
      io.to(`task-${bid.task_id}`).emit('task-assigned', {
        taskId: bid.task_id,
        providerId: bid.provider_id,
        clientId: bid.client_id
      });
    }

    logger.info(`Bid ${action}ed: ${id} by client ${req.user!.id}`);

    res.json({
      success: true,
      data: {
        bidId: id,
        status: newStatus,
        action,
        message: message || null,
        respondedAt: new Date().toISOString()
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Respond to bid error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to respond to bid',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get provider's bids
router.get('/provider/my-bids', [
  authenticate,
  query('status').optional().isIn(['pending', 'accepted', 'rejected', 'withdrawn']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereClause = 'WHERE b.provider_id = $1';
    const queryParams = [req.user!.id];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND b.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    const result = await Database.query(`
      SELECT 
        b.*,
        t.title as task_title, t.category, t.budget as task_budget, t.status as task_status,
        u.first_name || ' ' || u.last_name as client_name
      FROM bids b
      JOIN tasks t ON t.id = b.task_id
      JOIN users u ON u.id = t.client_id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, parseInt(limit as string), offset]);

    const bids = result.rows.map(row => ({
      id: row.id,
      taskId: row.task_id,
      bidType: row.bid_type,
      amount: parseFloat(row.amount),
      message: row.message,
      status: row.status,
      task: {
        title: row.task_title,
        category: row.category,
        budget: parseFloat(row.task_budget),
        status: row.task_status
      },
      client: {
        name: row.client_name
      },
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      respondedAt: row.responded_at,
      responseMessage: row.response_message
    }));

    res.json({
      success: true,
      data: bids,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: bids.length,
        totalPages: Math.ceil(bids.length / parseInt(limit as string))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get provider bids error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get provider bids',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Withdraw a bid
router.patch('/:id/withdraw', [
  authenticate,
  body('reason').optional().trim()
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Verify ownership and status
    const bidResult = await Database.query(
      'SELECT provider_id, status, task_id FROM bids WHERE id = $1',
      [id]
    );

    if (bidResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Bid not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    const bid = bidResult.rows[0];

    if (bid.provider_id !== req.user!.id) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to withdraw this bid',
          statusCode: 403
        }
      } as ApiResponse);
      return;
    }

    if (bid.status !== 'pending') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Can only withdraw pending bids',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    // Update bid status
    await Database.query(`
      UPDATE bids 
      SET status = 'withdrawn', response_message = $1, responded_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [reason || 'Bid withdrawn by provider', id]);

    // Update task bids count
    await Database.query(
      'UPDATE tasks SET bids_count = bids_count - 1 WHERE id = $1',
      [bid.task_id]
    );

    logger.info(`Bid withdrawn: ${id} by provider ${req.user!.id}`);

    res.json({
      success: true,
      data: {
        bidId: id,
        status: 'withdrawn',
        withdrawnAt: new Date().toISOString()
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Withdraw bid error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to withdraw bid',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

export default router;

