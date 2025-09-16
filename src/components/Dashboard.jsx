import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import './Dashboard.css';

function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('urbancare-theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Check localStorage for saved sidebar preference
    const savedSidebar = localStorage.getItem('urbancare-sidebar-collapsed');
    return savedSidebar ? savedSidebar === 'true' : false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile

  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('urbancare-theme', newTheme ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('urbancare-sidebar-collapsed', newCollapsed.toString());
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('sidebarToggle'));
  };

  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Apply theme to document body for global styling
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : 'light-mode'} ${
      sidebarCollapsed ? 'sidebar-collapsed' : ''
    } ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode}
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isOpen={sidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />
      <MainContent 
        darkMode={darkMode}
        sidebarCollapsed={sidebarCollapsed}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;

