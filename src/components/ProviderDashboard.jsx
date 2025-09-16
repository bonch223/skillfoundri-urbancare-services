import React from 'react';
import {
  BarChart3,
  CreditCard,
  UserCheck,
  Clipboard,
  FileText,
  MessageSquare,
  Smile,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

function ProviderDashboard() {
  // Mock data - will be replaced with real data from context/API
  const mockStats = {
    totalJobs: 28,
    completedJobs: 22,
    pendingJobs: 4,
    totalEarnings: 22450,
    averageRating: 4.7
  };

  const recentJobs = [
    {
      id: 1,
      service: 'Home Cleaning',
      customer: 'Maria Santos',
      date: '2025-01-28',
      time: '10:00 AM',
      status: 'completed',
      amount: 1200
    },
    {
      id: 2,
      service: 'Plumbing Repair',
      customer: 'Juan Dela Cruz',
      date: '2025-01-30',
      time: '2:00 PM',
      status: 'pending',
      amount: 2500
    },
    {
      id: 3,
      service: 'Laundry Service',
      customer: 'Ana Rodriguez',
      date: '2025-01-25',
      time: '9:00 AM',
      status: 'completed',
      amount: 800
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="provider-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome to your provider dashboard!</h1>
          <p className="dashboard-subtitle">Here's an overview of your activities and performance</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <FileText size={20} />
            Add New Service
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalJobs}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.completedJobs}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">₱{mockStats.totalEarnings.toLocaleString()}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-orange">
            <Smile size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.averageRating}</div>
            <div className="stat-label">Avg Rating Received</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Jobs */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Jobs</h3>
            <a href="/jobs" className="card-link">View All</a>
          </div>
          <div className="card-content">
            <div className="jobs-list">
              {recentJobs.map((job) => (
                <div key={job.id} className="job-item">
                  <div className="job-info">
                    <div className="job-service">{job.service}</div>
                    <div className="job-customer">with {job.customer}</div>
                    <div className="job-datetime">
                      <Clock size={14} />
                      {job.date} at {job.time}
                    </div>
                  </div>
                  <div className="job-details">
                    <div className="job-amount">₱{job.amount.toLocaleString()}</div>
                    <div className={`job-status ${getStatusColor(job.status)}`}>
                      {job.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="quick-actions">
              <button className="quick-action-btn">
                <FileText size={20} />
                <span>Add Service</span>
              </button>
              <button className="quick-action-btn">
                <CreditCard size={20} />
                <span>View Earnings</span>
              </button>
              <button className="quick-action-btn">
                <UserCheck size={20} />
                <span>Update Profile</span>
              </button>
              <button className="quick-action-btn">
                <Clipboard size={20} />
                <span>Manage Services</span>
              </button>
            </div>
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <h3 className="card-title">Job Activity</h3>
            <select className="chart-filter">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>Last month</option>
            </select>
          </div>
          <div className="card-content">
            <div className="chart-placeholder">
              <TrendingUp size={48} className="chart-icon" />
              <p>Chart visualization will be added here</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Notifications</h3>
            <a href="/notifications" className="card-link">View All</a>
          </div>
          <div className="card-content">
            <div className="notifications-list">
              <div className="notification-item">
                <div className="notification-icon notification-success">
                  <CheckCircle size={16} />
                </div>
                <div className="notification-content">
                  <div className="notification-text">You received a new booking request from Maria Santos</div>
                  <div className="notification-time">2 hours ago</div>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-icon notification-warning">
                  <AlertCircle size={16} />
                </div>
                <div className="notification-content">
                  <div className="notification-text">Reminder: Confirm your availability for pending jobs</div>
                  <div className="notification-time">4 hours ago</div>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-icon notification-info">
                  <Smile size={16} />
                </div>
                <div className="notification-content">
                  <div className="notification-text">New customer review on your Cleaning Service</div>
                  <div className="notification-time">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
