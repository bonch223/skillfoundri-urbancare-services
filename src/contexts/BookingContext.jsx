import React, { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

// Create BookingContext
const BookingContext = createContext()

// Custom hook to use BookingContext
export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

// BookingProvider component
export const BookingProvider = ({ children }) => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Create a new booking
  const createBooking = async (bookingData) => {
    try {
      setLoading(true)
      setError(null)

      // Generate booking reference
      const bookingReference = `UC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      // TODO: Replace with actual API call when backend is ready
      const mockApiCall = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (bookingData.serviceId && bookingData.packageType && bookingData.scheduledDate) {
            const newBooking = {
              id: Date.now(),
              bookingReference,
              customerId: user.id,
              customerName: user.name,
              customerEmail: user.email,
              serviceId: bookingData.serviceId,
              serviceName: bookingData.serviceName,
              packageType: bookingData.packageType,
              packageName: bookingData.packageName,
              price: bookingData.price,
              scheduledDate: bookingData.scheduledDate,
              scheduledTime: bookingData.scheduledTime,
              duration: bookingData.duration,
              serviceAddress: bookingData.serviceAddress,
              specialInstructions: bookingData.specialInstructions || '',
              contactPhone: bookingData.contactPhone,
              status: 'pending',
              paymentStatus: 'pending',
              createdAt: new Date().toISOString(),
              estimatedCompletionTime: calculateCompletionTime(bookingData.scheduledDate, bookingData.scheduledTime, bookingData.duration)
            }
            resolve(newBooking)
          } else {
            reject(new Error('Missing required booking information'))
          }
        }, 1000) // Simulate network delay
      })

      const newBooking = await mockApiCall
      
      // Add booking to local state
      setBookings(prev => [newBooking, ...prev])
      
      return newBooking
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Get user's bookings
  const getUserBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual API call when backend is ready
      const mockApiCall = new Promise((resolve) => {
        setTimeout(() => {
          // Return user's bookings (filtered by user ID)
          const userBookings = bookings.filter(booking => booking.customerId === user?.id)
          resolve(userBookings)
        }, 500)
      })

      const userBookings = await mockApiCall
      return userBookings
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual API call when backend is ready
      const mockApiCall = new Promise((resolve) => {
        setTimeout(() => {
          const updatedBookings = bookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
              : booking
          )
          setBookings(updatedBookings)
          resolve(updatedBookings.find(b => b.id === bookingId))
        }, 500)
      })

      const updatedBooking = await mockApiCall
      return updatedBooking
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Cancel booking
  const cancelBooking = async (bookingId, reason) => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual API call when backend is ready
      const mockApiCall = new Promise((resolve) => {
        setTimeout(() => {
          const updatedBookings = bookings.map(booking => 
            booking.id === bookingId 
              ? { 
                  ...booking, 
                  status: 'cancelled', 
                  cancellationReason: reason,
                  cancelledAt: new Date().toISOString() 
                }
              : booking
          )
          setBookings(updatedBookings)
          resolve(updatedBookings.find(b => b.id === bookingId))
        }, 500)
      })

      const cancelledBooking = await mockApiCall
      return cancelledBooking
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Helper function to calculate estimated completion time
  const calculateCompletionTime = (date, time, duration) => {
    const startDateTime = new Date(`${date}T${time}`)
    const durationHours = parseInt(duration.split('-')[1] || duration.split(' ')[0]) || 2
    const endDateTime = new Date(startDateTime.getTime() + (durationHours * 60 * 60 * 1000))
    return endDateTime.toISOString()
  }

  // Get available time slots for a given date
  const getAvailableTimeSlots = (date) => {
    const timeSlots = [
      '08:00', '09:00', '10:00', '11:00', 
      '12:00', '13:00', '14:00', '15:00', 
      '16:00', '17:00', '18:00'
    ]

    // TODO: Filter out already booked slots when backend is ready
    // For now, return all slots as available
    return timeSlots.map(time => ({
      time,
      available: true,
      label: formatTime(time)
    }))
  }

  // Helper function to format time
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Get booking statistics
  const getBookingStats = () => {
    const userBookings = bookings.filter(booking => booking.customerId === user?.id)
    return {
      total: userBookings.length,
      pending: userBookings.filter(b => b.status === 'pending').length,
      confirmed: userBookings.filter(b => b.status === 'confirmed').length,
      completed: userBookings.filter(b => b.status === 'completed').length,
      cancelled: userBookings.filter(b => b.status === 'cancelled').length
    }
  }

  const value = {
    bookings: bookings.filter(booking => booking.customerId === user?.id),
    loading,
    error,
    createBooking,
    getUserBookings,
    updateBookingStatus,
    cancelBooking,
    getAvailableTimeSlots,
    getBookingStats,
    formatTime
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export default BookingContext
