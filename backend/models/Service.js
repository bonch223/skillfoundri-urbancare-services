const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Package price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Package duration is required']
  },
  features: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['cleaning', 'plumbing', 'electrical', 'carpentry', 'painting', 'gardening', 'repairs', 'maintenance', 'other'],
    lowercase: true
  },
  subcategory: {
    type: String,
    trim: true,
    lowercase: true
  },
  icon: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  packages: [packageSchema],
  providers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, default: 0 }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  availability: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    hours: {
      start: String,
      end: String
    }
  },
  serviceArea: {
    cities: [String],
    radius: { type: Number, default: 50 }, // in kilometers
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  equipment: [{
    name: String,
    required: { type: Boolean, default: false },
    providedByProvider: { type: Boolean, default: true }
  }],
  estimatedTime: {
    min: Number,
    max: Number,
    unit: { type: String, enum: ['minutes', 'hours', 'days'], default: 'hours' }
  },
  bookingSettings: {
    advanceBooking: {
      min: { type: Number, default: 2 }, // minimum hours in advance
      max: { type: Number, default: 720 } // maximum hours in advance (30 days)
    },
    cancellationPolicy: {
      allowed: { type: Boolean, default: true },
      freeUntil: { type: Number, default: 24 }, // hours before service
      refundPercentage: { type: Number, default: 100, min: 0, max: 100 }
    },
    reschedulePolicy: {
      allowed: { type: Boolean, default: true },
      freeUntil: { type: Number, default: 12 } // hours before service
    }
  },
  popularityScore: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
serviceSchema.index({ name: 1 });
serviceSchema.index({ category: 1, subcategory: 1 });
serviceSchema.index({ 'rating.average': -1 });
serviceSchema.index({ popularityScore: -1 });
serviceSchema.index({ tags: 1 });
serviceSchema.index({ isActive: 1 });

// Virtual for formatted price range
serviceSchema.virtual('priceRange').get(function() {
  if (this.packages && this.packages.length > 0) {
    const prices = this.packages.map(pkg => pkg.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `$${minPrice}`;
    }
    return `$${minPrice} - $${maxPrice}`;
  }
  return 'Price on request';
});

// Method to calculate average rating
serviceSchema.methods.calculateRating = async function() {
  const Booking = mongoose.model('Booking');
  
  const ratings = await Booking.aggregate([
    {
      $match: {
        service: this._id,
        status: 'completed',
        'rating.score': { $exists: true }
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating.score' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);
  
  if (ratings.length > 0) {
    this.rating.average = Math.round(ratings[0].averageRating * 10) / 10;
    this.rating.count = ratings[0].totalRatings;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
  
  return this.save();
};

// Method to update popularity score
serviceSchema.methods.updatePopularityScore = async function() {
  const Booking = mongoose.model('Booking');
  
  // Get recent bookings (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const recentBookings = await Booking.countDocuments({
    service: this._id,
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  // Calculate popularity score based on recent bookings and rating
  this.popularityScore = (recentBookings * 0.7) + (this.rating.average * this.rating.count * 0.3);
  
  return this.save();
};

// Method to get active packages
serviceSchema.methods.getActivePackages = function() {
  return this.packages.filter(pkg => pkg.isActive);
};

// Method to check service availability
serviceSchema.methods.isAvailableOn = function(day, time) {
  // Check if the service is available on the given day
  if (!this.availability.days.includes(day.toLowerCase())) {
    return false;
  }
  
  // Check if within operating hours
  if (this.availability.hours.start && this.availability.hours.end) {
    const serviceStart = this.availability.hours.start;
    const serviceEnd = this.availability.hours.end;
    
    return time >= serviceStart && time <= serviceEnd;
  }
  
  return true;
};

// Static method to find services by category
serviceSchema.statics.findByCategory = function(category, subcategory = null) {
  const query = { category: category.toLowerCase(), isActive: true };
  
  if (subcategory) {
    query.subcategory = subcategory.toLowerCase();
  }
  
  return this.find(query).populate('providers', 'name rating profilePicture providerDetails.rating');
};

// Static method to search services
serviceSchema.statics.search = function(searchTerm) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } },
          { category: { $regex: searchTerm, $options: 'i' } },
          { subcategory: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  }).populate('providers', 'name rating profilePicture providerDetails.rating');
};

module.exports = mongoose.model('Service', serviceSchema);
