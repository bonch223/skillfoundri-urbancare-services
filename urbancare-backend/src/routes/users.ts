import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Database } from '@/database/connection';
import { logger } from '@/utils/logger';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';
import { ApiResponse } from '@/types';

const router = Router();

// Get user profile by ID (public information)
router.get('/:id/profile', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await Database.query(`
      SELECT 
        u.id, u.first_name, u.last_name, u.user_type, u.city, u.province,
        u.profile_picture_url, u.is_verified, u.created_at,
        pp.bio, pp.years_of_experience, pp.skills, pp.average_rating, 
        pp.total_jobs_completed, pp.total_reviews, pp.is_available,
        bp.business_name, bp.business_type, bp.business_description
      FROM users u
      LEFT JOIN provider_profiles pp ON pp.user_id = u.id
      LEFT JOIN business_profiles bp ON bp.user_id = u.id
      WHERE u.id = $1 AND u.is_active = true
    `, [id]);

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

    const profile: any = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      userType: user.user_type,
      city: user.city,
      province: user.province,
      profilePictureUrl: user.profile_picture_url,
      isVerified: user.is_verified,
      createdAt: user.created_at
    };

    // Add provider-specific information
    if (user.bio || user.years_of_experience || user.skills) {
      profile.provider = {
        bio: user.bio,
        yearsOfExperience: user.years_of_experience,
        skills: user.skills,
        averageRating: parseFloat(user.average_rating) || 0,
        totalJobsCompleted: user.total_jobs_completed || 0,
        totalReviews: user.total_reviews || 0,
        isAvailable: user.is_available
      };
    }

    // Add business-specific information
    if (user.business_name) {
      profile.business = {
        name: user.business_name,
        type: user.business_type,
        description: user.business_description
      };
    }

    res.json({
      success: true,
      data: profile
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

// Update user profile
router.put('/profile', [
  authenticate,
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('phone').optional().isMobilePhone('any'),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('profilePictureUrl').optional().isURL()
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
      firstName,
      lastName,
      phone,
      address,
      city,
      profilePictureUrl
    } = req.body;

    const updateFields: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (firstName) {
      updateFields.push(`first_name = $${paramIndex}`);
      queryParams.push(firstName);
      paramIndex++;
    }

    if (lastName) {
      updateFields.push(`last_name = $${paramIndex}`);
      queryParams.push(lastName);
      paramIndex++;
    }

    if (phone) {
      updateFields.push(`phone = $${paramIndex}`);
      queryParams.push(phone);
      paramIndex++;
    }

    if (address) {
      updateFields.push(`address = $${paramIndex}`);
      queryParams.push(address);
      paramIndex++;
    }

    if (city) {
      updateFields.push(`city = $${paramIndex}`);
      queryParams.push(city);
      paramIndex++;
    }

    if (profilePictureUrl) {
      updateFields.push(`profile_picture_url = $${paramIndex}`);
      queryParams.push(profilePictureUrl);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          message: 'No fields to update',
          statusCode: 400
        }
      } as ApiResponse);
      return;
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    queryParams.push(req.user!.id);

    const result = await Database.query(`
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, first_name, last_name, phone, address, city, profile_picture_url, updated_at
    `, queryParams);

    const updatedUser = result.rows[0];

    logger.info(`User profile updated: ${req.user!.id}`);

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        profilePictureUrl: updatedUser.profile_picture_url,
        updatedAt: updatedUser.updated_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update profile',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Create or update provider profile
router.put('/provider-profile', [
  authenticate,
  body('bio').optional().trim().isLength({ max: 1000 }),
  body('yearsOfExperience').optional().isInt({ min: 0, max: 50 }),
  body('hourlyRate').optional().isFloat({ min: 0 }),
  body('skills').optional().isArray(),
  body('serviceCategories').optional().isArray(),
  body('maxDistanceKm').optional().isInt({ min: 1, max: 100 })
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
      bio,
      yearsOfExperience,
      hourlyRate,
      skills = [],
      serviceCategories = [],
      maxDistanceKm = 10,
      portfolioDescription,
      workingHours
    } = req.body;

    // Check if provider profile exists
    const existingProfile = await Database.query(
      'SELECT id FROM provider_profiles WHERE user_id = $1',
      [req.user!.id]
    );

    let result;
    if (existingProfile.rows.length > 0) {
      // Update existing profile
      result = await Database.query(`
        UPDATE provider_profiles 
        SET 
          bio = COALESCE($1, bio),
          years_of_experience = COALESCE($2, years_of_experience),
          hourly_rate = COALESCE($3, hourly_rate),
          skills = COALESCE($4, skills),
          service_categories = COALESCE($5, service_categories),
          max_distance_km = COALESCE($6, max_distance_km),
          portfolio_description = COALESCE($7, portfolio_description),
          working_hours = COALESCE($8, working_hours),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $9
        RETURNING *
      `, [
        bio,
        yearsOfExperience,
        hourlyRate,
        JSON.stringify(skills),
        JSON.stringify(serviceCategories),
        maxDistanceKm,
        portfolioDescription,
        workingHours ? JSON.stringify(workingHours) : null,
        req.user!.id
      ]);
    } else {
      // Create new profile
      result = await Database.query(`
        INSERT INTO provider_profiles (
          user_id, bio, years_of_experience, hourly_rate, skills, 
          service_categories, max_distance_km, portfolio_description, working_hours
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        req.user!.id,
        bio,
        yearsOfExperience || 0,
        hourlyRate,
        JSON.stringify(skills),
        JSON.stringify(serviceCategories),
        maxDistanceKm,
        portfolioDescription,
        workingHours ? JSON.stringify(workingHours) : JSON.stringify({
          monday: { start: "08:00", end: "18:00", available: true },
          tuesday: { start: "08:00", end: "18:00", available: true },
          wednesday: { start: "08:00", end: "18:00", available: true },
          thursday: { start: "08:00", end: "18:00", available: true },
          friday: { start: "08:00", end: "18:00", available: true },
          saturday: { start: "08:00", end: "17:00", available: true },
          sunday: { start: "09:00", end: "17:00", available: false }
        })
      ]);
    }

    const profile = result.rows[0];

    logger.info(`Provider profile ${existingProfile.rows.length > 0 ? 'updated' : 'created'}: ${req.user!.id}`);

    res.json({
      success: true,
      data: {
        id: profile.id,
        bio: profile.bio,
        yearsOfExperience: profile.years_of_experience,
        hourlyRate: profile.hourly_rate,
        skills: profile.skills,
        serviceCategories: profile.service_categories,
        maxDistanceKm: profile.max_distance_km,
        portfolioDescription: profile.portfolio_description,
        workingHours: profile.working_hours,
        isAvailable: profile.is_available,
        totalJobsCompleted: profile.total_jobs_completed,
        averageRating: parseFloat(profile.average_rating),
        updatedAt: profile.updated_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Update provider profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update provider profile',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Create or update business profile
router.put('/business-profile', [
  authenticate,
  body('businessName').trim().isLength({ min: 1, max: 200 }),
  body('businessType').optional().trim(),
  body('businessDescription').optional().trim().isLength({ max: 1000 }),
  body('businessAddress').optional().trim(),
  body('businessPhone').optional().isMobilePhone('any'),
  body('businessEmail').optional().isEmail(),
  body('websiteUrl').optional().isURL(),
  body('facebookPage').optional().trim(),
  body('instagramHandle').optional().trim(),
  body('tiktokHandle').optional().trim()
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

    // Only allow small_business users to create business profiles
    if (req.user!.userType !== 'small_business') {
      res.status(403).json({
        success: false,
        error: {
          message: 'Only small business users can create business profiles',
          statusCode: 403
        }
      } as ApiResponse);
      return;
    }

    const {
      businessName,
      businessType,
      businessDescription,
      businessAddress,
      businessPhone,
      businessEmail,
      websiteUrl,
      facebookPage,
      instagramHandle,
      tiktokHandle
    } = req.body;

    // Check if business profile exists
    const existingProfile = await Database.query(
      'SELECT id FROM business_profiles WHERE user_id = $1',
      [req.user!.id]
    );

    let result;
    if (existingProfile.rows.length > 0) {
      // Update existing profile
      result = await Database.query(`
        UPDATE business_profiles 
        SET 
          business_name = $1,
          business_type = COALESCE($2, business_type),
          business_description = COALESCE($3, business_description),
          business_address = COALESCE($4, business_address),
          business_phone = COALESCE($5, business_phone),
          business_email = COALESCE($6, business_email),
          website_url = COALESCE($7, website_url),
          facebook_page = COALESCE($8, facebook_page),
          instagram_handle = COALESCE($9, instagram_handle),
          tiktok_handle = COALESCE($10, tiktok_handle),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $11
        RETURNING *
      `, [
        businessName,
        businessType,
        businessDescription,
        businessAddress,
        businessPhone,
        businessEmail,
        websiteUrl,
        facebookPage,
        instagramHandle,
        tiktokHandle,
        req.user!.id
      ]);
    } else {
      // Create new profile
      result = await Database.query(`
        INSERT INTO business_profiles (
          user_id, business_name, business_type, business_description,
          business_address, business_phone, business_email, website_url,
          facebook_page, instagram_handle, tiktok_handle
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        req.user!.id,
        businessName,
        businessType,
        businessDescription,
        businessAddress,
        businessPhone,
        businessEmail,
        websiteUrl,
        facebookPage,
        instagramHandle,
        tiktokHandle
      ]);
    }

    const profile = result.rows[0];

    logger.info(`Business profile ${existingProfile.rows.length > 0 ? 'updated' : 'created'}: ${req.user!.id}`);

    res.json({
      success: true,
      data: {
        id: profile.id,
        businessName: profile.business_name,
        businessType: profile.business_type,
        businessDescription: profile.business_description,
        businessAddress: profile.business_address,
        businessPhone: profile.business_phone,
        businessEmail: profile.business_email,
        websiteUrl: profile.website_url,
        facebookPage: profile.facebook_page,
        instagramHandle: profile.instagram_handle,
        tiktokHandle: profile.tiktok_handle,
        isVerified: profile.is_verified,
        updatedAt: profile.updated_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Update business profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update business profile',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Toggle provider availability
router.patch('/provider/availability', [
  authenticate,
  body('isAvailable').isBoolean()
], async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { isAvailable } = req.body;

    const result = await Database.query(`
      UPDATE provider_profiles 
      SET is_available = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING is_available, updated_at
    `, [isAvailable, req.user!.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Provider profile not found',
          statusCode: 404
        }
      } as ApiResponse);
      return;
    }

    const profile = result.rows[0];

    logger.info(`Provider availability updated: ${req.user!.id} - ${isAvailable}`);

    res.json({
      success: true,
      data: {
        isAvailable: profile.is_available,
        updatedAt: profile.updated_at
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Update provider availability error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update availability',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

// Search providers by skills and location
router.get('/providers/search', [
  query('skills').optional().isArray(),
  query('category').optional().trim(),
  query('latitude').optional().isFloat({ min: -90, max: 90 }),
  query('longitude').optional().isFloat({ min: -180, max: 180 }),
  query('radiusKm').optional().isFloat({ min: 0, max: 100 }),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('isAvailable').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      skills,
      category,
      latitude,
      longitude,
      radiusKm = 10,
      minRating = 0,
      isAvailable = true,
      page = 1,
      limit = 20
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions = ['pp.is_available = $1', 'pp.average_rating >= $2', 'u.is_active = true'];
    let queryParams: any[] = [isAvailable, parseFloat(minRating as string)];
    let paramIndex = 3;

    if (skills && Array.isArray(skills) && skills.length > 0) {
      whereConditions.push(`pp.skills ?| array[$${paramIndex}]`);
      queryParams.push(skills);
      paramIndex++;
    }

    if (category) {
      whereConditions.push(`pp.service_categories @> $${paramIndex}`);
      queryParams.push(JSON.stringify([category]));
      paramIndex++;
    }

    // Location-based filtering
    let distanceSelect = '';
    if (latitude && longitude) {
      distanceSelect = `, 
        ST_Distance(
          ST_Point(u.longitude, u.latitude),
          ST_Point($${paramIndex}, $${paramIndex + 1})
        ) * 111.32 as distance_km`;
      
      whereConditions.push(`
        u.latitude IS NOT NULL AND u.longitude IS NOT NULL AND
        ST_DWithin(
          ST_Point(u.longitude, u.latitude),
          ST_Point($${paramIndex}, $${paramIndex + 1}),
          $${paramIndex + 2} / 111.32
        )
      `);
      
      queryParams.push(parseFloat(longitude as string), parseFloat(latitude as string), parseFloat(radiusKm as string));
      paramIndex += 3;
    }

    const query = `
      SELECT 
        u.id, u.first_name, u.last_name, u.city, u.profile_picture_url, u.is_verified,
        pp.bio, pp.years_of_experience, pp.hourly_rate, pp.skills, pp.service_categories,
        pp.average_rating, pp.total_jobs_completed, pp.total_reviews, pp.response_time_minutes
        ${distanceSelect}
      FROM users u
      JOIN provider_profiles pp ON pp.user_id = u.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY pp.average_rating DESC, pp.total_jobs_completed DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(parseInt(limit as string), offset);

    const result = await Database.query(query, queryParams);

    const providers = result.rows.map(row => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      city: row.city,
      profilePictureUrl: row.profile_picture_url,
      isVerified: row.is_verified,
      bio: row.bio,
      yearsOfExperience: row.years_of_experience,
      hourlyRate: row.hourly_rate,
      skills: row.skills,
      serviceCategories: row.service_categories,
      averageRating: parseFloat(row.average_rating),
      totalJobsCompleted: row.total_jobs_completed,
      totalReviews: row.total_reviews,
      responseTimeMinutes: row.response_time_minutes,
      distanceKm: row.distance_km ? parseFloat(row.distance_km) : null
    }));

    res.json({
      success: true,
      data: providers,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: providers.length,
        totalPages: Math.ceil(providers.length / parseInt(limit as string))
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Search providers error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to search providers',
        statusCode: 500
      }
    } as ApiResponse);
  }
});

export default router;

