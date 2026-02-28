// Axios HTTP client library for making API requests
import axios from 'axios'; // HTTP client for REST API communication

// API base URL configuration - uses environment variable or defaults to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL, // Base URL for all API requests
  headers: {
    'Content-Type': 'application/json', // Default content type for requests
  },
});

// Request interceptor - automatically adds JWT token to requests
api.interceptors.request.use(
  (config) => {
    // Retrieve JWT token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Add Authorization header with Bearer token for authenticated requests
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Return modified config
  },
  (error) => {
    // Handle request errors (rarely triggered)
    return Promise.reject(error);
  }
);

// Response interceptor - handles common response scenarios
api.interceptors.response.use(
  (response) => response, // Pass successful responses through unchanged
  (error) => {
    // Handle 401 Unauthorized responses (expired/invalid token)
    if (error.response?.status === 401) {
      // Clear authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    // Reject promise with error for component error handling
    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const auth = {
  // User registration endpoint
  register: (userData) => api.post('/auth/register', userData), // POST /api/auth/register

  // User login endpoint
  login: (credentials) => api.post('/auth/login', credentials), // POST /api/auth/login
};

// User management API endpoints
export const user = {
  // Get current authenticated user profile
  getCurrentUser: () => api.get('/user/me'), // GET /api/user/me
};

// Export default axios instance for custom API calls
export default api;
