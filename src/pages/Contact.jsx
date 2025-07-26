import React from 'react';
import { Mail, Phone } from 'lucide-react';

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-orange-500 text-white px-6 py-2.5 rounded-full inline-block mb-6 shadow-lg text-sm font-semibold tracking-wide animate-pulse">
              📞 Contact Us
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Get in Touch with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">UrbanCare</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              We are here to assist you. Reach out to us through any of the means below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Contact Form</h2>
            <div className="space-y-4">
              <input type="text" className="w-full px-4 py-3 rounded-lg border-0 bg-gray-50 text-gray-800 placeholder-gray-500 shadow focus:ring-4 focus:ring-blue-300/50 text-lg" placeholder="Your Name" required />
              <input type="email" className="w-full px-4 py-3 rounded-lg border-0 bg-gray-50 text-gray-800 placeholder-gray-500 shadow focus:ring-4 focus:ring-blue-300/50 text-lg" placeholder="Your Email" required />
              <textarea className="w-full px-4 py-3 rounded-lg border-0 bg-gray-50 text-gray-800 placeholder-gray-500 shadow focus:ring-4 focus:ring-blue-300/50 text-lg" rows="5" placeholder="Your Message" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
              Send Message
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-600">🔗 Connect with us:</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="mailto:info@urbancare.services" className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600">
                <Mail className="w-6 h-6" />
              </a>
              <a href="tel:+1234567890" className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600">
                <Phone className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;

