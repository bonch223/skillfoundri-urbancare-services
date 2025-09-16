import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import { authenticateToken, requireCustomer } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (Customer only)
router.post('/', [
  authenticateToken,
  requireCustomer,
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('serviceName').notEmpty().withMessage('Service name is required'),
  body('packageType').isIn(['basic', 'standard', 'premium']).withMessage('Invalid package type'),
  body('packageName').notEmpty().withMessage('Package name is required'),
  body('price').notEmpty().withMessage('Price is required'),
  body('scheduledDate').isISO8601().withMessage('Valid date is required'),
  body('scheduledTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
  body('serviceAddress').trim().isLength({ min: 10 }).withMessage('Service address must be at least 10 characters'),
  body('contactPhone').matches(/^\d{10,11}$/).withMessage('Valid phone number required (10-11 digits)')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      serviceId,
      serviceName,
      packageType,
      packageName,
      price,
      duration,
      scheduledDate,
      scheduledTime,
      serviceAddress,
      contactPhone,
      specialInstructions
    } = req.body;

    // Generate booking reference
    const bookingReference = `UC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate estimated completion time
    const startDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const durationHours = parseInt(duration?.split('-')[1] || duration?.split(' ')[0]) || 2;
    const estimatedCompletionTime = new Date(startDateTime.getTime() + (durationHours * 60 * 60 * 1000));

    // Create new booking
    const booking = new Booking({
      bookingReference,
      customerId: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      serviceId,
      serviceName,
      packageType,
      packageName,
      price,
      duration: duration || '2 hours',
      scheduledDate,
      scheduledTime,
      serviceAddress: serviceAddress.trim(),
      contactPhone,
      specialInstructions: specialInstructions?.trim() || '',
      status: 'pending',
      paymentStatus: 'pending',
      estimatedCompletionTime
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        bookingReference: booking.bookingReference,
        customerId: booking.customerId,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        serviceId: booking.serviceId,
        serviceName: booking.serviceName,
        packageType: booking.packageType,
        packageName: booking.packageName,
        price: booking.price,
        duration: booking.duration,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        serviceAddress: booking.serviceAddress,
        contactPhone: booking.contactPhone,
        specialInstructions: booking.specialInstructions,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
        estimatedCompletionTime: booking.estimatedCompletionTime
      }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get current user's bookings
// @access  Private (Customer only)
router.get('/my-bookings', [authenticateToken, requireCustomer], async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .sort({ createdAt: -1 }); // Most recent first

    const bookingsData = bookings.map(booking => ({
      id: booking._id,
      bookingReference: booking.bookingReference,
      serviceName: booking.serviceName,
      packageName: booking.packageName,
      price: booking.price,
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      serviceAddress: booking.serviceAddress,
      contactPhone: booking.contactPhone,
      specialInstructions: booking.specialInstructions,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      estimatedCompletionTime: booking.estimatedCompletionTime
    }));

    res.json({
      message: 'Bookings retrieved successfully',
      bookings: bookingsData,
      total: bookingsData.length
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error retrieving bookings' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get specific booking by ID
// @access  Private (Customer only - own bookings)
router.get('/:id', [authenticateToken, requireCustomer], async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customerId: req.user._id // Only allow access to own bookings
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingData = {
      id: booking._id,
      bookingReference: booking.bookingReference,
      customerId: booking.customerId,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      serviceId: booking.serviceId,
      serviceName: booking.serviceName,
      packageType: booking.packageType,
      packageName: booking.packageName,
      price: booking.price,
      duration: booking.duration,
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      serviceAddress: booking.serviceAddress,
      contactPhone: booking.contactPhone,
      specialInstructions: booking.specialInstructions,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      estimatedCompletionTime: booking.estimatedCompletionTime
    };

    res.json({
      message: 'Booking retrieved successfully',
      booking: bookingData
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error retrieving booking' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (For now, customer can cancel, later add provider access)
router.put('/:id/status', [
  authenticateToken,
  body('status').isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status, reason } = req.body;

    // Find booking
    const booking = await Booking.findOne({
      _id: req.params.id,
      customerId: req.user._id // Only allow customers to modify their own bookings
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow customers to cancel their bookings
    if (req.user.userType === 'customer' && status !== 'cancelled') {
      return res.status(403).json({ message: 'Customers can only cancel bookings' });
    }

    // Update booking status
    booking.status = status;
    booking.updatedAt = new Date();

    if (status === 'cancelled') {
      booking.cancellationReason = reason || 'Cancelled by customer';
      booking.cancelledAt = new Date();
    }

    await booking.save();

    const bookingData = {
      id: booking._id,
      bookingReference: booking.bookingReference,
      serviceName: booking.serviceName,
      packageName: booking.packageName,
      status: booking.status,
      updatedAt: booking.updatedAt,
      cancellationReason: booking.cancellationReason,
      cancelledAt: booking.cancelledAt
    };

    res.json({
      message: `Booking ${status} successfully`,
      booking: bookingData
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
});

// @route   GET /api/bookings/stats
// @desc    Get booking statistics for current user
// @access  Private (Customer only)
router.get('/stats/summary', [authenticateToken, requireCustomer], async (req, res) => {
  try {
    const userId = req.user._id;

    // Get booking counts by status
    const stats = await Booking.aggregate([
      { $match: { customerId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object format
    const statsObj = {
      total: 0,
      pending: 0,
      confirmed: 0,
      'in-progress': 0,
      completed: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      statsObj[stat._id] = stat.count;
      statsObj.total += stat.count;
    });

    res.json({
      message: 'Booking statistics retrieved successfully',
      stats: statsObj
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ message: 'Server error retrieving booking statistics' });
  }
});

export default router;
