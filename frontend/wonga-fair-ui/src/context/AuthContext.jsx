// React imports for context creation and hooks
import React, { createContext, useState, useContext, useEffect } from 'react'; // React context API and state management hooks
import { auth, user } from '../services/api'; // API service functions for authentication and user operations

// Create authentication context - provides authentication state and functions throughout the app
const AuthContext = createContext(null);

// Custom hook to use authentication context - ensures hook is used within provider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Error thrown if hook used outside of AuthProvider - prevents runtime errors
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component - wraps app to provide authentication state
export const AuthProvider = ({ children }) => {
  // State for current authenticated user information
  const [currentUser, setCurrentUser] = useState(null);

  // Loading state for initial authentication check
  const [loading, setLoading] = useState(true);

  // Error state for authentication operations
  const [error, setError] = useState('');

  // useEffect hook to check for existing authentication on app startup
  useEffect(() => {
    // Check localStorage for saved authentication data
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      // If token and user exist, set current user and validate token
      setCurrentUser(JSON.parse(savedUser));
      validateToken(); // Validate token with backend
    } else {
      // No saved authentication, set loading to false
      setLoading(false);
    }
  }, []); // Empty dependency array - runs only once on mount

  // Function to validate JWT token with backend API
  const validateToken = async () => {
    try {
      // Call API to get current user - validates token and refreshes user data
      const response = await user.getCurrentUser();
      setCurrentUser(response.data);
      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Token validation failed:', error);
      logout(); // Clear invalid authentication data
    } finally {
      setLoading(false); // End loading state regardless of outcome
    }
  };

  // User registration function
  const register = async (userData) => {
    try {
      setError(''); // Clear any previous errors
      const response = await auth.register(userData); // Call registration API
      const { token, user } = response.data; // Extract token and user from response

      // Store authentication data in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user); // Update current user state

      return { success: true }; // Return success result
    } catch (error) {
      // Handle registration failure
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  // User login function
  const login = async (credentials) => {
    try {
      setError(''); // Clear any previous errors
      const response = await auth.login(credentials); // Call login API
      const { token, user } = response.data; // Extract token and user from response

      // Store authentication data in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user); // Update current user state

      return { success: true }; // Return success result
    } catch (error) {
      // Handle login failure
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Logout function - clears authentication data
  const logout = () => {
    localStorage.removeItem('token'); // Remove JWT token from storage
    localStorage.removeItem('user'); // Remove user data from storage
    setCurrentUser(null); // Clear current user state
  };

  // Context value object - contains all authentication state and functions
  const value = {
    currentUser, // Current authenticated user data
    loading, // Loading state for initial auth check
    error, // Current error message
    register, // User registration function
    login, // User login function
    logout, // User logout function
  };

  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
