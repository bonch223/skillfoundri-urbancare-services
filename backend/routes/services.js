import express from 'express';

const router = express.Router();

// Service data - In a real app, this would come from a database
const services = {
  'home-cleaning': {
    id: 'home-cleaning',
    name: 'Home Cleaning & Disinfection',
    category: 'cleaning',
    description: 'Professional home cleaning services that ensure your living space is spotless, sanitized, and healthy for your family.',
    longDescription: 'Our comprehensive home cleaning service goes beyond basic tidying. We use eco-friendly products and professional-grade equipment to deep clean every corner of your home.',
    rating: 4.9,
    reviews: 143,
    completedJobs: 1250,
    responseTime: '2 hours',
    availability: 'Mon-Sun, 7AM-7PM',
    packages: {
      basic: {
        name: 'Basic Clean',
        price: '₱800',
        duration: '2-3 hours',
        description: 'Perfect for regular maintenance cleaning',
        features: [
          'Living areas dusting and vacuuming',
          'Kitchen surface cleaning',
          'Bathroom cleaning and sanitizing',
          'Floor mopping (all rooms)',
          'Trash removal',
          'Basic organizing'
        ]
      },
      standard: {
        name: 'Deep Clean',
        price: '₱1,200',
        duration: '3-4 hours',
        description: 'Thorough cleaning for a pristine home',
        popular: true,
        features: [
          'Everything in Basic Clean',
          'Inside appliance cleaning',
          'Window sill and frame cleaning',
          'Light fixture dusting',
          'Cabinet exterior cleaning',
          'Baseboards and door frames',
          'Mattress surface cleaning'
        ]
      },
      premium: {
        name: 'Premium Service',
        price: '₱1,800',
        duration: '4-5 hours',
        description: 'Complete home transformation',
        features: [
          'Everything in Deep Clean',
          'Inside oven and refrigerator cleaning',
          'Window washing (interior)',
          'Carpet shampooing (1 room)',
          'Detailed bathroom scrubbing',
          'Closet organization',
          'Post-service inspection'
        ]
      }
    }
  },
  'plumbing-repairs': {
    id: 'plumbing-repairs',
    name: 'Plumbing & Electrical Repairs',
    category: 'repairs',
    description: 'Expert plumbing and electrical repair services for all your home maintenance needs.',
    longDescription: 'Our certified technicians handle everything from simple repairs to complex installations. We use quality parts and provide warranties on all work.',
    rating: 4.8,
    reviews: 198,
    completedJobs: 892,
    responseTime: '1 hour',
    availability: '24/7 Emergency Service',
    packages: {
      basic: {
        name: 'Basic Repair',
        price: '₱500',
        duration: '1-2 hours',
        description: 'Simple fixes and minor repairs',
        features: [
          'Leak diagnosis and repair',
          'Faucet replacement',
          'Toilet repair',
          'Light switch/outlet repair',
          'Basic drain unclogging',
          '30-day warranty'
        ]
      },
      standard: {
        name: 'Standard Service',
        price: '₱1,200',
        duration: '2-3 hours',
        description: 'Comprehensive repair solutions',
        popular: true,
        features: [
          'Everything in Basic Repair',
          'Pipe installation/replacement',
          'Electrical wiring repairs',
          'Water heater maintenance',
          'Circuit breaker issues',
          '90-day warranty'
        ]
      },
      premium: {
        name: 'Full Installation',
        price: '₱2,500',
        duration: '3-5 hours',
        description: 'Complete installations and upgrades',
        features: [
          'Everything in Standard Service',
          'New fixture installation',
          'Complete bathroom plumbing',
          'Electrical panel upgrades',
          'Smart home device installation',
          '1-year warranty'
        ]
      }
    }
  },
  'handyman-services': {
    id: 'handyman-services',
    name: 'General Handyman Services',
    category: 'handyman',
    description: 'Skilled handyman services for furniture assembly, home improvements, and general repairs.',
    longDescription: 'From furniture assembly to home improvements, our skilled handymen can tackle any project. We bring the right tools and expertise to get the job done efficiently.',
    rating: 4.7,
    reviews: 156,
    completedJobs: 724,
    responseTime: '3 hours',
    availability: 'Mon-Sat, 8AM-6PM',
    packages: {
      basic: {
        name: 'Quick Tasks',
        price: '₱300',
        duration: '1 hour',
        description: 'Small repairs and assembly jobs',
        features: [
          'Furniture assembly (simple items)',
          'Picture hanging',
          'Shelf mounting',
          'Door handle replacement',
          'Basic tool usage',
          'Clean-up included'
        ]
      },
      standard: {
        name: 'Home Projects',
        price: '₱800',
        duration: '2-3 hours',
        description: 'Medium-sized home improvement tasks',
        popular: true,
        features: [
          'Everything in Quick Tasks',
          'Complex furniture assembly',
          'TV mounting',
          'Minor carpentry work',
          'Paint touch-ups',
          'Hardware installation'
        ]
      },
      premium: {
        name: 'Major Projects',
        price: '₱1,500',
        duration: '4-6 hours',
        description: 'Large home improvement projects',
        features: [
          'Everything in Home Projects',
          'Room painting (1 room)',
          'Deck/patio repairs',
          'Kitchen cabinet installation',
          'Flooring repairs',
          'Project consultation'
        ]
      }
    }
  },
  'laundry-care': {
    id: 'laundry-care',
    name: 'Laundry Care Services',
    category: 'laundry',
    description: 'Professional laundry services with pickup and delivery for your convenience.',
    longDescription: 'Let us handle your laundry with care. Our professional washing, drying, and folding service saves you time while ensuring your clothes are cleaned with premium detergents.',
    rating: 4.9,
    reviews: 234,
    completedJobs: 1876,
    responseTime: '1 day',
    availability: 'Mon-Sun, 7AM-7PM',
    packages: {
      basic: {
        name: 'Wash & Fold',
        price: '₱80/kg',
        duration: '24 hours',
        description: 'Standard laundry service',
        features: [
          'Washing with premium detergent',
          'Machine drying',
          'Professional folding',
          'Pickup and delivery',
          'Stain pre-treatment',
          'Fabric softener included'
        ]
      },
      standard: {
        name: 'Wash, Dry & Iron',
        price: '₱120/kg',
        duration: '24-48 hours',
        description: 'Complete laundry with ironing',
        popular: true,
        features: [
          'Everything in Wash & Fold',
          'Professional ironing',
          'Hanging service',
          'Special fabric care',
          'Quality inspection',
          'Next-day delivery'
        ]
      },
      premium: {
        name: 'Premium Care',
        price: '₱180/kg',
        duration: '48 hours',
        description: 'Delicate and premium fabric care',
        features: [
          'Everything in Standard',
          'Hand washing for delicates',
          'Steam pressing',
          'Garment bags for protection',
          'Same-day rush available',
          'Satisfaction guarantee'
        ]
      }
    }
  }
};

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', (req, res) => {
  try {
    const servicesList = Object.values(services).map(service => ({
      id: service.id,
      name: service.name,
      category: service.category,
      description: service.description,
      rating: service.rating,
      reviews: service.reviews,
      completedJobs: service.completedJobs,
      responseTime: service.responseTime,
      availability: service.availability,
      packages: service.packages
    }));

    res.json({
      message: 'Services retrieved successfully',
      services: servicesList,
      total: servicesList.length
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error retrieving services' });
  }
});

// @route   GET /api/services/:id
// @desc    Get specific service by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const service = services[req.params.id];
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service retrieved successfully',
      service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error retrieving service' });
  }
});

// @route   GET /api/services/:id/availability
// @desc    Get available time slots for a service on a specific date
// @access  Public
router.get('/:id/availability', (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const service = services[req.params.id];
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Generate available time slots (in a real app, this would check actual bookings)
    const timeSlots = [
      '08:00', '09:00', '10:00', '11:00', 
      '12:00', '13:00', '14:00', '15:00', 
      '16:00', '17:00', '18:00'
    ];

    const availableSlots = timeSlots.map(time => ({
      time,
      available: true, // In a real app, check against existing bookings
      label: formatTime(time)
    }));

    res.json({
      message: 'Availability retrieved successfully',
      date,
      serviceId: req.params.id,
      slots: availableSlots
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error retrieving availability' });
  }
});

// Helper function to format time
const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default router;
