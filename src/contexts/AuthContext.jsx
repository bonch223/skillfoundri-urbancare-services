import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api.js'

// Create AuthContext
const AuthContext = createContext()

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing auth token on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken')
        
        if (token) {
          // Verify token with backend
          try {
            const response = await authAPI.getProfile()
            setUser(response.user)
          } catch (error) {
            console.error('Token verification failed:', error)
            // Clear invalid token
            localStorage.removeItem('authToken')
            localStorage.removeItem('urbancare_user')
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        // Clear corrupted data
        localStorage.removeItem('authToken')
        localStorage.removeItem('urbancare_user')
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      // Call real API
      const response = await authAPI.login({ email, password })
      
      // Store auth data
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('urbancare_user', JSON.stringify(response.user))
      
      setUser(response.user)
      return response.user
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      // Call real API
      const response = await authAPI.register(userData)
      
      // Store auth data
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('urbancare_user', JSON.stringify(response.user))
      
      setUser(response.user)
      return response.user
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('urbancare_user')
    setUser(null)
    setError(null)
  }

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual API call when backend is ready
      const mockApiCall = new Promise((resolve) => {
        setTimeout(() => {
          const updatedUser = { ...user, ...updatedData }
          resolve(updatedUser)
        }, 1000)
      })

      const updatedUser = await mockApiCall
      
      localStorage.setItem('urbancare_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      return updatedUser
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual API call when backend is ready
      const mockApiCall = new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Password reset email sent successfully' })
        }, 1000)
      })

      const response = await mockApiCall
      return response
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    isAuthenticated: !!user,
    isCustomer: user?.userType === 'customer',
    isProvider: user?.userType === 'provider'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
