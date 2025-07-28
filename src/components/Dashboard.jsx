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

  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('urbancare-theme', newTheme ? 'dark' : 'light');
  };

  // Apply theme to document body for global styling
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Sidebar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <MainContent darkMode={darkMode} />
    </div>
  );
}

export default Dashboard;

