const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provider is required']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  package: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Package ID is required']
    },
    name: {
      type: String,
      required: [true, 'Package name is required']
    },
    price: {
      type: Number,
      required: [true, 'Package price is required']
    },
    duration: {
      type: String,
      required: [true, 'Package duration is required']
    },
    features: [String]
  },
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    validate: {
      validator: function(time) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
      },
      message: 'Time must be in HH:MM format'
    }
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    additionalInfo: String
  },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: String
  },
  status: {
    type: String,
    enum: [
      'pending',      // Initial booking state
      'confirmed',    // Provider confirmed
      'assigned',     // Provider assigned (if different from initial)
      'in_progress',  // Service is being performed
      'completed',    // Service completed
      'cancelled',    // Booking cancelled
      'rescheduled',  // Booking rescheduled
      'no_show'       // Customer or provider didn't show up
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['cash', 'card', 'online', 'wallet'],
      default: 'cash'
    },
    transactionId: String,
    amount: {
      subtotal: { type: Number, required: true },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true }
    },
    couponCode: String,
    paymentDate: Date
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Special instructions cannot exceed 500 characters']
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  actualStartTime: Date,
  actualEndTime: Date,
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    ratedAt: Date
  },
  providerNotes: {
    type: String,
    maxlength: [1000, 'Provider notes cannot exceed 1000 characters']
  },
  images: {
    before: [String], // URLs to before images
    after: [String],  // URLs to after images
    issues: [String]  // URLs to images showing any issues
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['customer', 'provider', 'admin']
    },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number,
    refundProcessedAt: Date
  },
  reschedule: {
    originalDate: Date,
    originalTime: String,
    rescheduledBy: {
      type: String,
      enum: ['customer', 'provider', 'admin']
    },
    reason: String,
    rescheduledAt: Date
  },
  communication: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'system'],
      default: 'text'
    }
  }],
  notifications: {
    customerNotified: {
      booking: { type: Boolean, default: false },
      confirmation: { type: Boolean, default: false },
      reminder: { type: Boolean, default: false },
      completion: { type: Boolean, default: false }
    },
    providerNotified: {
      booking: { type: Boolean, default: false },
      reminder: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ provider: 1, createdAt: -1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ paymentStatus: 1 });

// Generate unique booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingId) {
    let bookingId;
    let isUnique = false;
    
    while (!isUnique) {
      // Generate booking ID format: UC-YYYYMMDD-XXXXX
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      bookingId = `UC-${date}-${randomNum}`;
      
      // Check if this ID already exists
      const existingBooking = await this.constructor.findOne({ bookingId });
      if (!existingBooking) {
        isUnique = true;
      }
    }
    
    this.bookingId = bookingId;
  }
  next();
});

// Virtual for booking duration in hours
bookingSchema.virtual('actualDuration').get(function() {
  if (this.actualStartTime && this.actualEndTime) {
    return Math.round((this.actualEndTime - this.actualStartTime) / (1000 * 60)); // in minutes
  }
  return null;
});

// Virtual for total service time
bookingSchema.virtual('totalServiceTime').get(function() {
  const duration = this.actualDuration;
  if (duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
  return 'Not completed';
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  if (this.status === 'completed' || this.status === 'cancelled') {
    return false;
  }
  
  // Check if within cancellation window
  const now = new Date();
  const scheduledDateTime = new Date(this.scheduledDate);
  const [hours, minutes] = this.scheduledTime.split(':');
  scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
  
  // Assuming 24 hours cancellation policy (this could be dynamic based on service)
  const cancellationWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return (scheduledDateTime - now) > cancellationWindow;
};

// Method to check if booking can be rescheduled
bookingSchema.methods.canBeRescheduled = function() {
  if (this.status === 'completed' || this.status === 'cancelled') {
    return false;
  }
  
  // Check if within reschedule window
  const now = new Date();
  const scheduledDateTime = new Date(this.scheduledDate);
  const [hours, minutes] = this.scheduledTime.split(':');
  scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
  
  // Assuming 12 hours reschedule policy
  const rescheduleWindow = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  
  return (scheduledDateTime - now) > rescheduleWindow;
};

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  if (!this.canBeCancelled()) {
    return 0;
  }
  
  const now = new Date();
  const scheduledDateTime = new Date(this.scheduledDate);
  const [hours, minutes] = this.scheduledTime.split(':');
  scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
  
  const hoursUntilService = (scheduledDateTime - now) / (1000 * 60 * 60);
  
  // Full refund if cancelled 24+ hours before
  if (hoursUntilService >= 24) {
    return this.paymentDetails.amount.total;
  }
  
  // Partial refund if cancelled between 12-24 hours before
  if (hoursUntilService >= 12) {
    return this.paymentDetails.amount.total * 0.5;
  }
  
  // No refund if cancelled less than 12 hours before
  return 0;
};

// Method to add communication message
bookingSchema.methods.addMessage = function(senderId, message, messageType = 'text') {
  this.communication.push({
    sender: senderId,
    message,
    messageType,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update status with automatic timestamp
bookingSchema.methods.updateStatus = function(newStatus, notes = '') {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add system message for status change
  const statusMessage = `Booking status changed from ${oldStatus} to ${newStatus}`;
  this.communication.push({
    sender: null, // System message
    message: notes ? `${statusMessage}. ${notes}` : statusMessage,
    messageType: 'system',
    timestamp: new Date()
  });
  
  // Set timestamps for specific statuses
  if (newStatus === 'in_progress' && !this.actualStartTime) {
    this.actualStartTime = new Date();
  } else if (newStatus === 'completed' && !this.actualEndTime) {
    this.actualEndTime = new Date();
  }
  
  return this.save();
};

// Static method to get bookings by date range
bookingSchema.statics.getByDateRange = function(startDate, endDate, filter = {}) {
  return this.find({
    scheduledDate: {
      $gte: startDate,
      $lte: endDate
    },
    ...filter
  }).populate('customer provider service');
};

// Static method to get booking statistics
bookingSchema.statics.getStatistics = async function(filter = {}) {
  const stats = await this.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$paymentDetails.amount.total' }
      }
    }
  ]);
  
  return stats;
};

// Static method to find upcoming bookings
bookingSchema.statics.getUpcoming = function(userId, userType = 'customer') {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const query = {
    scheduledDate: { $gte: new Date() },
    status: { $in: ['pending', 'confirmed', 'assigned'] }
  };
  
  query[userType] = userId;
  
  return this.find(query)
    .populate('customer provider service')
    .sort({ scheduledDate: 1, scheduledTime: 1 });
};

module.exports = mongoose.model('Booking', bookingSchema);
