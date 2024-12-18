import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/app/v1/user/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserInfo(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to fetch user information. Please try again.');
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-300">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-300">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">User Profile</h2>
        {userInfo ? (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Name:</h3>
              <p className="text-gray-600">{userInfo.name || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Email:</h3>
              <p className="text-gray-600">{userInfo.email || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">No user information available.</div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;