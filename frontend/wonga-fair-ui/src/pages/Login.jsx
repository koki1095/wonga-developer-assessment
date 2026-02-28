// React core imports for component functionality
import React, { useState } from 'react'; // React library and useState hook for state management
import { Link, useNavigate } from 'react-router-dom'; // React Router for navigation and linking
import { useAuth } from '../context/AuthContext'; // Custom authentication context hook
import logo from '../assets/Wonga_logo-1.png'; // Wonga logo asset import

// Login component - handles user authentication and login form
const Login = () => {
  // State management for form data (email and password inputs)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State management for form validation errors
  const [errors, setErrors] = useState({});

  // Authentication context hook provides login function and error state
  const { login, error } = useAuth();

  // Navigation hook for programmatic routing after successful login
  const navigate = useNavigate();

  // Handle input field changes - updates form data and clears field-specific errors
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Dynamic property update based on input name
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  // Client-side form validation function
  const validateForm = () => {
    const newErrors = {};

    // Email validation - required and proper email format
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation - required field
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors; // Return validation errors object
  };

  // Handle form submission - validates, calls login API, and navigates on success
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate form before submission
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set validation errors if any
      return;
    }

    // Call authentication context login function
    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard'); // Navigate to dashboard on successful login
    }
  };

  // JSX return - renders the login page UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header section with Wonga branding */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Wonga" className="h-10 w-auto" /> {/* Wonga logo display */}
            <div className="text-sm text-gray-600">
              <span className="hidden sm:inline">New to Wonga? </span>
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Create account {/* Link to registration page */}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Loan calculator preview - shows example loan terms */}
          <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What you could get</h3>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">Loan amount</p>
                <p className="text-2xl font-bold text-gray-900">R2,500</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Repayment</p>
                <p className="text-2xl font-bold text-blue-600">R3,057</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>Example: R2,500 over 26 days. Total repayment R3,057 (incl. interest & fees).</p>
            </div>
          </div>

          {/* Login form container */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>

            {/* Form element with submit handler */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Display authentication error from context if present */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Email input field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="you@example.com"
                />
                {/* Display email validation error */}
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password input field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="••••••••"
                />
                {/* Display password validation error */}
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign in
              </button>

              {/* Link to registration page */}
              <div className="text-center text-sm">
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Don't have an account? Sign up
                </Link>
              </div>
            </form>
          </div>

          {/* Trust badges section - displays security and regulatory compliance */}
          <div className="mt-8 flex justify-center space-x-6">
            <div className="text-xs text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Koketso Assignment {/* Name security badge */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; // Export component as default export
