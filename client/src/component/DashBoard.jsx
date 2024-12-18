import React from 'react';
import { useNavigate } from 'react-router-dom';
import Market from './Market';
import Solana_Adapter from './Crypto/solana_Addapter';
// Import any organization-specific modules here

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ensure this aligns with your organization's logout process
    localStorage.removeItem('token');
    navigate('/app/v1/user/login'); // Ensure this path is correct
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main className="dashboard-main">
        <Solana_Adapter />
        <Home />
        <NoPage />
        <Market />
        <Chat />
      </main>
    </div>
  );
};

export default Dashboard;