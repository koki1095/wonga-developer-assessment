import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { user } from '../services/api';
import logo from '../assets/Wonga_logo-1.png';
import ThankYouModal from '../components/ThankYouModal';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(currentUser);
  const [loading, setLoading] = useState(!currentUser);
  const [loanAmount, setLoanAmount] = useState(3700);
  const [loanDays, setLoanDays] = useState(35);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await user.getCurrentUser();
        setUserDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!currentUser) {
      fetchUserDetails();
    }
  }, [currentUser]);

  const calculateRepayment = () => {
    const interest = loanAmount * 0.2;
    const fees = 57.26;
    return (loanAmount + interest + fees).toFixed(2);
  };

  const getRepaymentDate = () => {
    const date = new Date(Date.now() + loanDays * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleApplyNow = () => {
    setShowThankYou(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src={logo} alt="Wonga" className="h-8 w-auto" />
              <span className="ml-3 text-lg font-medium text-gray-700">Dashboard</span>
            </div>
            <div className="flex items-center">
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

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-xl p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {userDetails?.firstName}! 🎉</h1>
          <p className="text-blue-100">Here's what you can borrow today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">What you can get</h2>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">New customers:</span> Up to R5,000 with 3 months to repay
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <span className="font-medium">Existing customers:</span> Up to R8,000 with up to 6 months to repay
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount: R{loanAmount}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="8000"
                    step="100"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>R500</span>
                    <span>R8,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repayment Period: {loanDays} days
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="180"
                    step="1"
                    value={loanDays}
                    onChange={(e) => setLoanDays(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>7 days</span>
                    <span>180 days</span>
                  </div>
                </div>
              </div>

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

          <div className="lg:col-span-1">
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
                  <p className="text-sm font-medium text-gray-900">February 2026</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Your instant offer</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Loan amount</span>
                  <span className="text-xl font-bold">R{loanAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Repayment date</span>
                  <span className="font-semibold">{getRepaymentDate()}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-blue-500">
                  <span className="text-blue-100">Total repayment</span>
                  <span className="text-2xl font-bold">R{calculateRepayment()}</span>
                </div>
                <button 
                  onClick={handleApplyNow}
                  className="w-full mt-4 bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                >
                  Apply Now
                </button>
                <p className="text-xs text-blue-200 text-center mt-2">
                  Interest & fees: R{(calculateRepayment() - loanAmount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-8">
          <div className="text-xs text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Koketso Pooe Assignment
          </div>
        </div>
      </div>

      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        loanAmount={loanAmount}
        repaymentDate={getRepaymentDate()}
      />
    </div>
  );
};

export default Dashboard;
