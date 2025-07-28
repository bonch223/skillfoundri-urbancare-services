import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react'

function Footer({ sidebarCollapsed }) {
  return (
    <footer className={`bg-gray-900 text-white py-16 ${sidebarCollapsed ? 'footer-with-sidebar sidebar-collapsed' : 'footer-with-sidebar'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Sparkles className="w-8 h-8 mr-3 text-blue-400" />
              <span className="text-2xl font-bold">UrbanCare Services</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted marketplace for quality home services in Tagum City. 
              Connecting you with verified, professional service providers for all your home care needs.
            </p>
            <div className="flex items-center text-blue-400 mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Tagum City, Davao del Norte, Philippines</span>
            </div>
            <div className="flex items-center text-gray-300 mb-2">
              <Phone className="w-5 h-5 mr-2" />
              <span>+63 123 456 7890</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Mail className="w-5 h-5 mr-2" />
              <span>info@urbancare.services</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Home Cleaning</li>
              <li>Plumbing & Electrical</li>
              <li>Handyman Services</li>
              <li>Laundry Care</li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 UrbanCare Services. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
