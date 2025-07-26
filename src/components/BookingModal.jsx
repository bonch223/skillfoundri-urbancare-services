import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, MapPin, Phone, User, CreditCard, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useBooking } from '../contexts/BookingContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'

const BookingModal = ({ isOpen, onClose, service, selectedPackage }) => {
  const { user, isAuthenticated } = useAuth()
  const { createBooking, loading, getAvailableTimeSlots, formatTime } = useBooking()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    serviceAddress: '',
    contactPhone: '',
    specialInstructions: ''
  })
  const [errors, setErrors] = useState({})
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setFormData({
        scheduledDate: '',
        scheduledTime: '',
        serviceAddress: '',
        contactPhone: '',
        specialInstructions: ''
      })
      setErrors({})
      setBookingConfirmed(false)
      setConfirmedBooking(null)
    }
  }, [isOpen])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      onClose()
      navigate('/login')
    }
  }, [isOpen, isAuthenticated, navigate, onClose])

  const currentPackage = service?.packages?.[selectedPackage]
  if (!service || !currentPackage) return null

  // Get tomorrow as minimum date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Get available time slots for selected date
  const availableTimeSlots = formData.scheduledDate ? getAvailableTimeSlots(formData.scheduledDate) : []

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (stepNumber) => {
    const newErrors = {}

    if (stepNumber === 1) {
      if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a date'
      if (!formData.scheduledTime) newErrors.scheduledTime = 'Please select a time'
    }

    if (stepNumber === 2) {
      if (!formData.serviceAddress.trim()) newErrors.serviceAddress = 'Service address is required'
      if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required'
      else if (!/^\d{10,11}$/.test(formData.contactPhone.replace(/\D/g, ''))) {
        newErrors.contactPhone = 'Please enter a valid phone number'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    try {
      const bookingData = {
        serviceId: service.id,
        serviceName: service.name,
        packageType: selectedPackage,
        packageName: currentPackage.name,
        price: currentPackage.price,
        duration: currentPackage.duration,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        serviceAddress: formData.serviceAddress,
        contactPhone: formData.contactPhone,
        specialInstructions: formData.specialInstructions
      }

      const booking = await createBooking(bookingData)
      setConfirmedBooking(booking)
      setBookingConfirmed(true)
      setStep(4) // Move to confirmation step
      showSuccess('Your booking has been confirmed! A service provider will contact you within 2 hours.')
    } catch (error) {
      console.error('Booking failed:', error)
      setErrors({ submit: 'Failed to create booking. Please try again.' })
      showError('Booking failed. Please check your information and try again.')
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state after modal closes
    setTimeout(() => {
      setStep(1)
      setBookingConfirmed(false)
      setConfirmedBooking(null)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book {service.name}</h2>
              <p className="text-blue-100 mt-1">{currentPackage.name} - {currentPackage.price}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          {!bookingConfirmed && (
            <div className="flex items-center mt-6 space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= stepNum 
                      ? 'bg-white text-blue-600' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-1 mx-2 ${
                      step > stepNum ? 'bg-white' : 'bg-blue-500'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Date & Time Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Select Date & Time
              </h3>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.scheduledDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>
                )}
              </div>

              {/* Time Selection */}
              {formData.scheduledDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableTimeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => handleInputChange('scheduledTime', slot.time)}
                        disabled={!slot.available}
                        className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                          formData.scheduledTime === slot.time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : slot.available
                            ? 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                  {errors.scheduledTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.scheduledTime}</p>
                  )}
                </div>
              )}

              {/* Service Duration Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center text-blue-800">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">Estimated Duration: {currentPackage.duration}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Service Details
              </h3>

              {/* Service Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Address
                </label>
                <textarea
                  value={formData.serviceAddress}
                  onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
                  placeholder="Enter the complete address where the service will be performed"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.serviceAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.serviceAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.serviceAddress}</p>
                )}
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="09XX XXX XXXX"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Any special requirements or instructions for the service provider"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Review & Confirm
              </h3>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Service Details</h4>
                    <p className="text-gray-600">{service.name}</p>
                    <p className="text-blue-600 font-medium">{currentPackage.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Customer</h4>
                    <p className="text-gray-600">{user?.name}</p>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Date & Time</h4>
                    <p className="text-gray-600">
                      {new Date(formData.scheduledDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-gray-600">{formatTime(formData.scheduledTime)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Contact</h4>
                    <p className="text-gray-600">{formData.contactPhone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Service Address</h4>
                  <p className="text-gray-600">{formData.serviceAddress}</p>
                </div>

                {formData.specialInstructions && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Special Instructions</h4>
                    <p className="text-gray-600">{formData.specialInstructions}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-800">Total Price:</span>
                    <span className="text-2xl font-bold text-blue-600">{currentPackage.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Duration: {currentPackage.duration}
                  </p>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && bookingConfirmed && confirmedBooking && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Your service has been successfully booked.</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
                <h4 className="font-medium text-green-800 mb-3">Booking Reference</h4>
                <p className="text-2xl font-mono font-bold text-green-600 mb-4">
                  {confirmedBooking.bookingReference}
                </p>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Service:</strong> {confirmedBooking.serviceName}</p>
                  <p><strong>Package:</strong> {confirmedBooking.packageName}</p>
                  <p><strong>Date:</strong> {new Date(confirmedBooking.scheduledDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {formatTime(confirmedBooking.scheduledTime)}</p>
                  <p><strong>Status:</strong> Pending Confirmation</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  A service provider will contact you within 2 hours to confirm the appointment details.
                  You can track your booking status in your profile.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex-shrink-0">
          {!bookingConfirmed ? (
            <div className="flex justify-between">
              <button
                onClick={step > 1 ? handlePrevious : handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {step > 1 ? 'Previous' : 'Cancel'}
              </button>
              
              <button
                onClick={step < 3 ? handleNext : handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : step < 3 ? 'Next' : 'Confirm Booking'}
              </button>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View My Bookings
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
