import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home as HomeIcon, Wrench, Hammer, Shirt, Search, CheckCircle, Clock, Star, ArrowRight, Sparkles, MapPin, Award } from 'lucide-react'

function Services() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Map service names to URL-friendly IDs
  const getServiceUrl = (service) => {
    const urlMap = {
      'Regular Home Cleaning': 'home-cleaning',
      'Deep Cleaning Service': 'home-cleaning',
      'Plumbing Repairs': 'plumbing-repairs',
      'Electrical Services': 'plumbing-repairs',
      'Furniture Assembly': 'handyman-services', 
      'Home Painting': 'handyman-services',
      'Laundry Service': 'laundry-care',
      'Dry Cleaning': 'laundry-care'
    }
    return urlMap[service.name] || 'home-cleaning'
  }

  const services = [
    {
      id: 1,
      name: 'Regular Home Cleaning',
      category: 'cleaning',
      description: 'Weekly or bi-weekly professional cleaning service for your home.',
      icon: HomeIcon,
      price: '₱800-1,200',
      duration: '2-3 hours',
      rating: 4.9,
      reviews: 143,
      features: ['Living areas cleaning', 'Kitchen deep clean', 'Bathroom sanitization', 'Floor mopping'],
      popular: true
    },
    {
      id: 2,
      name: 'Deep Cleaning Service',
      category: 'cleaning',
      description: 'Comprehensive deep cleaning for move-in/out or seasonal cleaning.',
      icon: Sparkles,
      price: '₱1,500-2,500',
      duration: '4-6 hours',
      rating: 4.8,
      reviews: 98,
      features: ['Appliance cleaning', 'Window cleaning', 'Cabinet organization', 'Carpet deep clean']
    },
    {
      id: 3,
      name: 'Plumbing Repairs',
      category: 'repairs',
      description: 'Expert plumbing services for leaks, clogs, and installations.',
      icon: Wrench,
      price: '₱500-2,000',
      duration: '1-3 hours',
      rating: 4.9,
      reviews: 167,
      features: ['Leak repairs', 'Drain unclogging', 'Pipe installation', 'Water heater service']
    },
    {
      id: 4,
      name: 'Electrical Services',
      category: 'repairs',
      description: 'Safe and professional electrical repairs and installations.',
      icon: Wrench,
      price: '₱600-3,000',
      duration: '1-4 hours',
      rating: 4.7,
      reviews: 89,
      features: ['Outlet repairs', 'Light fixture installation', 'Wiring repairs', 'Circuit troubleshooting']
    },
    {
      id: 5,
      name: 'Furniture Assembly',
      category: 'handyman',
      description: 'Professional assembly of furniture and home equipment.',
      icon: Hammer,
      price: '₱300-800',
      duration: '1-2 hours',
      rating: 4.8,
      reviews: 124,
      features: ['IKEA furniture', 'Bed frames', 'Office chairs', 'Shelving units']
    },
    {
      id: 6,
      name: 'Home Painting',
      category: 'handyman',
      description: 'Interior and exterior painting services for rooms and walls.',
      icon: Hammer,
      price: '₱2,000-8,000',
      duration: '1-3 days',
      rating: 4.6,
      reviews: 76,
      features: ['Interior walls', 'Exterior surfaces', 'Color consultation', 'Paint supply included']
    },
    {
      id: 7,
      name: 'Laundry Service',
      category: 'laundry',
      description: 'Pickup and delivery laundry service with professional care.',
      icon: Shirt,
      price: '₱80-120/kg',
      duration: '1-2 days',
      rating: 4.9,
      reviews: 201,
      features: ['Pickup & delivery', 'Wash & fold', 'Ironing service', 'Same day available'],
      popular: true
    },
    {
      id: 8,
      name: 'Dry Cleaning',
      category: 'laundry',
      description: 'Professional dry cleaning for delicate and special garments.',
      icon: Shirt,
      price: '₱150-500/item',
      duration: '2-3 days',
      rating: 4.7,
      reviews: 94,
      features: ['Suits & dresses', 'Leather cleaning', 'Stain removal', 'Garment pressing']
    }
  ]

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'cleaning', name: 'Home Cleaning', count: services.filter(s => s.category === 'cleaning').length },
    { id: 'repairs', name: 'Repairs', count: services.filter(s => s.category === 'repairs').length },
    { id: 'handyman', name: 'Handyman', count: services.filter(s => s.category === 'handyman').length },
    { id: 'laundry', name: 'Laundry Care', count: services.filter(s => s.category === 'laundry').length }
  ]

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-orange-500 text-white px-6 py-2.5 rounded-full inline-block mb-6 shadow-lg text-sm font-semibold tracking-wide animate-pulse">
              🏠 Professional Services
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Find the Perfect Service for Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Home
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Browse our comprehensive range of home services in Tagum City. From cleaning to repairs, we have trusted professionals ready to help.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 shadow-xl focus:ring-4 focus:ring-blue-300/50 focus:outline-none text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories and Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Service Categories</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white scale-105'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div
                  key={service.id}
                  className="group relative bg-white hover:bg-white transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 rounded-3xl border border-gray-100 hover:border-blue-200 overflow-hidden shadow-lg hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                        🔥 Popular
                      </div>
                    </div>
                  )}

                  {/* Gradient Background Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative p-6">
                    {/* Service Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 group-hover:scale-110 shadow-md">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                            {service.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-semibold text-gray-700">{service.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({service.reviews} reviews)</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-xs text-gray-700">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                        <div className="text-xs text-gray-500">Starting price</div>
                      </div>
                      <Link 
                        to={`/services/${getServiceUrl(service)}`}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex items-center gap-2 text-sm"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need a Custom Service?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Can't find exactly what you're looking for? Contact us for custom service requests and quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Request Custom Service
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <Award className="w-5 h-5 mr-2" />
              Become a Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services
