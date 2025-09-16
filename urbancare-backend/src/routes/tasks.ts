import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { ApiResponse, Task, TaskFilters } from '@/types';

const router = Router();

// Create a new task
router.post('/', [
  authenticate,
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('category').isIn(['social_engagement', 'cleaning', 'plumbing', 'electrical', 'delivery', 'events']),
  body('budget').isFloat({ min: 20, max: 100000 }),
  body('urgency').optional().isIn(['urgent', 'soon', 'flexible']),
  body('isRemote').optional().isBoolean(),
  body('locationAddress').optional().trim(),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 })
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
      title,
      description,
      category,
      budget,
      urgency = 'flexible',
      isRemote = false,
      locationAddress,
      latitude,
      longitude,
      preferredStartDate,
      preferredStartTime,
      estimatedDurationHours,
      skillsRequired = [],
      experienceLevel = 'any',
      teamSizeNeeded = 1,
      specialRequirements,
      attachmentUrls = []
    } = req.body;

    // Determine commission rate based on user type
    const userResult = await Database.query(
      'SELECT user_type FROM users WHERE id = $1',
      [req.user!.id]
    );
    
    const userType = userResult.rows[0]?.user_type;
    const commissionRate = userType === 'individual' 
      ? parseFloat(process.env.INDIVIDUAL_COMMISSION_RATE || '5.0')
      : parseFloat(process.env.BUSINESS_COMMISSION_RATE || '10.0');

    // Create task
    const result = await Database.query(`
      INSERT INTO tasks (
        client_id, title, description, category, budget, commission_rate,
        urgency, is_remote, location_address, latitude, longitude,
        preferred_start_date, preferred_start_time, estimated_duration_hours,
        skills_required, experience_level, team_size_needed, 
        special_requirements, attachment_urls
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `, [
      req.user!.id,
      title,
      description,
      category,
      budget,
      commissionRate,
      urgency,
      isRemote,
      locationAddress,
      latitude,
      longitude,
      preferredStartDate || null,
      preferredStartTime || null,
      estimatedDurationHours || null,
      JSON.stringify(skillsRequired),
      experienceLevel,
      teamSizeNeeded,
      specialRequirements || null,
      JSON.stringify(attachmentUrls)
    ]);

    const task = result.rows[0];

    // Emit real-time notification to nearby providers
    const io = req.app.get('io');
    io.emit('new-task-posted', {
      taskId: task.id,
      category: task.category,
      budget: task.budget,
      location: { latitude: task.latitude, longitude: task.longitude },
      urgency: task.urgency
    });

    logger.info(`Task created: ${task.id} by user ${req.user!.id}`);

    res.status(201).json({
      success: true,
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        budget: task.budget,
        commissionRate: task.commission_rate,
        urgency: task.urgency,
        isRemote: task.is_remote,
        locationAddress: task.location_address,
        status: task.status,
        createdAt: task.created_at,
        expiresAt: task.expires_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create task',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get all tasks (with filtering and pagination)
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().trim(),
  query('minBudget').optional().isFloat({ min: 0 }),
  query('maxBudget').optional().isFloat({ min: 0 }),
  query('urgency').optional().isIn(['urgent', 'soon', 'flexible']),
  query('latitude').optional().isFloat({ min: -90, max: 90 }),
  query('longitude').optional().isFloat({ min: -180, max: 180 }),
  query('radiusKm').optional().isFloat({ min: 0, max: 100 }),
  query('status').optional().isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled'])
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
      page = 1,
      limit = 20,
      category,
      minBudget,
      maxBudget,
      urgency,
      latitude,
      longitude,
      radiusKm = 10,
      status = 'open',
      isRemote
    } = req.query as any;

    const offset = (page - 1) * limit;

    // Build dynamic query
    let whereConditions = ['t.status = $1'];
    let queryParams: any[] = [status];
    let paramIndex = 2;

    if (category) {
      whereConditions.push(`t.category = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    if (minBudget) {
      whereConditions.push(`t.budget >= $${paramIndex}`);
      queryParams.push(parseFloat(minBudget));
      paramIndex++;
    }

    if (maxBudget) {
      whereConditions.push(`t.budget <= $${paramIndex}`);
      queryParams.push(parseFloat(maxBudget));
      paramIndex++;
    }

    if (urgency) {
      whereConditions.push(`t.urgency = $${paramIndex}`);
      queryParams.push(urgency);
      paramIndex++;
    }

    if (isRemote !== undefined) {
      whereConditions.push(`t.is_remote = $${paramIndex}`);
      queryParams.push(isRemote === 'true');
      paramIndex++;
    }

    // Location-based filtering
    let distanceSelect = '';
    if (latitude && longitude) {
      distanceSelect = `, 
        CASE 
          WHEN t.latitude IS NOT NULL AND t.longitude IS NOT NULL 
          THEN ST_Distance(
            ST_Point(t.longitude, t.latitude),
            ST_Point($${paramIndex}, $${paramIndex + 1})
          ) * 111.32 
          ELSE NULL 
        END as distance_km`;
      
      whereConditions.push(`
        (t.is_remote = true OR 
         (t.latitude IS NOT NULL AND t.longitude IS NOT NULL AND
          ST_DWithin(
            ST_Point(t.longitude, t.latitude),
            ST_Point($${paramIndex}, $${paramIndex + 1}),
            $${paramIndex + 2} / 111.32
          )))
      `);
      
      queryParams.push(parseFloat(longitude), parseFloat(latitude), parseFloat(radiusKm));
      paramIndex += 3;
    }

    const query = `
      SELECT 
        t.*,
        u.first_name || ' ' || u.last_name as client_name,
        u.user_type as client_type
        ${distanceSelect}
      FROM tasks t
      JOIN users u ON u.id = t.client_id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY 
        CASE WHEN t.urgency = 'urgent' THEN 1 
             WHEN t.urgency = 'soon' THEN 2 
             ELSE 3 END,
        t.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    // Get tasks
    const result = await Database.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks t
      WHERE ${whereConditions.join(' AND ')}
    `;

    const countResult = await Database.query(countQuery, queryParams.slice(0, -2)); // Remove limit and offset
    const total = parseInt(countResult.rows[0].total);

    const tasks = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      budget: parseFloat(row.budget),
      urgency: row.urgency,
      isRemote: row.is_remote,
      locationAddress: row.location_address,
      latitude: row.latitude,
      longitude: row.longitude,
      status: row.status,
      clientName: row.client_name,
      clientType: row.client_type,
      distanceKm: row.distance_km ? parseFloat(row.distance_km) : null,
      bidsCount: row.bids_count,
      createdAt: row.created_at,
      expiresAt: row.expires_at
    }));

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get tasks',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get single task by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await Database.query(`
      SELECT 
        t.*,
        u.first_name || ' ' || u.last_name as client_name,
        u.user_type as client_type,
        u.profile_picture_url as client_avatar,
        COUNT(b.id) as bids_count,
        AVG(r.rating) as client_rating
      FROM tasks t
      JOIN users u ON u.id = t.client_id
      LEFT JOIN bids b ON b.task_id = t.id
      LEFT JOIN reviews r ON r.reviewee_id = u.id AND r.review_type = 'provider_to_client'
      WHERE t.id = $1
      GROUP BY t.id, u.first_name, u.last_name, u.user_type, u.profile_picture_url
    `, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Task not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    const task = result.rows[0];

    // Increment view count
    await Database.query(
      'UPDATE tasks SET views_count = views_count + 1 WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        budget: parseFloat(task.budget),
        commissionRate: parseFloat(task.commission_rate),
        urgency: task.urgency,
        isRemote: task.is_remote,
        locationAddress: task.location_address,
        latitude: task.latitude,
        longitude: task.longitude,
        preferredStartDate: task.preferred_start_date,
        preferredStartTime: task.preferred_start_time,
        estimatedDurationHours: task.estimated_duration_hours,
        skillsRequired: task.skills_required,
        experienceLevel: task.experience_level,
        teamSizeNeeded: task.team_size_needed,
        specialRequirements: task.special_requirements,
        attachmentUrls: task.attachment_urls,
        status: task.status,
        client: {
          name: task.client_name,
          type: task.client_type,
          avatar: task.client_avatar,
          rating: task.client_rating ? parseFloat(task.client_rating) : null
        },
        bidsCount: parseInt(task.bids_count),
        viewsCount: task.views_count,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        expiresAt: task.expires_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Get task error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get task',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Update task status (for clients and assigned providers)
router.patch('/:id/status', [
  authenticate,
  body('status').isIn(['assigned', 'in_progress', 'completed', 'cancelled']),
  body('reason').optional().trim()
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
    const { status, reason } = req.body;

    // Get task and verify permissions
    const taskResult = await Database.query(
      'SELECT client_id, assigned_provider_id, status as current_status FROM tasks WHERE id = $1',
      [id]
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
    const isClient = task.client_id === req.user!.id;
    const isAssignedProvider = task.assigned_provider_id === req.user!.id;

    if (!isClient && !isAssignedProvider) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to update this task',
          statusCode: 403
        }
      } as ApiResponse);
      return;
    }

    // Update task status
    let updateQuery = 'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP';
    let queryParams = [status];
    let paramIndex = 2;

    if (status === 'in_progress') {
      updateQuery += `, started_at = CURRENT_TIMESTAMP`;
    } else if (status === 'completed') {
      updateQuery += `, completed_at = CURRENT_TIMESTAMP`;
    } else if (status === 'cancelled') {
      updateQuery += `, cancelled_at = CURRENT_TIMESTAMP`;
      if (reason) {
        updateQuery += `, cancellation_reason = $${paramIndex}`;
        queryParams.push(reason);
        paramIndex++;
      }
    }

    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    queryParams.push(id);

    const result = await Database.query(updateQuery, queryParams);
    const updatedTask = result.rows[0];

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`task-${id}`).emit('task-status-updated', {
      taskId: id,
      status,
      clientId: task.client_id,
      providerId: task.assigned_provider_id
    });

    logger.info(`Task ${id} status updated to ${status} by user ${req.user!.id}`);

    res.json({
      success: true,
      data: {
        id: updatedTask.id,
        status: updatedTask.status,
        updatedAt: updatedTask.updated_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Update task status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update task status',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Get tasks by client (for client dashboard)
router.get('/client/my-tasks', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereClause = 'WHERE t.client_id = $1';
    const queryParams = [req.user!.id];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND t.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    const result = await Database.query(`
      SELECT 
        t.*,
        COUNT(b.id) as bids_count,
        CASE WHEN t.assigned_provider_id IS NOT NULL 
             THEN (SELECT first_name || ' ' || last_name FROM users WHERE id = t.assigned_provider_id)
             ELSE NULL END as assigned_provider_name
      FROM tasks t
      LEFT JOIN bids b ON b.task_id = t.id
      ${whereClause}
      GROUP BY t.id
      ORDER BY t.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, parseInt(limit as string), offset]);

    const tasks = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      budget: parseFloat(row.budget),
      status: row.status,
      urgency: row.urgency,
      bidsCount: parseInt(row.bids_count),
      assignedProviderName: row.assigned_provider_name,
      createdAt: row.created_at,
      expiresAt: row.expires_at
    }));

    res.json({
      success: true,
      data: tasks
    } as ApiResponse);

  } catch (error) {
    logger.error('Get client tasks error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get client tasks',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

export default router;

