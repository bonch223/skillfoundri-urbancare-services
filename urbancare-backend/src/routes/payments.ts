import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { ApiResponse } from '@/types';

const router = Router();

// Create payment (escrow system)
router.post('/', [
  authenticate,
  body('taskId').isUUID(),
  body('providerId').isUUID(),
  body('paymentMethod').isIn(['gcash', 'gotyme', 'bpi', 'cash']),
  body('paymentReference').optional().trim()
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

    const { taskId, providerId, paymentMethod, paymentReference } = req.body;

    // Verify task ownership and status
    const taskResult = await Database.query(`
      SELECT t.client_id, t.budget, t.commission_rate, t.status, t.assigned_provider_id
      FROM tasks t
      WHERE t.id = $1
    `, [taskId]);

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

    if (task.client_id !== req.user!.id) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to make payment for this task',
          statusCode: 403
        }
      } as ApiResponse);
      return;
    }

    if (task.status !== 'assigned' && task.status !== 'in_progress') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Payment can only be made for assigned or in-progress tasks',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    if (task.assigned_provider_id !== providerId) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Provider is not assigned to this task',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    // Check if payment already exists
    const existingPayment = await Database.query(
      'SELECT id FROM payments WHERE task_id = $1',
      [taskId]
    );

    if (existingPayment.rows.length > 0) {
      res.status(409).json({
        success: false,
        error: {
          message: 'Payment already exists for this task',
          statusCode: 409
        }
      } as ApiResponse);
      return;
    }

    // Calculate amounts
    const totalAmount = parseFloat(task.budget);
    const commissionRate = parseFloat(task.commission_rate);
    const commissionAmount = (totalAmount * commissionRate) / 100;
    const providerAmount = totalAmount - commissionAmount;

    // In development mode, simulate payment processing
    const isRealPayment = process.env.ENABLE_REAL_PAYMENTS === 'true';
    let paymentStatus = 'pending';
    
    if (!isRealPayment) {
      // Simulate successful payment in development
      paymentStatus = 'held';
    }

    // Create payment record
    const result = await Database.query(`
      INSERT INTO payments (
        task_id, client_id, provider_id, amount, commission_amount, provider_amount,
        payment_method, payment_reference, status, held_at, release_scheduled_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 
                CASE WHEN $9 = 'held' THEN CURRENT_TIMESTAMP ELSE NULL END,
                CASE WHEN $9 = 'held' THEN CURRENT_TIMESTAMP + INTERVAL '${process.env.AUTO_PAYMENT_RELEASE_DAYS || 3} days' ELSE NULL END)
      RETURNING *
    `, [
      taskId,
      req.user!.id,
      providerId,
      totalAmount,
      commissionAmount,
      providerAmount,
      paymentMethod,
      paymentReference,
      paymentStatus
    ]);

    const payment = result.rows[0];

    // Update provider's pending earnings
    if (paymentStatus === 'held') {
      await Database.query(
        'UPDATE provider_profiles SET pending_earnings = pending_earnings + $1 WHERE user_id = $2',
        [providerAmount, providerId]
      );
    }

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`user-${providerId}`).emit('payment-received', {
      taskId,
      paymentId: payment.id,
      amount: providerAmount,
      status: paymentStatus
    });

    logger.info(`Payment created: ${payment.id} for task ${taskId} - ${paymentMethod} ${totalAmount}`);

    res.status(201).json({
      success: true,
      data: {
        id: payment.id,
        taskId: payment.task_id,
        amount: parseFloat(payment.amount),
        commissionAmount: parseFloat(payment.commission_amount),
        providerAmount: parseFloat(payment.provider_amount),
        paymentMethod: payment.payment_method,
        status: payment.status,
        createdAt: payment.created_at,
        heldAt: payment.held_at,
        releaseScheduledAt: payment.release_scheduled_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process payment',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Release payment to provider
router.patch('/:id/release', [
  authenticate,
  body('reason').optional().trim()
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Get payment and verify permissions
    const paymentResult = await Database.query(`
      SELECT p.*, t.client_id, t.status as task_status
      FROM payments p
      JOIN tasks t ON t.id = p.task_id
      WHERE p.id = $1
    `, [id]);

    if (paymentResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Payment not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    const payment = paymentResult.rows[0];

    // Only client or auto-release can release payment
    if (payment.client_id !== req.user!.id) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to release this payment',
          statusCode: 403
        }
      } as ApiResponse);
      return;
    }

    if (payment.status !== 'held') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Payment is not in held status',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    if (payment.task_status !== 'completed') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Payment can only be released for completed tasks',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    // Release payment
    await Database.transaction(async (client) => {
      // Update payment status
      await client.query(`
        UPDATE payments 
        SET status = 'released', released_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);

      // Update provider earnings
      await client.query(`
        UPDATE provider_profiles 
        SET 
          pending_earnings = pending_earnings - $1,
          total_earnings = total_earnings + $1
        WHERE user_id = $2
      `, [parseFloat(payment.provider_amount), payment.provider_id]);
    });

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`user-${payment.provider_id}`).emit('payment-released', {
      paymentId: id,
      taskId: payment.task_id,
      amount: parseFloat(payment.provider_amount)
    });

    logger.info(`Payment released: ${id} to provider ${payment.provider_id}`);

    res.json({
      success: true,
      data: {
        paymentId: id,
        status: 'released',
        releasedAt: new Date().toISOString(),
        amount: parseFloat(payment.provider_amount)
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Release payment error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to release payment',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Refund payment to client
router.patch('/:id/refund', [
  authenticate,
  body('reason').trim().isLength({ min: 1 })
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
    const { reason } = req.body;

    // Get payment and verify permissions
    const paymentResult = await Database.query(`
      SELECT p.*, t.client_id, t.status as task_status
      FROM payments p
      JOIN tasks t ON t.id = p.task_id
      WHERE p.id = $1
    `, [id]);

    if (paymentResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Payment not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    const payment = paymentResult.rows[0];

    if (payment.client_id !== req.user!.id) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to refund this payment',
          statusCode: 403
        }
      } as ApiResponse);
      return;
    }

    if (payment.status !== 'held') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Payment is not in held status',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    if (payment.task_status !== 'cancelled') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Payment can only be refunded for cancelled tasks',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    // Process refund
    await Database.transaction(async (client) => {
      // Update payment status
      await client.query(`
        UPDATE payments 
        SET status = 'refunded', released_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);

      // Remove from provider's pending earnings
      await client.query(`
        UPDATE provider_profiles 
        SET pending_earnings = pending_earnings - $1
        WHERE user_id = $2
      `, [parseFloat(payment.provider_amount), payment.provider_id]);
    });

    logger.info(`Payment refunded: ${id} for task ${payment.task_id} - Reason: ${reason}`);

    res.json({
      success: true,
      data: {
        paymentId: id,
        status: 'refunded',
        refundedAt: new Date().toISOString(),
        amount: parseFloat(payment.amount),
        reason
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process refund',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get payment history for user
router.get('/history', [
  authenticate,
  query('type').optional().isIn(['sent', 'received']),
  query('status').optional().isIn(['pending', 'held', 'released', 'refunded', 'failed']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    // Filter by user type (client or provider)
    if (type === 'sent') {
      whereConditions.push(`p.client_id = $${paramIndex}`);
    } else if (type === 'received') {
      whereConditions.push(`p.provider_id = $${paramIndex}`);
    } else {
      whereConditions.push(`(p.client_id = $${paramIndex} OR p.provider_id = $${paramIndex})`);
    }
    queryParams.push(req.user!.id);
    paramIndex++;

    if (status) {
      whereConditions.push(`p.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    const result = await Database.query(`
      SELECT 
        p.*,
        t.title as task_title, t.category,
        client.first_name || ' ' || client.last_name as client_name,
        provider.first_name || ' ' || provider.last_name as provider_name,
        CASE 
          WHEN p.client_id = $1 THEN 'sent'
          WHEN p.provider_id = $1 THEN 'received'
        END as payment_type
      FROM payments p
      JOIN tasks t ON t.id = p.task_id
      JOIN users client ON client.id = p.client_id
      JOIN users provider ON provider.id = p.provider_id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, parseInt(limit as string), offset]);

    const payments = result.rows.map(row => ({
      id: row.id,
      taskId: row.task_id,
      task: {
        title: row.task_title,
        category: row.category
      },
      amount: parseFloat(row.amount),
      commissionAmount: parseFloat(row.commission_amount),
      providerAmount: parseFloat(row.provider_amount),
      paymentMethod: row.payment_method,
      paymentReference: row.payment_reference,
      status: row.status,
      type: row.payment_type,
      client: { name: row.client_name },
      provider: { name: row.provider_name },
      createdAt: row.created_at,
      heldAt: row.held_at,
      releasedAt: row.released_at,
      releaseScheduledAt: row.release_scheduled_at
    }));

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: payments.length,
        totalPages: Math.ceil(payments.length / parseInt(limit as string))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get payment history',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get payment summary for user
router.get('/summary', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get client payment summary
    const clientSummary = await Database.query(`
      SELECT 
        COUNT(*) as total_payments,
        COALESCE(SUM(amount), 0) as total_spent,
        COALESCE(SUM(commission_amount), 0) as total_commission_paid,
        COUNT(CASE WHEN status = 'held' THEN 1 END) as payments_in_escrow
      FROM payments 
      WHERE client_id = $1
    `, [req.user!.id]);

    // Get provider payment summary
    const providerSummary = await Database.query(`
      SELECT 
        COUNT(*) as total_received_payments,
        COALESCE(SUM(provider_amount), 0) as total_earned,
        COALESCE(SUM(CASE WHEN status = 'held' THEN provider_amount ELSE 0 END), 0) as pending_earnings,
        COALESCE(SUM(CASE WHEN status = 'released' THEN provider_amount ELSE 0 END), 0) as completed_earnings
      FROM payments 
      WHERE provider_id = $1
    `, [req.user!.id]);

    const clientData = clientSummary.rows[0];
    const providerData = providerSummary.rows[0];

    res.json({
      success: true,
      data: {
        client: {
          totalPayments: parseInt(clientData.total_payments),
          totalSpent: parseFloat(clientData.total_spent),
          totalCommissionPaid: parseFloat(clientData.total_commission_paid),
          paymentsInEscrow: parseInt(clientData.payments_in_escrow)
        },
        provider: {
          totalReceivedPayments: parseInt(providerData.total_received_payments),
          totalEarned: parseFloat(providerData.total_earned),
          pendingEarnings: parseFloat(providerData.pending_earnings),
          completedEarnings: parseFloat(providerData.completed_earnings)
        }
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get payment summary error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get payment summary',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

export default router;

