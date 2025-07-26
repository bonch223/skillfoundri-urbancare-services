import React, { createContext, useContext, useState, useEffect } from 'react'

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
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('urbancare_token')
        const userData = localStorage.getItem('urbancare_user')
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        // Clear corrupted data
        localStorage.removeItem('urbancare_token')
        localStorage.removeItem('urbancare_user')
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password, userType = 'customer') => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual API call when backend is ready
      const mockApiCall = new Promise((resolve, reject) => {
        setTimeout(() => {
          // Mock successful login
          if (email && password) {
            resolve({
              user: {
                id: Date.now(),
                email,
                name: email.split('@')[0],
                userType,
                avatar: null,
                createdAt: new Date().toISOString()
              },
              token: `mock_token_${Date.now()}`
            })
          } else {
            reject(new Error('Invalid credentials'))
          }
        }, 1000) // Simulate network delay
      })

      const response = await mockApiCall
      
      // Store auth data
      localStorage.setItem('urbancare_token', response.token)
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

      // TODO: Replace with actual API call when backend is ready
      const mockApiCall = new Promise((resolve, reject) => {
        setTimeout(() => {
          // Mock successful registration
          if (userData.email && userData.password && userData.name) {
            resolve({
              user: {
                id: Date.now(),
                email: userData.email,
                name: userData.name,
                userType: userData.userType || 'customer',
                avatar: null,
                createdAt: new Date().toISOString()
              },
              token: `mock_token_${Date.now()}`
            })
          } else {
            reject(new Error('Missing required fields'))
          }
        }, 1000)
      })

      const response = await mockApiCall
      
      // Store auth data
      localStorage.setItem('urbancare_token', response.token)
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
    localStorage.removeItem('urbancare_token')
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
