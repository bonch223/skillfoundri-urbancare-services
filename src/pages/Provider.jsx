import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Star, Shield, Clock, Award, ArrowRight, CheckCircle, 
  MapPin, Phone, Mail, Sparkles, Heart, DollarSign, Calendar, 
  FileText, Camera, UserCheck, Wrench, Home, Shirt, Hammer,
  TrendingUp, Target, HandHeart, Building, BarChart3, Settings,
  MessageSquare, Wallet, CheckSquare, Headphones
} from 'lucide-react'

function Provider() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Earnings",
      description: "Earn up to ₱15,000-₱50,000 monthly based on services completed and customer ratings.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description: "Work on your own terms. Choose your availability and accept jobs that fit your schedule.",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: TrendingUp,
      title: "Business Growth",
      description: "Build your reputation and grow your client base through our trusted platform.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Target,
      title: "Local Market Access",
      description: "Connect with customers in Tagum City who actively seek your services.",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: HandHeart,
      title: "Community Impact",
      description: "Make a positive difference in your neighbors' lives while building your business.",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: Building,
      title: "Professional Support",
      description: "Get marketing support, customer service backup, and business development resources.",
      color: "from-indigo-400 to-purple-500"
    }
  ]

  const requirements = [
    {
      category: "Basic Requirements",
      items: [
        "Must be 18 years old or above",
        "Valid government-issued ID",
        "Proof of address in Tagum City or nearby areas",
        "Mobile phone with internet access",
        "Basic English and Filipino communication skills"
      ]
    },
    {
      category: "Service-Specific Requirements",
      items: [
        "Relevant experience or certification in your service area",
        "Own tools and equipment for your services",
        "Transportation to reach customer locations",
        "Professional work portfolio or references",
        "Liability insurance (preferred but we can help arrange)"
      ]
    },
    {
      category: "Professional Standards",
      items: [
        "Clean criminal background check",
        "Professional appearance and conduct",
        "Commitment to quality service delivery",
        "Ability to work independently and reliably",
        "Customer service orientation"
      ]
    }
  ]

  const applicationSteps = [
    {
      step: 1,
      title: "Submit Application",
      description: "Fill out our comprehensive application form with your service details and experience.",
      icon: FileText
    },
    {
      step: 2,
      title: "Document Verification",
      description: "Upload required documents including ID, certifications, and work portfolio.",
      icon: Shield
    },
    {
      step: 3,
      title: "Background Check",
      description: "We conduct a thorough background verification for safety and reliability.",
      icon: UserCheck
    },
    {
      step: 4,
      title: "Skills Assessment",
      description: "Demonstrate your expertise through practical assessments or interviews.",
      icon: Award
    },
    {
      step: 5,
      title: "Platform Training",
      description: "Learn to use our platform, understand policies, and customer service standards.",
      icon: Star
    },
    {
      step: 6,
      title: "Go Live!",
      description: "Start accepting jobs and building your reputation on UrbanCare Services.",
      icon: Sparkles
    }
  ]

  const serviceCategories = [
    {
      name: "Home Cleaning & Disinfection",
      icon: Home,
      requirements: ["Cleaning experience", "Own cleaning supplies", "Physical fitness"],
      earning: "₱800-₱2,500 per job"
    },
    {
      name: "Plumbing & Electrical",
      icon: Wrench,
      requirements: ["Technical certification", "Professional tools", "Insurance required"],
      earning: "₱1,500-₱8,000 per job"
    },
    {
      name: "Handyman Services",
      icon: Hammer,
      requirements: ["General repair skills", "Tool kit", "Problem-solving ability"],
      earning: "₱1,000-₱5,000 per job"
    },
    {
      name: "Laundry & Garment Care",
      icon: Shirt,
      requirements: ["Garment care knowledge", "Transportation", "Time management"],
      earning: "₱500-₱2,000 per job"
    }
  ]

  const dashboardFeatures = [
    {
      icon: BarChart3,
      title: "Job Management",
      description: "View, accept, and manage your service requests with real-time notifications.",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: Wallet,
      title: "Earnings Tracker",
      description: "Monitor your income, track payments, and view detailed financial reports.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Users,
      title: "Customer Reviews",
      description: "Manage customer feedback, respond to reviews, and build your reputation.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Schedule Management",
      description: "Set your availability, block time slots, and manage your work calendar.",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: Settings,
      title: "Profile & Services",
      description: "Update your service offerings, rates, and professional profile information.",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: MessageSquare,
      title: "Customer Communication",
      description: "Built-in messaging system to communicate directly with your customers.",
      color: "from-indigo-400 to-purple-500"
    }
  ]

  const managementOptions = [
    {
      title: "Self-Managed",
      subtitle: "Full Control, Lower Commission",
      commission: "15%",
      features: [
        "Complete control over your schedule and pricing",
        "Direct customer communication",
        "Handle your own booking confirmations",
        "Manage payment collection",
        "Set your own service policies",
        "Full access to provider dashboard"
      ],
      recommended: true,
      icon: CheckSquare
    },
    {
      title: "Assisted Management",
      subtitle: "We Handle The Details",
      commission: "25%",
      features: [
        "We manage your bookings and scheduling",
        "Professional customer service support",
        "Automated confirmation and follow-ups",
        "Payment processing and collection",
        "Quality assurance and customer relations",
        "Marketing and promotion assistance"
      ],
      recommended: false,
      icon: Headphones
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg animate-bounce">
                🚀 Join Our Growing Network
              </div>
            </div>
            <h1 className="hero-title text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Become a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 animate-pulse">
                Service Provider
              </span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              🏆 Partner with <span className="font-bold text-yellow-300">UrbanCare Services</span> and build your business while serving the Tagum City community. Join our network of trusted professionals.
            </p>
            
            {/* Trust Indicators */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#dbeafe' }}>
                <Users style={{ width: '20px', height: '20px', marginRight: '8px', color: '#34d399' }} />
                <span style={{ fontWeight: '500' }}>50+ Active Providers</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#dbeafe' }}>
                <Star style={{ width: '20px', height: '20px', marginRight: '8px', color: '#fbbf24' }} />
                <span style={{ fontWeight: '500' }}>4.9 Average Rating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#dbeafe' }}>
                <MapPin style={{ width: '20px', height: '20px', marginRight: '8px', color: '#8b5cf6' }} />
                <span style={{ fontWeight: '500' }}>Tagum City Focus</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <Link 
                to="/contact"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#fb923c',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Users style={{ width: '20px', height: '20px' }} />
                Apply Now
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </Link>
              <button 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: '2px solid white',
                  color: 'white',
                  backgroundColor: 'transparent',
                  fontWeight: '600',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'white'
                  e.target.style.color = '#1e40af'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = 'white'
                }}
              >
                <Phone style={{ width: '20px', height: '20px' }} />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              display: 'inline-block',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem',
              fontWeight: '600',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)'
            }}>
              💰 Provider Benefits
            </div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #1f2937, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              What You'll Get as a Provider
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.75'
            }}>
              Join our platform and unlock opportunities to grow your business while making a meaningful impact in your community.
            </p>
          </div>
          
          {/* Benefits Grid with Explicit CSS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(3, 1fr)' : window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
            gap: '2rem'
          }}>
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div 
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    transition: 'all 0.5s ease',
                    transform: 'scale(1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03) translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)'
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: '0',
                    background: `linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))`,
                    opacity: '0',
                    transition: 'opacity 0.5s ease'
                  }} />
                  
                  <div style={{ position: 'relative' }}>
                    {/* Icon */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute',
                          inset: '0',
                          background: `linear-gradient(to right, #3b82f6, #8b5cf6)`,
                          borderRadius: '1rem',
                          filter: 'blur(8px)',
                          opacity: '0.3',
                          transform: 'scale(1.1)'
                        }} />
                        <div style={{
                          position: 'relative',
                          padding: '0.75rem',
                          borderRadius: '1rem',
                          background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                          <IconComponent style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      marginBottom: '0.75rem',
                      color: '#1f2937',
                      textAlign: 'center'
                    }}>
                      {benefit.title}
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      lineHeight: '1.625',
                      textAlign: 'center'
                    }}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section style={{ 
        padding: '5rem 0', 
        background: 'linear-gradient(135deg, #f9fafb, #eff6ff)' 
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              background: 'linear-gradient(to right, #f59e0b, #ef4444)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              display: 'inline-block',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              📋 Requirements
            </div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #1f2937, #f59e0b, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Provider Requirements
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.75'
            }}>
              To ensure quality service and customer safety, we have specific requirements for all our providers.
            </p>
          </div>
          
          {/* Requirements Grid with Explicit CSS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(3, 1fr)' : '1fr',
            gap: '2rem'
          }}>
            {requirements.map((requirement, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
              >
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1.5rem',
                  color: '#1f2937',
                  textAlign: 'center',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '1rem'
                }}>
                  {requirement.category}
                </h3>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                  {requirement.items.map((item, itemIndex) => (
                    <li 
                      key={itemIndex}
                      style={{
                        display: 'flex', 
                        alignItems: 'flex-start',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        color: '#374151',
                        lineHeight: '1.5'
                      }}
                    >
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: 'linear-gradient(to right, #10b981, #059669)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem',
                        marginTop: '2px',
                        flexShrink: '0'
                      }}>
                        <CheckCircle style={{ width: '10px', height: '10px', color: 'white' }} />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              display: 'inline-block',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              🔧 Service Categories
            </div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #1f2937, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Available Service Categories
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.75'
            }}>
              Choose the service category that matches your expertise and start earning with UrbanCare Services.
            </p>
          </div>
          
          {/* Service Categories Grid with Explicit CSS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(2, 1fr)' : '1fr',
            gap: '2rem'
          }}>
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <div 
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    transition: 'all 0.5s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.5rem'
                  }}>
                    {/* Icon */}
                    <div style={{
                      padding: '1rem',
                      borderRadius: '1rem',
                      background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)',
                      flexShrink: '0'
                    }}>
                      <IconComponent style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: '1' }}>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        color: '#1f2937'
                      }}>
                        {category.name}
                      </h3>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          Requirements:
                        </h4>
                        <ul style={{ 
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          listStyle: 'none',
                          padding: '0',
                          margin: '0'
                        }}>
                          {category.requirements.map((req, reqIndex) => (
                            <li 
                              key={reqIndex}
                              style={{
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '500'
                              }}
                            >
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: '#ecfdf5',
                        borderRadius: '0.5rem',
                        border: '1px solid #a7f3d0'
                      }}>
                        <DollarSign style={{ width: '16px', height: '16px', color: '#059669' }} />
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#059669'
                        }}>
                          {category.earning}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Provider Dashboard Section */}
      <section style={{ 
        padding: '5rem 0', 
        background: 'linear-gradient(135deg, #f0f9ff, #ddd6fe)' 
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              display: 'inline-block',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              📊 Provider Dashboard
            </div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #1f2937, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Your Simplified Dashboard
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.75'
            }}>
              Manage your entire business from one easy-to-use dashboard. Track earnings, handle bookings, and grow your reputation.
            </p>
          </div>
          
          {/* Dashboard Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(3, 1fr)' : window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
            gap: '2rem'
          }}>
            {dashboardFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    transition: 'all 0.5s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Icon */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                      padding: '1rem',
                      borderRadius: '1rem',
                      background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)'
                    }}>
                      <IconComponent style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem',
                      color: '#1f2937'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      lineHeight: '1.625'
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Management Options Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              background: 'linear-gradient(to right, #059669, #047857)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              display: 'inline-block',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              💼 Management Options
            </div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #1f2937, #059669, #047857)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Choose Your Management Style
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.75'
            }}>
              Select the management option that best fits your business style and availability.
            </p>
          </div>
          
          {/* Management Options Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(2, 1fr)' : '1fr',
            gap: '2rem',
            maxWidth: '64rem',
            margin: '0 auto'
          }}>
            {managementOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <div 
                  key={index}
                  style={{
                    backgroundColor: option.recommended ? 'rgba(239, 246, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    boxShadow: option.recommended ? '0 25px 50px -12px rgba(37, 99, 235, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: option.recommended ? '2px solid #3b82f6' : '1px solid rgba(229, 231, 235, 0.5)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    transform: option.recommended ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = option.recommended ? 'scale(1.04)' : 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = option.recommended ? 'scale(1.02)' : 'scale(1)'}
                >
                  {/* Recommended Badge */}
                  {option.recommended && (
                    <div style={{
                      position: 'absolute',
                      top: '-0.75rem',
                      right: '1.5rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      RECOMMENDED
                    </div>
                  )}
                  
                  {/* Header */}
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      padding: '1rem',
                      borderRadius: '1rem',
                      background: option.recommended ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                      marginBottom: '1rem'
                    }}>
                      <IconComponent style={{ width: '32px', height: '32px', color: option.recommended ? '#2563eb' : '#6b7280' }} />
                    </div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      color: '#1f2937'
                    }}>
                      {option.title}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '1rem'
                    }}>
                      {option.subtitle}
                    </p>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: option.recommended ? '#dbeafe' : '#f3f4f6',
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      border: option.recommended ? '1px solid #93c5fd' : '1px solid #d1d5db'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Commission:
                      </span>
                      <span style={{
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        color: option.recommended ? '#2563eb' : '#059669'
                      }}>
                        {option.commission}
                      </span>
                    </div>
                  </div>
                  
                  {/* Features List */}
                  <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                    {option.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex}
                        style={{
                          display: 'flex', 
                          alignItems: 'flex-start',
                          marginBottom: '1rem',
                          fontSize: '0.875rem',
                          color: '#374151',
                          lineHeight: '1.5'
                        }}
                      >
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: option.recommended ? 'linear-gradient(to right, #3b82f6, #2563eb)' : 'linear-gradient(to right, #10b981, #059669)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.75rem',
                          marginTop: '2px',
                          flexShrink: '0'
                        }}>
                          <CheckCircle style={{ width: '10px', height: '10px', color: 'white' }} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section style={{ 
        padding: '5rem 0', 
        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)' 
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              background: 'linear-gradient(to right, #06b6d4, #0891b2)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              display: 'inline-block',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              📝 Application Process
            </div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #1f2937, #06b6d4, #0891b2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              How to Become a Provider
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.75'
            }}>
              Our straightforward application process ensures we find the right providers while maintaining our quality standards.
            </p>
          </div>
          
          {/* Application Steps with Explicit CSS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(3, 1fr)' : window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
            gap: '2rem'
          }}>
            {applicationSteps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div 
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    textAlign: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Step Number */}
                  <div style={{
                    position: 'absolute',
                    top: '-1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#2563eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      padding: '1rem',
                      borderRadius: '1rem',
                      background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)'
                    }}>
                      <IconComponent style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    color: '#1f2937'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    lineHeight: '1.625'
                  }}>
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{ 
        padding: '5rem 0', 
        background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Ready to Start Your Journey?
            </h2>
            <p style={{
              fontSize: '1.5rem',
              marginBottom: '2rem',
              opacity: '0.9',
              maxWidth: '48rem',
              margin: '0 auto 2rem auto',
              lineHeight: '1.5'
            }}>
              Join UrbanCare Services today and become part of Tagum City's most trusted service network.
            </p>
            
            {/* Contact Information with Explicit CSS */}
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth >= 768 ? 'row' : 'column',
              justifyContent: 'center',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem 1.5rem',
                borderRadius: '0.75rem',
                backdropFilter: 'blur(8px)'
              }}>
                <Phone style={{ width: '20px', height: '20px' }} />
                <span style={{ fontWeight: '500' }}>+63 912 345 6789</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem 1.5rem',
                borderRadius: '0.75rem',
                backdropFilter: 'blur(8px)'
              }}>
                <Mail style={{ width: '20px', height: '20px' }} />
                <span style={{ fontWeight: '500' }}>providers@urbancare.ph</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <Link 
                to="/contact"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#fb923c',
                  color: 'white',
                  fontWeight: '600',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '1.125rem'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Sparkles style={{ width: '20px', height: '20px' }} />
                Apply to Become a Provider
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </Link>
              <Link 
                to="/services"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: '2px solid white',
                  color: 'white',
                  backgroundColor: 'transparent',
                  fontWeight: '600',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '1.125rem'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'white'
                  e.target.style.color = '#1e40af'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = 'white'
                }}
              >
                <Heart style={{ width: '20px', height: '20px' }} />
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Provider
