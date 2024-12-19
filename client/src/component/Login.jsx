import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/app/v1/user/signin', {
        email,
        Password
      });
      if (response.data.auth) {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
        navigate('/');
        console.log('Login Success:', response.data);
      } else {
        setMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/profile')} className="text-blue-600 hover:underline focus:outline-none">
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
