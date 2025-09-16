import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';

function MainContent({ darkMode, sidebarCollapsed, toggleMobileSidebar }) {
  const { user } = useAuth();
  
  // Check if user exists and determine if they are a provider
  const isProvider = user?.userType === 'provider';

  return (
    <div className="main-content">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-button"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>
      
      {/* Dashboard Content */}
      <div className="main-content-inner">
        {isProvider ? <ProviderDashboard /> : <CustomerDashboard />}
      </div>
    </div>
  );
}

export default MainContent;
