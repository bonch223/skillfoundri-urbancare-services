import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Menu, X, MapPin, User, Settings, LogOut, LayoutDashboard, Phone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const { isAuthenticated, user, logout } = useAuth()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  // Simple toggle function
  const toggleMenu = () => {
    console.log('Toggling menu from', isMenuOpen, 'to', !isMenuOpen)
    setIsMenuOpen(prev => !prev)
  }

  return (
    <>
      {/* Simplified navbar with inline styles */}
      <nav style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        position: 'sticky',
        top: '0',
        zIndex: '50',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px'
          }}>
            
            {/* Logo Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link 
                to="/" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#2563eb',
                  textDecoration: 'none'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Sparkles style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#fb923c',
                    borderRadius: '50%'
                  }}></div>
                </div>
                <div>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }}>UrbanCare</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <MapPin style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                    <span>Tagum City</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div style={{
              display: window.innerWidth >= 768 ? 'flex' : 'none',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: isActive(item.href) ? '#2563eb' : '#374151',
                    backgroundColor: isActive(item.href) ? '#eff6ff' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {!isAuthenticated ? (
                <>
                  {/* Login Button */}
                  <Link 
                    to="/login"
                    style={{
                      display: window.innerWidth >= 768 ? 'flex' : 'none',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#2563eb',
                      border: '1px solid #2563eb',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Login
                  </Link>

                  {/* Sign Up Button */}
                  <Link 
                    to="/signup"
                    style={{
                      display: window.innerWidth >= 768 ? 'flex' : 'none',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'white',
                      background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                <>
                  {/* Dashboard Button for authenticated users */}
                  <Link 
                    to="/dashboard"
                    style={{
                      display: window.innerWidth >= 768 ? 'flex' : 'none',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: isActive('/dashboard') ? 'white' : '#2563eb',
                      background: isActive('/dashboard') ? 'linear-gradient(to right, #2563eb, #1d4ed8)' : 'transparent',
                      border: isActive('/dashboard') ? 'none' : '1px solid #2563eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <LayoutDashboard style={{ width: '16px', height: '16px' }} />
                    <span>Dashboard</span>
                  </Link>
                  
                  {/* User Menu Dropdown */}
                  <div style={{ position: 'relative', display: window.innerWidth >= 768 ? 'block' : 'none' }}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        backgroundColor: isUserMenuOpen ? '#eff6ff' : 'transparent',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#2563eb',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        marginTop: '0.5rem',
                        width: '200px',
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #f3f4f6',
                        padding: '0.5rem 0',
                        zIndex: '9999'
                      }}>
                        <div style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#1f2937'
                          }}>
                            {user?.name || 'User'}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            textTransform: 'capitalize'
                          }}>
                            {user?.userType || 'User'}
                          </div>
                        </div>
                        
                        <div style={{ padding: '0.5rem 0' }}>
                          <Link
                            to="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.75rem 1rem',
                              fontSize: '0.875rem',
                              color: '#374151',
                              textDecoration: 'none',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#f9fafb'
                              e.target.style.color = '#2563eb'
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent'
                              e.target.style.color = '#374151'
                            }}
                          >
                            <User style={{ width: '16px', height: '16px' }} />
                            <span>Profile</span>
                          </Link>
                          
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false)
                              logout()
                              navigate('/')
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.75rem 1rem',
                              fontSize: '0.875rem',
                              color: '#dc2626',
                              backgroundColor: 'transparent',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#fef2f2'
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent'
                            }}
                          >
                            <LogOut style={{ width: '16px', height: '16px' }} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <div style={{
                display: window.innerWidth < 768 ? 'block' : 'none',
                position: 'relative'
              }}>
                <button
                  onClick={toggleMenu}
                  style={{
                    padding: '0.5rem',
                    color: '#4b5563',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: '50'
                  }}
                  aria-label="Toggle menu"
                  type="button"
                >
                  {isMenuOpen ? (
                    <X style={{ width: '24px', height: '24px' }} />
                  ) : (
                    <Menu style={{ width: '24px', height: '24px' }} />
                  )}
                </button>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    right: '0',
                    top: '100%',
                    marginTop: '0.5rem',
                    width: '224px',
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid #f3f4f6',
                    padding: '0.5rem 0',
                    zIndex: '9999'
                  }}>
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        <MapPin style={{ width: '16px', height: '16px' }} />
                        <span>Tagum City Services</span>
                      </div>
                    </div>
                    
                    <div style={{ padding: '0.5rem 0' }}>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.75rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: isActive(item.href) ? '#2563eb' : '#374151',
                            backgroundColor: isActive(item.href) ? '#eff6ff' : 'transparent',
                            textDecoration: 'none',
                            borderRight: isActive(item.href) ? '2px solid #2563eb' : 'none'
                          }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderTop: '1px solid #f3f4f6',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <Link 
                        to="/services"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#4b5563',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'none'
                        }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Phone style={{ width: '16px', height: '16px' }} />
                        <span>Book Service Now</span>
                      </Link>

                      {!isAuthenticated ? (
                        <>
                          <Link 
                            to="/login"
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#2563eb',
                              backgroundColor: 'transparent',
                              border: '1px solid #2563eb',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link 
                            to="/signup"
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem 1rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: 'white',
                              background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                              border: 'none',
                              borderRadius: '0.5rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Signup
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link 
                            to="/profile"
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#2563eb',
                              backgroundColor: 'transparent',
                              border: '1px solid #2563eb',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          {user?.userType === 'provider' && (
                            <Link 
                              to="/provider"
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: 'white',
                                background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                                border: 'none',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                                textDecoration: 'none'
                              }}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span>Provider Dashboard</span>
                              <ArrowRight style={{ width: '16px', height: '16px' }} />
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
            zIndex: '40'
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar
