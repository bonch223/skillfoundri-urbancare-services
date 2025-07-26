import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Home as HomeIcon, 
  Wrench, 
  Hammer, 
  Shirt, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowLeft, 
  Phone, 
  Calendar,
  MapPin,
  Shield,
  Award,
  Users,
  Sparkles,
  DollarSign,
  MessageCircle,
  Camera,
  Zap,
  Droplets,
  Brush,
  Package
} from 'lucide-react'

function ServiceDetail() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const [selectedPackage, setSelectedPackage] = useState('basic')

  // Enhanced service data with detailed information
  const services = {
    'home-cleaning': {
      id: 'home-cleaning',
      name: 'Home Cleaning & Disinfection',
      category: 'cleaning',
      icon: HomeIcon,
      heroImage: '/api/placeholder/800/400',
      description: 'Professional home cleaning services that ensure your living space is spotless, sanitized, and healthy for your family.',
      longDescription: 'Our comprehensive home cleaning service goes beyond basic tidying. We use eco-friendly products and professional-grade equipment to deep clean every corner of your home. Our trained professionals follow a detailed checklist to ensure consistent, high-quality results every time.',
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
      },

      additionalServices: [
        { name: 'Move-in/Move-out cleaning', price: '₱2,500' },
        { name: 'Post-construction cleanup', price: '₱3,000' },
        { name: 'Holiday deep cleaning', price: '₱2,000' },
        { name: 'Office cleaning', price: '₱1,500' }
      ],

      faqs: [
        {
          question: 'Do you bring your own cleaning supplies?',
          answer: 'Yes, we bring all necessary cleaning supplies and equipment. We use eco-friendly, non-toxic products that are safe for children and pets.'
        },
        {
          question: 'How do I prepare for the cleaning service?',
          answer: 'Simply remove personal items from surfaces and ensure our team can access all areas. We recommend securing valuables and briefing us on any specific concerns.'
        },
        {
          question: 'What if I\'m not satisfied with the service?',
          answer: 'We offer a 100% satisfaction guarantee. If you\'re not happy with our work, we\'ll return within 24 hours to address any issues at no extra cost.'
        }
      ],

      gallery: [
        '/api/placeholder/300/200',
        '/api/placeholder/300/200',
        '/api/placeholder/300/200',
        '/api/placeholder/300/200'
      ],

      testimonials: [
        {
          name: 'Maria Santos',
          rating: 5,
          comment: 'Exceptional service! They transformed my home and were so professional throughout.',
          date: 'January 2025'
        },
        {
          name: 'John Rivera',
          rating: 5,
          comment: 'Been using their service for 6 months. Always punctual and thorough.',
          date: 'January 2025'
        }
      ]
    },

    'plumbing-repairs': {
      id: 'plumbing-repairs',
      name: 'Plumbing & Electrical Repairs',
      category: 'repairs',
      icon: Wrench,
      heroImage: '/api/placeholder/800/400',
      description: 'Expert plumbing and electrical repair services for all your home maintenance needs.',
      longDescription: 'Our certified technicians handle everything from simple repairs to complex installations. We use quality parts and provide warranties on all work. Available for emergency calls 24/7.',
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
      },

      additionalServices: [
        { name: 'Emergency plumbing (24/7)', price: '₱800' },
        { name: 'Water pump installation', price: '₱3,500' },
        { name: 'Home electrical inspection', price: '₱1,000' },
        { name: 'Generator installation', price: '₱5,000' }
      ],

      faqs: [
        {
          question: 'Do you provide emergency services?',
          answer: 'Yes, we offer 24/7 emergency plumbing and electrical services. Emergency calls have a premium rate but we guarantee rapid response.'
        },
        {
          question: 'Are your technicians licensed?',
          answer: 'All our technicians are licensed, insured, and regularly trained on the latest techniques and safety protocols.'
        },
        {
          question: 'What warranty do you provide?',
          answer: 'We provide warranties ranging from 30 days to 1 year depending on the service. All warranties cover both parts and labor.'
        }
      ]
    },

    'handyman-services': {
      id: 'handyman-services',
      name: 'General Handyman Services',
      category: 'handyman',
      icon: Hammer,
      heroImage: '/api/placeholder/800/400',
      description: 'Skilled handyman services for furniture assembly, home improvements, and general repairs.',
      longDescription: 'From furniture assembly to home improvements, our skilled handymen can tackle any project. We bring the right tools and expertise to get the job done efficiently and professionally.',
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
      },

      additionalServices: [
        { name: 'Interior painting (per room)', price: '₱2,500' },
        { name: 'Exterior painting', price: '₱5,000' },
        { name: 'Tile installation', price: '₱1,200' },
        { name: 'Deck building', price: '₱8,000' }
      ]
    },

    'laundry-care': {
      id: 'laundry-care',
      name: 'Laundry Care Services',
      category: 'laundry',
      icon: Shirt,
      heroImage: '/api/placeholder/800/400',
      description: 'Professional laundry services with pickup and delivery for your convenience.',
      longDescription: 'Let us handle your laundry with care. Our professional washing, drying, and folding service saves you time while ensuring your clothes are cleaned with premium detergents and techniques.',
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
      },

      additionalServices: [
        { name: 'Dry cleaning (per item)', price: '₱150-500' },
        { name: 'Shoe cleaning', price: '₱200' },
        { name: 'Curtain cleaning', price: '₱300' },
        { name: 'Bedding cleaning (per set)', price: '₱400' }
      ]
    }
  }

  const service = services[serviceId]

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
          <Link to="/services" className="text-blue-600 hover:text-blue-700">
            ← Back to Services
          </Link>
        </div>
      </div>
    )
  }

  const currentPackage = service.packages[selectedPackage]
  const IconComponent = service.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/services')}
            className="mb-8 flex items-center text-blue-100 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Services
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Service Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm mr-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{service.name}</h1>
                  <div className="flex items-center text-blue-100">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Available in Tagum City</span>
                  </div>
                </div>
              </div>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">{service.description}</p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{service.rating}</div>
                  <div className="text-sm text-blue-100">Rating</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Users className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{service.completedJobs}</div>
                  <div className="text-sm text-blue-100">Jobs Done</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{service.responseTime}</div>
                  <div className="text-sm text-blue-100">Response</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-blue-100">Insured</div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Now
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={service.heroImage} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-4 rounded-xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold">Starting</div>
                  <div className="text-3xl font-bold">{currentPackage.price}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Choose Your Package
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the service level that best fits your needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {Object.entries(service.packages).map(([key, pkg]) => (
              <div 
                key={key}
                className={`relative bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedPackage === key 
                    ? 'border-blue-500 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-blue-300'
                } ${pkg.popular ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => setSelectedPackage(key)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{pkg.price}</div>
                  <div className="text-gray-500 mb-4">{pkg.duration}</div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                <ul className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full mt-6 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  selectedPackage === key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  {selectedPackage === key ? 'Selected' : 'Select Package'}
                </button>
              </div>
            ))}
          </div>

          {/* Book Selected Package */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-12 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 text-lg">
              Book {currentPackage.name} - {currentPackage.price}
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            About This Service
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
            <p>{service.longDescription}</p>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      {service.additionalServices && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              Additional Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.additionalServices.map((addon, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">{addon.name}</h3>
                  <div className="text-2xl font-bold text-blue-600">{addon.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {service.faqs && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {service.faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {service.testimonials && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{testimonial.date}</span>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your {service.name} service today and experience the difference quality makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Service
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Get Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceDetail
