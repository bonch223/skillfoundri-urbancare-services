import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  userType = null,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // If user is authenticated but shouldn't be (e.g., login page when already logged in)
  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard'
    console.log('🔐 ProtectedRoute: Authenticated user trying to access non-auth page', {
      currentPath: location.pathname,
      fromState: location.state?.from?.pathname,
      redirectingTo: from
    })
    return <Navigate to={from} replace />
  }

  // If specific user type is required
  if (userType && user?.userType !== userType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Access Denied</h3>
              <div className="text-xs">
                This page is only accessible to {userType}s.
              </div>
            </div>
          </div>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
