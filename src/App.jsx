import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
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

// AppLayout component to handle footer positioning
function AppLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  
  // Get sidebar state from localStorage for footer positioning
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedSidebar = localStorage.getItem('urbancare-sidebar-collapsed');
    return savedSidebar ? savedSidebar === 'true' : false;
  });

  // Listen for sidebar state changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSidebar = localStorage.getItem('urbancare-sidebar-collapsed');
      setSidebarCollapsed(savedSidebar ? savedSidebar === 'true' : false);
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when sidebar state changes
    window.addEventListener('sidebarToggle', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarToggle', handleStorageChange);
    };
  }, []);

  return (
    <>
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
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/provider" element={<Provider />} />
      </Routes>
      {!isDashboard && <Footer />}
      {isDashboard && <Footer sidebarCollapsed={sidebarCollapsed} />}
      <ScrollToTopButton />
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <AppLayout />
          </Router>
        </BookingProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
