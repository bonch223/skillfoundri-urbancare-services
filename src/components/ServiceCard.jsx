import React from 'react'

const ServiceCard = ({ service, onLearnMore }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="text-4xl mb-4">{service.icon}</div>
      <h4 className="text-xl font-semibold text-gray-900 mb-3">{service.name}</h4>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <button 
        className="btn-secondary w-full"
        onClick={() => onLearnMore(service)}
      >
        Learn More
      </button>
    </div>
  )
}

export default ServiceCard
