// 🔧 Admin Routes for UrbanCare
import express from 'express';
import { Database } from '../config/database';
import { logger } from '../utils/logger';

const router = express.Router();

// Admin dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // Get platform statistics
    const stats = {
      totalUsers: 0,
      totalTasks: 0,
      totalBids: 0,
      totalRevenue: 0,
      activeProviders: 0,
      completedTasks: 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch admin dashboard data' }
    });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const result = await Database.query('SELECT * FROM users ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch users' }
    });
  }
});

// Get all tasks (admin only)
router.get('/tasks', async (req, res) => {
  try {
    const result = await Database.query('SELECT * FROM tasks ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch tasks' }
    });
  }
});

// Get all payments (admin only)
router.get('/payments', async (req, res) => {
  try {
    const result = await Database.query('SELECT * FROM payments ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch payments' }
    });
  }
});

// Verify payment (admin only)
router.post('/payments/:paymentId/verify', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { action, adminNotes } = req.body; // action: 'approve' or 'reject'
    
    const status = action === 'approve' ? 'payment_verified' : 'payment_failed';
    
    const result = await Database.query(
      'UPDATE payments SET status = $1, admin_notes = $2, verified_at = NOW() WHERE id = $3 RETURNING *',
      [status, adminNotes, paymentId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Payment not found' }
      });
    }
    
    res.json({
      success: true,
      data: {
        paymentId,
        status,
        message: `Payment ${action}d successfully`
      }
    });
  } catch (error) {
    logger.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to verify payment' }
    });
  }
});

export default router;
