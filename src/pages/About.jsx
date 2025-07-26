import React from 'react'
import { Shield, Users, Award, Clock, MapPin, Heart, Star, CheckCircle } from 'lucide-react'

function About() {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'We thoroughly vet all service providers and ensure they meet our high standards for quality and professionalism.'
    },
    {
      icon: Heart,
      title: 'Community Focus',
      description: 'Born and raised in Tagum City, we understand the unique needs of our local community and are committed to serving it.'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We maintain the highest standards of service quality with our satisfaction guarantee and continuous improvement programs.'
    },
    {
      icon: Clock,
      title: 'Convenience First',
      description: 'We make it easy for customers to find, book, and receive quality services at their convenience.'
    }
  ]

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '50+', label: 'Verified Providers' },
    { number: '1000+', label: 'Services Completed' },
    { number: '4.9', label: 'Average Rating' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-orange-500 text-white px-6 py-2.5 rounded-full inline-block mb-6 shadow-lg text-sm font-semibold tracking-wide animate-pulse">
              🏢 About UrbanCare
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Connecting Tagum City with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Quality Services
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              We are a homegrown marketplace platform dedicated to connecting residents of Tagum City with trusted, professional service providers for all their home care needs.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-blue-600 text-white px-6 py-2.5 rounded-full inline-block mb-6 shadow-lg text-sm font-semibold tracking-wide">
                📖 Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Born from a Simple Idea: Quality Services for Everyone
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                UrbanCare Services was founded in 2024 with a mission to solve a common problem in Tagum City: finding reliable, professional service providers for home maintenance and care.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                As locals who understand the challenges of finding trustworthy services, we created a platform that connects homeowners with verified, skilled professionals right here in our community.
              </p>
              <div className="flex items-center text-blue-600">
                <MapPin className="w-6 h-6 mr-2" />
                <span className="font-semibold">Proudly serving Tagum City, Davao del Norte</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                      <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="bg-purple-600 text-white px-6 py-2.5 rounded-full inline-block mb-6 shadow-lg text-sm font-semibold tracking-wide">
              💎 Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              What Drives Us Every Day
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our core values guide everything we do, from how we select service providers to how we serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white hover:bg-white transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-3xl border border-gray-100 hover:border-blue-200 overflow-hidden shadow-lg hover:shadow-2xl p-8 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 group-hover:scale-110 shadow-md">
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 mb-4 transition-colors duration-300">
                      {value.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-600 text-white px-6 py-2.5 rounded-full inline-block mb-6 shadow-lg text-sm font-semibold tracking-wide">
            🎯 Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Making Quality Home Services Accessible to Every Tagum City Family
          </h2>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              We believe that every household in Tagum City deserves access to reliable, professional services without the hassle of searching, vetting, and negotiating with individual providers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Verified Professionals</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Fair Pricing</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="bg-orange-500 text-white px-6 py-2.5 rounded-full inline-block mb-6 shadow-lg text-sm font-semibold tracking-wide animate-pulse">
              ⭐ Why UrbanCare?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Trusted Choice for Tagum City Families
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Here's what makes us different from other service platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-yellow-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Community Focus</h3>
              <p className="text-blue-100">
                We understand Tagum City's unique needs and work exclusively with local professionals who know our community.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-green-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rigorous Vetting Process</h3>
              <p className="text-blue-100">
                Every service provider goes through background checks, skill verification, and continuous quality monitoring.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Customer Satisfaction</h3>
              <p className="text-blue-100">
                Our 4.9-star rating speaks for itself. We're committed to your complete satisfaction with every service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Ready to Experience the UrbanCare Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of satisfied customers who trust UrbanCare for their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-xl transition-all duration-300 hover:scale-105">
              Browse Services
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg shadow-xl transition-all duration-300 hover:scale-105">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
