// React core imports and hooks for component functionality
import React, { useEffect, useState } from 'react'; // React library, useEffect for side effects, useState for state management
import { useAuth } from '../context/AuthContext'; // Custom authentication context hook
import { user } from '../services/api'; // API service functions for user operations
import logo from '../assets/Wonga_logo-1.png'; // Wonga logo asset import

// Dashboard component - displays user dashboard with loan calculator and profile information
const Dashboard = () => {
  // Authentication context provides current user data and logout function
  const { currentUser, logout } = useAuth();

  // State for storing detailed user information fetched from API
  const [userDetails, setUserDetails] = useState(currentUser);

  // Loading state to show spinner while fetching user data
  const [loading, setLoading] = useState(!currentUser);

  // State for loan calculator - amount and repayment period
  const [loanAmount, setLoanAmount] = useState(2500); // Default loan amount in Rands
  const [loanDays, setLoanDays] = useState(26); // Default repayment period in days

  // useEffect hook to fetch current user details on component mount
  // Only runs if currentUser is not already available from context
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // API call to get current user profile information
        const response = await user.getCurrentUser();
        setUserDetails(response.data); // Update state with fetched user data
      } catch (error) {
        console.error('Failed to fetch user details:', error); // Log error for debugging
      } finally {
        setLoading(false); // Set loading to false regardless of success/failure
      }
    };

    // Only fetch if user details not already available
    if (!currentUser) {
      fetchUserDetails();
    }
  }, [currentUser]); // Dependency array - re-run if currentUser changes

  // Helper function to calculate total repayment amount
  // Includes principal + interest (20%) + fees (R57.26)
  const calculateRepayment = () => {
    const interest = loanAmount * 0.2; // 20% interest calculation
    const fees = 57.26; // Fixed fee amount
    return (loanAmount + interest + fees).toFixed(2); // Return formatted total as string
  };

  // Show loading spinner while user data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Main JSX return - renders the complete dashboard UI
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation header with Wonga branding */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src={logo} alt="Wonga" className="h-8 w-auto" /> {/* Wonga logo */}
              <span className="ml-3 text-lg font-medium text-gray-700">Dashboard</span> {/* Page title */}
            </div>
            <div className="flex items-center">
              {/* Logout button - calls authentication context logout function */}
              <button
                onClick={logout}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main dashboard content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome banner with personalized greeting */}
        <div className="bg-blue-600 rounded-xl p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {userDetails?.firstName}! 👋</h1>
          <p className="text-blue-100">Here's what you can borrow today</p>
        </div>

        {/* Main content grid - responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Loan calculator and application info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">What you can get</h2>

              {/* Loan limits information banner */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">New customers:</span> Up to R5,000 with 3 months to repay
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <span className="font-medium">Existing customers:</span> Up to R8,000 with up to 6 months to repay
                </p>
              </div>

              {/* Interactive loan calculator controls */}
              <div className="space-y-6">
                {/* Loan amount slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount: R{loanAmount} {/* Display current selected amount */}
                  </label>
                  <input
                    type="range"
                    min="500" // Minimum loan amount
                    max="8000" // Maximum loan amount
                    step="100" // Increment step
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))} // Update state on change
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>R500</span> {/* Minimum label */}
                    <span>R8,000</span> {/* Maximum label */}
                  </div>
                </div>

                {/* Repayment period slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repayment Period: {loanDays} days {/* Display current selected period */}
                  </label>
                  <input
                    type="range"
                    min="7" // Minimum repayment period
                    max="180" // Maximum repayment period
                    step="1" // Increment step (1 day)
                    value={loanDays}
                    onChange={(e) => setLoanDays(Number(e.target.value))} // Update state on change
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>7 days</span> {/* Minimum label */}
                    <span>180 days</span> {/* Maximum label */}
                  </div>
                </div>
              </div>

              {/* Application process information */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">How to apply:</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2">1</span>
                    Choose the amount you need
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2">2</span>
                    Choose how long you will need to repay
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2">3</span>
                    Click "Apply Now" and proceed to finalise your loan
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Right column - User profile and loan offer */}
          <div className="lg:col-span-1">
            {/* User profile card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Profile</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">First Name</p>
                  <p className="text-sm font-medium text-gray-900">{userDetails?.firstName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Name</p>
                  <p className="text-sm font-medium text-gray-900">{userDetails?.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{userDetails?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Member since</p>
                  <p className="text-sm font-medium text-gray-900">February 2026</p> {/* Static date for demo */}
                </div>
              </div>
            </div>

            {/* Instant loan offer card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Your instant offer</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Loan amount</span>
                  <span className="text-xl font-bold">R{loanAmount}</span> {/* Dynamic loan amount */}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Repayment date</span>
                  <span className="font-semibold">
                    {/* Calculate and display repayment date based on loan period */}
                    {new Date(Date.now() + loanDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-blue-500">
                  <span className="text-blue-100">Total repayment</span>
                  <span className="text-2xl font-bold">R{calculateRepayment()}</span> {/* Calculated total repayment */}
                </div>
                {/* Apply now button - currently placeholder */}
                <button className="w-full mt-4 bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white">
                  Apply Now
                </button>
                <p className="text-xs text-blue-200 text-center mt-2">
                  Interest & fees: R{(calculateRepayment() - loanAmount).toFixed(2)} {/* Display interest and fees breakdown */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges footer - displays security and regulatory compliance */}
        <div className="mt-8 flex justify-center space-x-8">
          <div className="text-xs text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Koketso Assignment {/* SSL security badge */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard; // Export component as default export
