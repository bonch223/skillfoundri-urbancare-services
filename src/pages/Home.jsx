import React from 'react'
import { Link } from 'react-router-dom'
import { Home as HomeIcon, Wrench, Hammer, Shirt, MapPin, Star, CheckCircle, Phone, Mail, Clock, Shield, Users, Award, ArrowRight, Sparkles } from 'lucide-react'
import MobileServicesCarousel from '../components/MobileServicesCarousel'

function Home() {
  const services = [
    {
      id: 1,
      name: 'Home Cleaning & Disinfection',
      description: 'Professional cleaning services for your home including regular, deep, and specialized disinfection.',
      icon: HomeIcon,
      features: ['Regular Cleaning', 'Deep Cleaning', 'Move-in/out', 'Disinfection']
    },
    {
      id: 2,
      name: 'Plumbing & Electrical Repairs',
      description: 'Expert repairs for leaks, clogs, wiring, outlets, and general home maintenance.',
      icon: Wrench,
      features: ['Leak Repairs', 'Drain Cleaning', 'Electrical Wiring', 'Outlet Repairs']
    },
    {
      id: 3,
      name: 'General Handyman Services',
      description: 'Furniture assembly, mounting, painting, curtain installation, and basic appliance fixes.',
      icon: Hammer,
      features: ['Furniture Assembly', 'Wall Mounting', 'Painting', 'Basic Repairs']
    },
    {
      id: 4,
      name: 'Dry Cleaning & Special Garment Care Services',
      description: 'Convenient pickup/delivery, expert wash & fold, and professional wash & iron services.',
      icon: Shirt,
      features: ['Pickup/Delivery', 'Wash & Fold', 'Wash & Iron', 'Same Day Service']
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg animate-bounce">
                🏆 #1 Service Platform in Tagum City
              </div>
            </div>
            <h1 className="hero-title text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Quality Home Services in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 animate-pulse">
                Tagum City
              </span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              🏠 Connect with <span className="font-bold text-yellow-300">trusted, vetted service providers</span> for all your home care, renovation, and maintenance needs. Experience the convenience of professional services at your doorstep.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center text-blue-100">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                <span className="font-medium">Verified Providers</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Award className="w-5 h-5 mr-2 text-purple-400" />
                <span className="font-medium">Quality Guaranteed</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/services"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group flex items-center justify-center"
              >
                <HomeIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Find Services Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/provider"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                <Users className="w-5 h-5 mr-2" />
                Become a Provider
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20 animate-float">
          <HomeIcon className="w-16 h-16 text-white" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 animate-float-delayed">
          <Wrench className="w-12 h-12 text-white" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 animate-float">
          <Sparkles className="w-14 h-14 text-white" />
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:text-orange-500 transition-colors">500+</div>
              <div className="text-gray-600 font-medium">👥 Happy Customers</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:text-orange-500 transition-colors">50+</div>
              <div className="text-gray-600 font-medium">👨‍🔧 Expert Providers</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:text-orange-500 transition-colors">1000+</div>
              <div className="text-gray-600 font-medium">✅ Services Completed</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:text-orange-500 transition-colors">4.9</div>
              <div className="text-gray-600 font-medium">⭐ Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section with Modern Design */}
      <section id="services" className="services-section py-20 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="bg-blue-600 text-white px-6 py-2.5 rounded-full inline-block mb-6 shadow-lg text-sm font-semibold tracking-wide" style={{background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)'}}>
              ✨ Premium Services
            </div>
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              Professional Home Services
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              Connect with <span className="font-semibold text-blue-600">trusted, verified providers</span> delivering excellence at your doorstep in Tagum City.
            </p>
            
            {/* Customer Testimonial Quote */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto shadow-lg border border-gray-100/50 mb-8">
              <div className="flex items-center justify-center mb-3">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
              <blockquote className="text-gray-700 italic text-lg font-medium mb-3">
                "UrbanCare transformed our home maintenance experience. Professional, reliable, and always on time!"
              </blockquote>
              <cite className="text-sm text-gray-500 font-semibold">— Maria Santos, Tagum City Resident</cite>
            </div>
          </div>
          
          {/* Service Cards with Enhanced Design */}
          <div className="relative">
            {/* Mobile Carousel */}
            <MobileServicesCarousel services={services} />
            
            {/* Desktop Grid Layout */}
            <div className="services-desktop-grid mb-16">
              {services.map((service, index) => {
                const IconComponent = service.icon
                return (
                  <div 
                    key={service.id} 
                    className="group relative bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:scale-[1.03] hover:-translate-y-3 rounded-3xl border border-gray-100/50 hover:border-blue-200/70 overflow-hidden shadow-lg hover:shadow-2xl"
                    style={{ 
                      animationDelay: `${index * 120}ms`
                    }}
                  >
                    {/* Gradient Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Soft Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      boxShadow: '0 0 50px rgba(59, 130, 246, 0.2)'
                    }}></div>
                    
                    <div className="relative p-6 text-center">
                      {/* Icon with Enhanced Styling */}
                      <div className="flex justify-center mb-5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-50 transition-opacity duration-500 scale-110"></div>
                          <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-500 group-hover:scale-110 shadow-md group-hover:shadow-xl">
                            <IconComponent className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Typography */}
                      <h2 className="text-lg font-bold mb-3 text-gray-800 group-hover:text-blue-700 transition-colors duration-300 leading-tight">
                        {service.name}
                      </h2>
                      
                      <p className="text-gray-600 mb-5 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {service.description}
                      </p>
                      
                      {/* Elegant Divider */}
                      <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent mx-auto mb-5 group-hover:via-blue-400 transition-colors duration-300"></div>
                      
                      {/* Enhanced Feature List */}
                      <ul className="space-y-2 mb-6 text-left">
                        {service.features.map((feature, featureIndex) => (
                          <li 
                            key={featureIndex} 
                            className="flex items-center group-hover:translate-x-1 transition-all duration-300 text-gray-700"
                            style={{ transitionDelay: `${featureIndex * 50}ms` }}
                          >
                            <div className="flex-shrink-0 mr-2">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle className="w-2.5 h-2.5 text-white" />
                              </div>
                            </div>
                            <span className="group-hover:text-gray-800 group-hover:font-medium transition-all duration-300 text-xs">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Premium CTA Button */}
                      <Link 
                        to="/services"
                        className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] flex items-center justify-center gap-2 text-sm relative overflow-hidden"
                      >
                        {/* Button Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        <Sparkles className="w-3.5 h-3.5 group-hover:animate-spin transition-transform duration-300" />
                        <span>Explore Service</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                      
                      {/* Floating Decorative Elements */}
                      <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-80 group-hover:animate-pulse transition-all duration-500"></div>
                      <div className="absolute bottom-3 left-3 w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-70 group-hover:animate-bounce transition-all duration-500 delay-100"></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Why Choose Us Section */}
          <div className="mt-20 text-center">
            <h4 className="text-3xl font-bold mb-8 text-gray-800">
              🎆 Why Choose UrbanCare Services?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-4">
                  <Shield className="w-12 h-12 text-green-500" />
                </div>
                <h5 className="font-bold text-lg mb-2 text-gray-800">🔒 100% Verified</h5>
                <p className="text-gray-600">All our service providers are thoroughly vetted and background-checked.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-4">
                  <Clock className="w-12 h-12 text-yellow-500" />
                </div>
                <h5 className="font-bold text-lg mb-2 text-gray-800">⏰ Same Day Service</h5>
                <p className="text-gray-600">Quick response times with same-day service availability for urgent needs.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-4">
                  <Award className="w-12 h-12 text-purple-500" />
                </div>
                <h5 className="font-bold text-lg mb-2 text-gray-800">🏆 Quality Guarantee</h5>
                <p className="text-gray-600">We guarantee satisfaction with our quality assurance and money-back policy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full inline-block mb-6 shadow-lg text-sm font-semibold tracking-wide">
              💬 Customer Reviews
            </div>
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              What Our Customers Say
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what residents of Tagum City are saying about UrbanCare Services.
            </p>
          </div>
          
          <div className="testimonials-grid">
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-gray-100/50">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mb-2">
                  {'★'.repeat(5)}
                </div>
              </div>
              <blockquote className="text-gray-700 text-lg font-medium mb-6 leading-relaxed italic">
                "UrbanCare made home maintenance so easy! Their cleaning service is top-notch and the staff is incredibly professional. I couldn't be happier!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                  M
                </div>
                <div>
                  <cite className="font-semibold text-gray-800 not-italic">Maria Santos</cite>
                  <div className="text-sm text-gray-500">Tagum City Resident</div>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-gray-100/50">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mb-2">
                  {'★'.repeat(5)}
                </div>
              </div>
              <blockquote className="text-gray-700 text-lg font-medium mb-6 leading-relaxed italic">
                "The plumbing repair service was excellent! They fixed our leak quickly and at a very reasonable price. Highly recommended!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                  J
                </div>
                <div>
                  <cite className="font-semibold text-gray-800 not-italic">Juan Dela Cruz</cite>
                  <div className="text-sm text-gray-500">Small Business Owner</div>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-gray-100/50">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mb-2">
                  {'★'.repeat(5)}
                </div>
              </div>
              <blockquote className="text-gray-700 text-lg font-medium mb-6 leading-relaxed italic">
                "Amazing handyman services! They assembled all our furniture and even helped with some electrical work. Professional and reliable!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                  A
                </div>
                <div>
                  <cite className="font-semibold text-gray-800 not-italic">Ana Rodriguez</cite>
                  <div className="text-sm text-gray-500">Homemaker</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto shadow-lg border border-gray-100/50">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">
                🌟 Ready to Experience Quality Service?
              </h4>
              <p className="text-gray-600 mb-6 text-lg">
                Join hundreds of satisfied customers in Tagum City who trust UrbanCare Services for their home needs.
              </p>
              <Link 
                to="/services"
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 mx-auto"
              >
                <Star className="w-5 h-5" />
                <span>Book Your Service Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
