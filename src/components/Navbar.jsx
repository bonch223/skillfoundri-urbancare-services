import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, Phone, ArrowRight, Menu, X } from 'lucide-react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="navbar bg-white/90 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-blue-200/20">
      <div className="navbar-start">
        <div className="dropdown">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden hover:bg-blue-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </div>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-white rounded-box w-52 border border-blue-200">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className={`hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-700 ${
                      isActive(item.href) ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center">
          <Link 
            to="/" 
            className="btn btn-ghost text-xl font-bold text-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            <Sparkles className="w-6 h-6 mr-2 text-blue-600 animate-pulse" />
            UrbanCare Services
          </Link>
          <div className="badge bg-blue-100 text-blue-600 border-blue-300 ml-2 animate-pulse">📍 Tagum City</div>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.href} 
                className={`hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium text-gray-700 ${
                  isActive(item.href) ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <button className="btn btn-ghost btn-sm hidden sm:flex items-center hover:bg-blue-50 text-gray-700">
          <Phone className="w-4 h-4 mr-2" />
          Call Now
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center">
          Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  )
}

export default Navbar
