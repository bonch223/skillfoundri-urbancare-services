import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { ApiResponse } from '@/types';

const router = Router();

// Create a review
router.post('/', [
  authenticate,
  body('taskId').isUUID(),
  body('revieweeId').isUUID(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('title').optional().trim().isLength({ max: 200 }),
  body('comment').optional().trim().isLength({ max: 1000 }),
  body('communicationRating').optional().isInt({ min: 1, max: 5 }),
  body('qualityRating').optional().isInt({ min: 1, max: 5 }),
  body('timelinessRating').optional().isInt({ min: 1, max: 5 }),
  body('valueRating').optional().isInt({ min: 1, max: 5 })
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
      revieweeId,
      rating,
      title,
      comment,
      communicationRating,
      qualityRating,
      timelinessRating,
      valueRating
    } = req.body;

    // Verify task exists and user is involved
    const taskResult = await Database.query(`
      SELECT client_id, assigned_provider_id, status
      FROM tasks
      WHERE id = $1
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

    if (task.status !== 'completed') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Reviews can only be submitted for completed tasks',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    // Determine review type and validate participants
    let reviewType: string;
    if (req.user!.id === task.client_id && revieweeId === task.assigned_provider_id) {
      reviewType = 'client_to_provider';
    } else if (req.user!.id === task.assigned_provider_id && revieweeId === task.client_id) {
      reviewType = 'provider_to_client';
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid review participants',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    // Check if review already exists
    const existingReview = await Database.query(
      'SELECT id FROM reviews WHERE task_id = $1 AND reviewer_id = $2',
      [taskId, req.user!.id]
    );

    if (existingReview.rows.length > 0) {
      res.status(409).json({
        success: false,
        error: {
          message: 'Review already submitted for this task',
          statusCode: 409
        }
      } as ApiResponse);
      return;
    }

    // Create review
    const result = await Database.query(`
      INSERT INTO reviews (
        task_id, reviewer_id, reviewee_id, rating, title, comment,
        review_type, communication_rating, quality_rating, 
        timeliness_rating, value_rating
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      taskId,
      req.user!.id,
      revieweeId,
      rating,
      title,
      comment,
      reviewType,
      communicationRating,
      qualityRating,
      timelinessRating,
      valueRating
    ]);

    const review = result.rows[0];

    // Update provider rating if this is a client-to-provider review
    if (reviewType === 'client_to_provider') {
      // This will be handled by the database trigger
    }

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`user-${revieweeId}`).emit('new-review', {
      reviewId: review.id,
      taskId,
      rating: review.rating,
      reviewType
    });

    logger.info(`Review created: ${review.id} for task ${taskId} by ${req.user!.id}`);

    res.status(201).json({
      success: true,
      data: {
        id: review.id,
        taskId: review.task_id,
        revieweeId: review.reviewee_id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        reviewType: review.review_type,
        communicationRating: review.communication_rating,
        qualityRating: review.quality_rating,
        timelinessRating: review.timeliness_rating,
        valueRating: review.value_rating,
        createdAt: review.created_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Create review error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create review',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get reviews for a user
router.get('/user/:userId', [
  query('type').optional().isIn(['received', 'given']),
  query('reviewType').optional().isIn(['client_to_provider', 'provider_to_client']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { type = 'received', reviewType, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions = ['r.is_public = true'];
    let queryParams: any[] = [];
    let paramIndex = 1;

    // Filter by review direction
    if (type === 'received') {
      whereConditions.push(`r.reviewee_id = $${paramIndex}`);
    } else {
      whereConditions.push(`r.reviewer_id = $${paramIndex}`);
    }
    queryParams.push(userId);
    paramIndex++;

    if (reviewType) {
      whereConditions.push(`r.review_type = $${paramIndex}`);
      queryParams.push(reviewType);
      paramIndex++;
    }

    const result = await Database.query(`
      SELECT 
        r.*,
        t.title as task_title, t.category,
        reviewer.first_name || ' ' || reviewer.last_name as reviewer_name,
        reviewer.profile_picture_url as reviewer_avatar
      FROM reviews r
      JOIN tasks t ON t.id = r.task_id
      JOIN users reviewer ON reviewer.id = r.reviewer_id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, parseInt(limit as string), offset]);

    const reviews = result.rows.map(row => ({
      id: row.id,
      taskId: row.task_id,
      task: {
        title: row.task_title,
        category: row.category
      },
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      reviewType: row.review_type,
      communicationRating: row.communication_rating,
      qualityRating: row.quality_rating,
      timelinessRating: row.timeliness_rating,
      valueRating: row.value_rating,
      reviewer: {
        name: row.reviewer_name,
        avatar: row.reviewer_avatar
      },
      createdAt: row.created_at
    }));

    // Get average rating
    const ratingResult = await Database.query(`
      SELECT 
        AVG(rating)::DECIMAL(3,2) as average_rating,
        COUNT(*) as total_reviews
      FROM reviews 
      WHERE reviewee_id = $1 AND review_type = $2 AND is_public = true
    `, [userId, reviewType || 'client_to_provider']);

    const ratingData = ratingResult.rows[0];

    res.json({
      success: true,
      data: {
        reviews,
        summary: {
          averageRating: ratingData.average_rating ? parseFloat(ratingData.average_rating) : 0,
          totalReviews: parseInt(ratingData.total_reviews)
        }
      },
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: reviews.length,
        totalPages: Math.ceil(reviews.length / parseInt(limit as string))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get user reviews',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get reviews for a task
router.get('/task/:taskId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;

    const result = await Database.query(`
      SELECT 
        r.*,
        reviewer.first_name || ' ' || reviewer.last_name as reviewer_name,
        reviewer.profile_picture_url as reviewer_avatar,
        reviewee.first_name || ' ' || reviewee.last_name as reviewee_name
      FROM reviews r
      JOIN users reviewer ON reviewer.id = r.reviewer_id
      JOIN users reviewee ON reviewee.id = r.reviewee_id
      WHERE r.task_id = $1 AND r.is_public = true
      ORDER BY r.created_at DESC
    `, [taskId]);

    const reviews = result.rows.map(row => ({
      id: row.id,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      reviewType: row.review_type,
      communicationRating: row.communication_rating,
      qualityRating: row.quality_rating,
      timelinessRating: row.timeliness_rating,
      valueRating: row.value_rating,
      reviewer: {
        name: row.reviewer_name,
        avatar: row.reviewer_avatar
      },
      reviewee: {
        name: row.reviewee_name
      },
      createdAt: row.created_at
    }));

    res.json({
      success: true,
      data: reviews
    } as ApiResponse);

  } catch (error) {
    logger.error('Get task reviews error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get task reviews',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get review statistics
router.get('/stats/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Get provider rating breakdown
    const providerStats = await Database.query(`
      SELECT 
        AVG(rating)::DECIMAL(3,2) as overall_rating,
        AVG(communication_rating)::DECIMAL(3,2) as communication_rating,
        AVG(quality_rating)::DECIMAL(3,2) as quality_rating,
        AVG(timeliness_rating)::DECIMAL(3,2) as timeliness_rating,
        AVG(value_rating)::DECIMAL(3,2) as value_rating,
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
      FROM reviews 
      WHERE reviewee_id = $1 AND review_type = 'client_to_provider' AND is_public = true
    `, [userId]);

    // Get client rating
    const clientStats = await Database.query(`
      SELECT 
        AVG(rating)::DECIMAL(3,2) as overall_rating,
        COUNT(*) as total_reviews
      FROM reviews 
      WHERE reviewee_id = $1 AND review_type = 'provider_to_client' AND is_public = true
    `, [userId]);

    const providerData = providerStats.rows[0];
    const clientData = clientStats.rows[0];

    res.json({
      success: true,
      data: {
        provider: {
          overallRating: providerData.overall_rating ? parseFloat(providerData.overall_rating) : 0,
          communicationRating: providerData.communication_rating ? parseFloat(providerData.communication_rating) : 0,
          qualityRating: providerData.quality_rating ? parseFloat(providerData.quality_rating) : 0,
          timelinessRating: providerData.timeliness_rating ? parseFloat(providerData.timeliness_rating) : 0,
          valueRating: providerData.value_rating ? parseFloat(providerData.value_rating) : 0,
          totalReviews: parseInt(providerData.total_reviews),
          ratingDistribution: {
            5: parseInt(providerData.five_star_count),
            4: parseInt(providerData.four_star_count),
            3: parseInt(providerData.three_star_count),
            2: parseInt(providerData.two_star_count),
            1: parseInt(providerData.one_star_count)
          }
        },
        client: {
          overallRating: clientData.overall_rating ? parseFloat(clientData.overall_rating) : 0,
          totalReviews: parseInt(clientData.total_reviews)
        }
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get review statistics',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Flag a review
router.patch('/:id/flag', [
  authenticate,
  body('reason').trim().isLength({ min: 1, max: 500 })
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

    // Check if review exists
    const reviewResult = await Database.query(
      'SELECT reviewee_id FROM reviews WHERE id = $1',
      [id]
    );

    if (reviewResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Review not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    // Flag the review
    await Database.query(`
      UPDATE reviews 
      SET is_flagged = true, flagged_reason = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [reason, id]);

    logger.info(`Review flagged: ${id} by user ${req.user!.id} - Reason: ${reason}`);

    res.json({
      success: true,
      data: {
        reviewId: id,
        flagged: true,
        reason
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Flag review error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to flag review',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

export default router;

