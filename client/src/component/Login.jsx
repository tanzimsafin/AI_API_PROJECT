import React, { useState } from 'react';
import axios from 'axios';
import Home from './Home';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/app/v1/user/signin', {
        email,
        Password
      });
      if (response.data.auth) {
        localStorage.setItem('token', response.data.token);
        console.log('Login Success:', response.data);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setMessage('Login failed. Please check your credentials.');
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setMessage('');
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/app/v1/user/forgetPassword', {
        email: forgotEmail
      });
      
      if (response.data.exists) {
        setShowNewPasswordField(true);
        setMessage('Email verified. Please enter a new password.');
      } else {
        setMessage('Email not found in our system.');
      }
    } catch (error) {
      console.error('Forgot Password Error:', error);
      setMessage('Error verifying email. Please try again.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:8080/app/v1/user/forgetPassword', {
        email: forgotEmail,
        password: newPassword
      });
      
      setMessage(response.data.message);
      // Reset form after successful password update
      setShowForgotPassword(false);
      setShowNewPasswordField(false);
      setForgotEmail('');
      setNewPassword('');
    } catch (error) {
      console.error('Password Update Error:', error);
      setMessage('Failed to update password. Please try again.');
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowNewPasswordField(false);
    setMessage('');
  };

  return (
    
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-md">

        {!showForgotPassword ? (
          <>
            <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
              Login
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="mb-4 flex justify-between items-center">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </>
        ) : !showNewPasswordField ? (
          <>
            <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
              Forgot Password
            </h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="forgotEmail"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="username@example.com"
                  required
                />
              </div>

              <div className="mb-4 flex space-x-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Verify Email
                </button>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100 focus:outline-none"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
              Reset Password
            </h2>
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="mb-4 flex space-x-2">
                <button
                  type="submit"
                  className="w-full px-2 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100 focus:outline-none"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        )}

        {message && (
          <div className={`mt-4 text-center text-sm ${message.toLowerCase().includes('error') || message.toLowerCase().includes('failed') || message.toLowerCase().includes('not found') || message.toLowerCase().includes('invalid') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;