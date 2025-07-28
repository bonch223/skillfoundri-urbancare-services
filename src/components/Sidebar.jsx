import React from 'react';
import { 
  Home, 
  Calendar, 
  User, 
  Settings, 
  Bell, 
  CreditCard, 
  Star, 
  BarChart3,
  MessageSquare,
  FileText,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Sidebar({ toggleDarkMode, darkMode }) {
  const { user, isCustomer, isProvider } = useAuth();

  const customerMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'My Bookings', path: '/bookings' },
    { icon: Star, label: 'Reviews', path: '/reviews' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const providerMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Job Requests', path: '/job-requests' },
    { icon: BarChart3, label: 'Earnings', path: '/earnings' },
    { icon: FileText, label: 'My Services', path: '/my-services' },
    { icon: Star, label: 'Reviews', path: '/reviews' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const menuItems = isProvider ? providerMenuItems : customerMenuItems;

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">UrbanCare</span>
        </div>
        
        {/* Theme Toggle */}
        <div className="theme-toggle" onClick={toggleDarkMode}>
          <div className={`toggle-slider ${darkMode ? 'dark' : 'light'}`}>
            {darkMode ? (
              <>
                <span className="toggle-label">DARK MODE</span>
                <div className="toggle-button">
                  <Moon size={16} />
                </div>
              </>
            ) : (
              <>
                <div className="toggle-button">
                  <Sun size={16} />
                </div>
                <span className="toggle-label">LIGHT MODE</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="user-info">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <div className="user-name">{user?.name}</div>
          <div className="user-type">{user?.userType === 'provider' ? 'Service Provider' : 'Customer'}</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index} className="nav-item">
                <a href={item.path} className="nav-link">
                  <IconComponent size={20} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="version-info">
          <span>Version 1.0.0</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
