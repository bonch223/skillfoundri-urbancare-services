import { Router, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { ApiResponse } from '@/types';

const router = Router();

// Get user dashboard analytics
router.get('/dashboard', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get client analytics
    const clientAnalytics = await Database.query(`
      SELECT 
        COUNT(CASE WHEN t.created_at >= $2 THEN 1 END) as tasks_posted_30d,
        COUNT(*) as total_tasks_posted,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as tasks_completed,
        COUNT(CASE WHEN t.status = 'open' THEN 1 END) as active_tasks,
        COALESCE(AVG(CASE WHEN t.status = 'completed' THEN t.budget END), 0) as avg_task_budget,
        COALESCE(SUM(p.amount), 0) as total_spent
      FROM tasks t
      LEFT JOIN payments p ON p.task_id = t.id AND p.status = 'released'
      WHERE t.client_id = $1
    `, [userId, thirtyDaysAgo]);

    // Get provider analytics
    const providerAnalytics = await Database.query(`
      SELECT 
        COUNT(CASE WHEN b.created_at >= $2 THEN 1 END) as bids_sent_30d,
        COUNT(*) as total_bids_sent,
        COUNT(CASE WHEN b.status = 'accepted' THEN 1 END) as bids_accepted,
        ROUND(
          CASE WHEN COUNT(*) > 0 
               THEN (COUNT(CASE WHEN b.status = 'accepted' THEN 1 END)::DECIMAL / COUNT(*)) * 100 
               ELSE 0 END, 2
        ) as bid_acceptance_rate,
        COUNT(CASE WHEN t.status = 'completed' AND t.assigned_provider_id = $1 THEN 1 END) as jobs_completed,
        COALESCE(SUM(CASE WHEN p.status = 'released' THEN p.provider_amount ELSE 0 END), 0) as total_earned
      FROM bids b
      LEFT JOIN tasks t ON t.id = b.task_id
      LEFT JOIN payments p ON p.task_id = t.id
      WHERE b.provider_id = $1
    `, [userId, thirtyDaysAgo]);

    // Get recent activity
    const recentActivity = await Database.query(`
      (
        SELECT 'task_posted' as activity_type, t.id as entity_id, t.title as description, t.created_at
        FROM tasks t
        WHERE t.client_id = $1
        ORDER BY t.created_at DESC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 'bid_sent' as activity_type, b.id as entity_id, 
               'Bid sent for: ' || t.title as description, b.created_at
        FROM bids b
        JOIN tasks t ON t.id = b.task_id
        WHERE b.provider_id = $1
        ORDER BY b.created_at DESC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 'bid_received' as activity_type, b.id as entity_id,
               'Bid received from provider' as description, b.created_at
        FROM bids b
        JOIN tasks t ON t.id = b.task_id
        WHERE t.client_id = $1
        ORDER BY b.created_at DESC
        LIMIT 5
      )
      ORDER BY created_at DESC
      LIMIT 10
    `, [userId]);

    // Get earnings by month (for providers)
    const monthlyEarnings = await Database.query(`
      SELECT 
        DATE_TRUNC('month', p.released_at) as month,
        SUM(p.provider_amount) as earnings
      FROM payments p
      WHERE p.provider_id = $1 AND p.status = 'released'
        AND p.released_at >= $2
      GROUP BY DATE_TRUNC('month', p.released_at)
      ORDER BY month
    `, [userId, thirtyDaysAgo]);

    // Get spending by month (for clients)
    const monthlySpending = await Database.query(`
      SELECT 
        DATE_TRUNC('month', p.released_at) as month,
        SUM(p.amount) as spending
      FROM payments p
      WHERE p.client_id = $1 AND p.status = 'released'
        AND p.released_at >= $2
      GROUP BY DATE_TRUNC('month', p.released_at)
      ORDER BY month
    `, [userId, thirtyDaysAgo]);

    const clientData = clientAnalytics.rows[0];
    const providerData = providerAnalytics.rows[0];

    res.json({
      success: true,
      data: {
        client: {
          tasksPosted30d: parseInt(clientData.tasks_posted_30d),
          totalTasksPosted: parseInt(clientData.total_tasks_posted),
          tasksCompleted: parseInt(clientData.tasks_completed),
          activeTasks: parseInt(clientData.active_tasks),
          avgTaskBudget: parseFloat(clientData.avg_task_budget),
          totalSpent: parseFloat(clientData.total_spent),
          monthlySpending: monthlySpending.rows.map(row => ({
            month: row.month,
            amount: parseFloat(row.spending)
          }))
        },
        provider: {
          bidsSent30d: parseInt(providerData.bids_sent_30d),
          totalBidsSent: parseInt(providerData.total_bids_sent),
          bidsAccepted: parseInt(providerData.bids_accepted),
          bidAcceptanceRate: parseFloat(providerData.bid_acceptance_rate),
          jobsCompleted: parseInt(providerData.jobs_completed),
          totalEarned: parseFloat(providerData.total_earned),
          monthlyEarnings: monthlyEarnings.rows.map(row => ({
            month: row.month,
            amount: parseFloat(row.earnings)
          }))
        },
        recentActivity: recentActivity.rows.map(row => ({
          type: row.activity_type,
          entityId: row.entity_id,
          description: row.description,
          timestamp: row.created_at
        }))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get dashboard analytics',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get platform statistics (public)
router.get('/platform-stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Database.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE is_active = true) as total_users,
        (SELECT COUNT(*) FROM users WHERE is_active = true AND user_type = 'individual') as individual_users,
        (SELECT COUNT(*) FROM users WHERE is_active = true AND user_type = 'small_business') as business_users,
        (SELECT COUNT(*) FROM provider_profiles WHERE is_verified = true) as verified_providers,
        (SELECT COUNT(*) FROM tasks) as total_tasks,
        (SELECT COUNT(*) FROM tasks WHERE status = 'completed') as completed_tasks,
        (SELECT COUNT(*) FROM tasks WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as tasks_this_month,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'released') as total_gmv,
        (SELECT COALESCE(SUM(commission_amount), 0) FROM payments WHERE status = 'released') as total_commission,
        (SELECT COALESCE(AVG(rating), 0) FROM reviews) as avg_platform_rating
    `);

    const data = stats.rows[0];

    res.json({
      success: true,
      data: {
        users: {
          total: parseInt(data.total_users),
          individual: parseInt(data.individual_users),
          business: parseInt(data.business_users),
          verifiedProviders: parseInt(data.verified_providers)
        },
        tasks: {
          total: parseInt(data.total_tasks),
          completed: parseInt(data.completed_tasks),
          thisMonth: parseInt(data.tasks_this_month)
        },
        financial: {
          totalGMV: parseFloat(data.total_gmv),
          totalCommission: parseFloat(data.total_commission)
        },
        quality: {
          avgPlatformRating: parseFloat(data.avg_platform_rating)
        }
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get platform stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get platform statistics',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get task analytics by category
router.get('/tasks/categories', [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']),
  query('userType').optional().isIn(['individual', 'small_business'])
], async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = '30d', userType } = req.query;

    // Calculate date range
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    let userTypeFilter = '';
    const queryParams = [startDate];
    let paramIndex = 2;

    if (userType) {
      userTypeFilter = `AND u.user_type = $${paramIndex}`;
      queryParams.push(userType);
      paramIndex++;
    }

    const result = await Database.query(`
      SELECT 
        t.category,
        COUNT(*) as task_count,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_count,
        COALESCE(AVG(t.budget), 0) as avg_budget,
        COALESCE(AVG(b.amount), 0) as avg_bid_amount,
        COALESCE(AVG(
          EXTRACT(EPOCH FROM (t.completed_at - t.created_at)) / 86400
        ), 0) as avg_completion_days
      FROM tasks t
      JOIN users u ON u.id = t.client_id
      LEFT JOIN bids b ON b.task_id = t.id AND b.status = 'accepted'
      WHERE t.created_at >= $1 ${userTypeFilter}
      GROUP BY t.category
      ORDER BY task_count DESC
    `, queryParams);

    const categories = result.rows.map(row => ({
      category: row.category,
      taskCount: parseInt(row.task_count),
      completedCount: parseInt(row.completed_count),
      completionRate: row.task_count > 0 ? 
        Math.round((row.completed_count / row.task_count) * 100) : 0,
      avgBudget: parseFloat(row.avg_budget),
      avgBidAmount: parseFloat(row.avg_bid_amount),
      avgCompletionDays: parseFloat(row.avg_completion_days)
    }));

    res.json({
      success: true,
      data: {
        period,
        userType: userType || 'all',
        categories
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get task category analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get task category analytics',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get provider performance analytics
router.get('/providers/performance', [
  authenticate,
  query('period').optional().isIn(['7d', '30d', '90d', '1y'])
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { period = '30d' } = req.query;
    const userId = req.user!.id;

    // Calculate date range
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get performance metrics
    const performance = await Database.query(`
      SELECT 
        COUNT(b.id) as total_bids,
        COUNT(CASE WHEN b.status = 'accepted' THEN 1 END) as accepted_bids,
        COUNT(CASE WHEN t.status = 'completed' AND t.assigned_provider_id = $1 THEN 1 END) as completed_jobs,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COALESCE(SUM(p.provider_amount), 0) as total_earnings,
        COALESCE(AVG(
          EXTRACT(EPOCH FROM (b.created_at - t.created_at)) / 3600
        ), 0) as avg_response_time_hours
      FROM bids b
      JOIN tasks t ON t.id = b.task_id
      LEFT JOIN reviews r ON r.task_id = t.id AND r.reviewee_id = $1 AND r.review_type = 'client_to_provider'
      LEFT JOIN payments p ON p.task_id = t.id AND p.provider_id = $1 AND p.status = 'released'
      WHERE b.provider_id = $1 AND b.created_at >= $2
    `, [userId, startDate]);

    // Get daily metrics for chart
    const dailyMetrics = await Database.query(`
      SELECT 
        DATE(b.created_at) as date,
        COUNT(b.id) as bids_sent,
        COUNT(CASE WHEN b.status = 'accepted' THEN 1 END) as bids_accepted,
        COALESCE(SUM(CASE WHEN p.status = 'released' THEN p.provider_amount ELSE 0 END), 0) as earnings
      FROM bids b
      LEFT JOIN payments p ON p.task_id = b.task_id AND p.provider_id = $1
      WHERE b.provider_id = $1 AND b.created_at >= $2
      GROUP BY DATE(b.created_at)
      ORDER BY date
    `, [userId, startDate]);

    // Get category performance
    const categoryPerformance = await Database.query(`
      SELECT 
        t.category,
        COUNT(b.id) as bids_sent,
        COUNT(CASE WHEN b.status = 'accepted' THEN 1 END) as bids_accepted,
        COALESCE(AVG(b.amount), 0) as avg_bid_amount,
        COALESCE(SUM(CASE WHEN p.status = 'released' THEN p.provider_amount ELSE 0 END), 0) as total_earnings
      FROM bids b
      JOIN tasks t ON t.id = b.task_id
      LEFT JOIN payments p ON p.task_id = t.id AND p.provider_id = $1 AND p.status = 'released'
      WHERE b.provider_id = $1 AND b.created_at >= $2
      GROUP BY t.category
      ORDER BY bids_sent DESC
    `, [userId, startDate]);

    const performanceData = performance.rows[0];

    res.json({
      success: true,
      data: {
        period,
        summary: {
          totalBids: parseInt(performanceData.total_bids),
          acceptedBids: parseInt(performanceData.accepted_bids),
          acceptanceRate: performanceData.total_bids > 0 ? 
            Math.round((performanceData.accepted_bids / performanceData.total_bids) * 100) : 0,
          completedJobs: parseInt(performanceData.completed_jobs),
          avgRating: parseFloat(performanceData.avg_rating),
          totalEarnings: parseFloat(performanceData.total_earnings),
          avgResponseTimeHours: parseFloat(performanceData.avg_response_time_hours)
        },
        dailyMetrics: dailyMetrics.rows.map(row => ({
          date: row.date,
          bidsSent: parseInt(row.bids_sent),
          bidsAccepted: parseInt(row.bids_accepted),
          earnings: parseFloat(row.earnings)
        })),
        categoryPerformance: categoryPerformance.rows.map(row => ({
          category: row.category,
          bidsSent: parseInt(row.bids_sent),
          bidsAccepted: parseInt(row.bids_accepted),
          acceptanceRate: row.bids_sent > 0 ? 
            Math.round((row.bids_accepted / row.bids_sent) * 100) : 0,
          avgBidAmount: parseFloat(row.avg_bid_amount),
          totalEarnings: parseFloat(row.total_earnings)
        }))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get provider performance analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get provider performance analytics',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

export default router;

