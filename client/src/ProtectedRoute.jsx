import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/app/v1/user/verify-token', {
          headers: {
            'x-access-token': `Bearer ${token}`
          }
        });

        setIsAuthenticated(response.data.valid);
      } catch (error) {
        console.error('Token verification failed', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="app/v1/user/login" replace />;
};

export default ProtectedRoute;