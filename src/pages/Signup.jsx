import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useLocation } from 'react-router-dom'
import { User, Mail, Lock, UserPlus, Briefcase, Users } from 'lucide-react'

const Signup = () => {
  const { register, error, loading } = useAuth()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedUserType, setSelectedUserType] = useState('customer')

  // Check URL parameters for provider signup
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const typeParam = urlParams.get('type')
    if (typeParam === 'provider') {
      setSelectedUserType('provider')
    }
  }, [location])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      userType: formData.get('userType')
    }

    try {
      console.log('🚀 Starting registration process...')
      await register(userData)
      console.log('✅ Registration successful')
      showSuccess(`Welcome to UrbanCare! Your ${userData.userType} account has been created successfully.`)
      
      // Redirect to dashboard after successful registration
      console.log('🔄 Navigating to dashboard...')
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
        console.log('✅ Navigation complete')
      }, 100)
    } catch (error) {
      console.error('❌ Registration failed:', error)
      showError('Registration failed. Please check your information and try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join the UrbanCare community today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {selectedUserType === 'provider' ? 
                  <Briefcase className="h-5 w-5 text-gray-400" /> : 
                  <Users className="h-5 w-5 text-gray-400" />
                }
              </div>
              <select
                name="userType"
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="customer">Customer - Book Services</option>
                <option value="provider">Service Provider - Offer Services</option>
              </select>
            </div>
            {selectedUserType === 'provider' && (
              <p className="mt-2 text-sm text-gray-600">
                🎉 Join our network of trusted service providers in Tagum City!
              </p>
            )}
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="font-medium text-green-600 hover:text-green-500">Login here</a>
        </p>
      </div>
    </div>
  )
}

export default Signup
