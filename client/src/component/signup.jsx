import React, { useState } from 'react';
import LoginForm from './Login';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDob] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email, password, dateOfBirth };

    fetch("http://localhost:8080/app/v1/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to sign up.");
        return response.json();
      })
      .then((data) => {
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <div className="w-full max-w-sm p-8 bg-white border rounded-lg shadow-lg">
        {isSubmitted ? (
          <div className="text-center">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Successfully Signed Up!</h2>
            <p className="mb-6 text-gray-700">Please login now.</p>
            <LoginForm />
            <div className="mt-6 text-center">
              <button onClick={() => navigate('/profile')} className="text-blue-600 hover:underline focus:outline-none">
                Go to Profile
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Create Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500" placeholder="Your Name" required />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500" placeholder="you@example.com" required />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500" placeholder="Enter your password" required />
              </div>

              <div className="mb-6">
                <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" id="dob" value={dateOfBirth} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500" required />
              </div>

              <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
                Sign Up
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
