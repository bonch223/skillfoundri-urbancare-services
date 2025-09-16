import React from 'react';
import { 
  Calendar, 
  CreditCard, 
  Star, 
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function CustomerDashboard() {
  // Mock data - will be replaced with real data from context/API
  const mockStats = {
    totalBookings: 12,
    completedBookings: 8,
    pendingBookings: 2,
    totalSpent: 15450,
    averageRating: 4.8,
    favoriteProviders: 3
  };

  const recentBookings = [
    {
      id: 1,
      service: 'Home Cleaning',
      provider: 'Maria Santos',
      date: '2025-01-28',
      time: '10:00 AM',
      status: 'completed',
      amount: 1200
    },
    {
      id: 2,
      service: 'Plumbing Repair',
      provider: 'Juan Dela Cruz',
      date: '2025-01-30',
      time: '2:00 PM',
      status: 'pending',
      amount: 2500
    },
    {
      id: 3,
      service: 'Laundry Service',
      provider: 'Ana Rodriguez',
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
    <div className="customer-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back!</h1>
          <p className="dashboard-subtitle">Here's what's happening with your services</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <Calendar size={20} />
            Book New Service
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.completedBookings}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">₱{mockStats.totalSpent.toLocaleString()}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-orange">
            <Star size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.averageRating}</div>
            <div className="stat-label">Avg Rating Given</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Bookings */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Bookings</h3>
            <a href="/bookings" className="card-link">View All</a>
          </div>
          <div className="card-content">
            <div className="bookings-list">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-info">
                    <div className="booking-service">{booking.service}</div>
                    <div className="booking-provider">with {booking.provider}</div>
                    <div className="booking-datetime">
                      <Clock size={14} />
                      {booking.date} at {booking.time}
                    </div>
                  </div>
                  <div className="booking-details">
                    <div className="booking-amount">₱{booking.amount.toLocaleString()}</div>
                    <div className={`booking-status ${getStatusColor(booking.status)}`}>
                      {booking.status}
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
                <Calendar size={20} />
                <span>Book Service</span>
              </button>
              <button className="quick-action-btn">
                <Star size={20} />
                <span>Leave Review</span>
              </button>
              <button className="quick-action-btn">
                <CreditCard size={20} />
                <span>View Payments</span>
              </button>
              <button className="quick-action-btn">
                <MapPin size={20} />
                <span>Find Providers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <h3 className="card-title">Booking Activity</h3>
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
                  <div className="notification-text">Your booking with Maria Santos has been completed</div>
                  <div className="notification-time">2 hours ago</div>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-icon notification-warning">
                  <AlertCircle size={16} />
                </div>
                <div className="notification-content">
                  <div className="notification-text">Reminder: Upcoming service at 2:00 PM today</div>
                  <div className="notification-time">4 hours ago</div>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-icon notification-info">
                  <Star size={16} />
                </div>
                <div className="notification-content">
                  <div className="notification-text">Please rate your experience with Juan Dela Cruz</div>
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

export default CustomerDashboard;
