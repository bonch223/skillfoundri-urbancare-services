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
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ toggleDarkMode, darkMode, collapsed, toggleSidebar, isOpen, toggleMobileSidebar }) {
  const { user, isCustomer, isProvider } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

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
    <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'mobile-open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        {/* Controls Only */}
        <div className="header-controls-only">
          {/* Theme Toggle */}
          {!collapsed && (
            <div className="theme-toggle-compact" onClick={toggleDarkMode}>
              <div className="toggle-button-compact">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              </div>
            </div>
          )}
          
          {/* Collapsed Theme Toggle */}
          {collapsed && (
            <button className="theme-toggle-collapsed" onClick={toggleDarkMode}>
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          )}
          
          {/* Collapse Toggle - Desktop */}
          <button 
            className="collapse-toggle desktop-only" 
            onClick={toggleSidebar}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      {!collapsed && (
        <div className="user-profile-section">
          <div className="user-avatar-large">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info-compact">
            <div className="user-name-large">{user?.name}</div>
            <div className="user-status">
              <div className="status-indicator"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      )}
      
      {collapsed && (
        <div className="user-profile-collapsed">
          <div className="user-avatar-collapsed">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isCurrentlyActive = isActive(item.path);
            return (
              <li key={index} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${isCurrentlyActive ? 'active' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <IconComponent size={24} className="nav-icon" />
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="version-info">
            <span>Version 1.0.0</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
