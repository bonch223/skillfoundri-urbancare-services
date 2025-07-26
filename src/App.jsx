import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ScrollToTopOnRouteChange, ScrollToTopButton } from './components/ScrollToTop'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Provider from './pages/Provider'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { BookingProvider } from './contexts/BookingContext'
import { ToastProvider } from './contexts/ToastContext'
import { ToastContainer } from './components/Toast'
import './App.css'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <ScrollToTopOnRouteChange />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<ProtectedRoute requireAuth={false}><Login /></ProtectedRoute>} />
              <Route path="/signup" element={<ProtectedRoute requireAuth={false}><Signup /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/provider" element={<Provider />} />
            </Routes>
            <Footer />
            <ScrollToTopButton />
            <ToastContainer />
          </Router>
        </BookingProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
