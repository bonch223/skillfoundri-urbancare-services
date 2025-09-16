import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Sparkles, ArrowRight } from 'lucide-react'

function MobileServicesCarousel({ services }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === services.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [currentIndex, isAutoPlaying, services.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === 0 ? services.length - 1 : currentIndex - 1)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10s
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === services.length - 1 ? 0 : currentIndex + 1)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10s
  }

  const goToSlide = (index) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10s
  }

  if (!services || services.length === 0) return null

  const currentService = services[currentIndex]
  const IconComponent = currentService.icon

  return (
    <div className="services-mobile-carousel block md:hidden">
      <div className="relative max-w-sm mx-auto">
        {/* Main Card */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/40 pointer-events-none"></div>
          
          {/* Card Content */}
          <div className="relative p-6 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-30 scale-110"></div>
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
                  <IconComponent className="w-10 h-10 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Service Name */}
            <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight">
              {currentService.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {currentService.description}
            </p>

            {/* Features */}
            <div className="mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto mb-4"></div>
              <ul className="space-y-3 text-left">
                {currentService.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm relative overflow-hidden group">
              {/* Button Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <Sparkles className="w-4 h-4 group-hover:animate-spin transition-transform duration-300" />
              <span>Explore Service</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-50 animate-bounce"></div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200/50"
          aria-label="Previous service"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200/50"
          aria-label="Next service"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-125 shadow-lg'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to service ${index + 1}`}
          />
        ))}
      </div>

      {/* Service Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          {currentIndex + 1} of {services.length}
        </span>
      </div>
    </div>
  )
}

export default MobileServicesCarousel
