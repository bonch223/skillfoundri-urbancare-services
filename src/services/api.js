// API Base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://urbancare-backend-7oxzkz2z7-bonch223s-projects.vercel.app/api'
  : 'http://localhost:5000/api';

// Debug log
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🏗️ Environment:', process.env.NODE_ENV);

// API Configuration
const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const { method = 'GET', data, headers = {}, requireAuth = false } = options;
    
    const url = `${apiConfig.baseURL}${endpoint}`;
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Prepare headers
    const requestHeaders = {
      ...apiConfig.headers,
      ...headers,
    };
    
    // Add auth header if required and token exists
    if (requireAuth && token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
    
    // Prepare fetch options
    const fetchOptions = {
      method,
      headers: requestHeaders,
    };
    
    // Add body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    // Make the request
    const response = await fetch(url, fetchOptions);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = { message: await response.text() };
    }
    
    // Handle error responses
    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }
    
    return responseData;
    
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register new user
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    data: userData,
  }),
  
  // Login user
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    data: credentials,
  }),
  
  // Get current user profile
  getProfile: () => apiCall('/auth/me', {
    requireAuth: true,
  }),
  
  // Update user profile
  updateProfile: (profileData) => apiCall('/auth/profile', {
    method: 'PUT',
    data: profileData,
    requireAuth: true,
  }),
};

// Booking API
export const bookingAPI = {
  // Create a new booking
  create: (bookingData) => apiCall('/bookings', {
    method: 'POST',
    data: bookingData,
    requireAuth: true,
  }),
  
  // Get user's bookings
  getMyBookings: () => apiCall('/bookings/my-bookings', {
    requireAuth: true,
  }),
  
  // Get specific booking by ID
  getById: (bookingId) => apiCall(`/bookings/${bookingId}`, {
    requireAuth: true,
  }),
  
  // Update booking status
  updateStatus: (bookingId, statusData) => apiCall(`/bookings/${bookingId}/status`, {
    method: 'PUT',
    data: statusData,
    requireAuth: true,
  }),
  
  // Get booking statistics
  getStats: () => apiCall('/bookings/stats/summary', {
    requireAuth: true,
  }),
};

// Services API
export const servicesAPI = {
  // Get all services
  getAll: () => apiCall('/services'),
  
  // Get service by ID
  getById: (serviceId) => apiCall(`/services/${serviceId}`),
  
  // Search services
  search: (searchTerm) => apiCall(`/services/search?q=${encodeURIComponent(searchTerm)}`),
  
  // Get services by category
  getByCategory: (category) => apiCall(`/services/category/${category}`),
};

// Users API
export const usersAPI = {
  // Get user profile
  getProfile: () => apiCall('/users/profile', {
    requireAuth: true,
  }),
  
  // Update user profile
  updateProfile: (profileData) => apiCall('/users/profile', {
    method: 'PUT',
    data: profileData,
    requireAuth: true,
  }),
  
  // Get all providers
  getProviders: () => apiCall('/users/providers'),
};

// Health Check API
export const healthAPI = {
  check: () => apiCall('/health'),
};

// Export the main API object
export const API = {
  auth: authAPI,
  bookings: bookingAPI,
  services: servicesAPI,
  users: usersAPI,
  health: healthAPI,
};

// Export individual APIs for convenience
export default API;
