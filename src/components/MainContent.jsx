import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';

function MainContent() {
  const { user } = useAuth();
  
  // Check if user exists and determine if they are a provider
  const isProvider = user?.userType === 'provider';

  return (
    <div className="main-content">
      {isProvider ? <ProviderDashboard /> : <CustomerDashboard />}
    </div>
  );
}

export default MainContent;
