import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from "react-router-dom";
import Content from "../component/Content";
import Market from "../component/Market";
import NoPage from "../component/NoPage";
import SignForm from "../component/signup";
import LoginForm from "../component/Login";
import Solana_Adapter from "../component/Crypto/solana_Addapter";
import NewsBlog from "../component/news_Blog";

// Add a new Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/app/v1/user/login" replace />;
  }
  
  return children;
};

function NavBar() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme !== 'light';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token on initial load and set login status
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Theme logic
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div
        className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
        style={{
          backgroundImage: isDarkMode 
            ? "none" 
            : "url('https://images.unsplash.com/photo-1554260570-e9689a3418b8?q=80&w=1782&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout 
                isDarkMode={isDarkMode} 
                toggleTheme={toggleTheme}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
              />
            }
          >
            <Route index element={<Content />} />
            <Route path="app/v1/user/signup" element={<SignForm />} />
            <Route 
              path="app/v1/user/login" 
              element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} 
            />
            <Route path="*" element={<NoPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="app/v1/user/market" 
              element={
                <ProtectedRoute>
                  <Market />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="app/v1/user/crypto" 
              element={
                <ProtectedRoute>
                  <Solana_Adapter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="app/v1/user/news" 
              element={
                <ProtectedRoute>
                  <NewsBlog />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Layout({ isDarkMode, toggleTheme, isLoggedIn, handleLogout }) {
  return (
    <div>
      <nav
        className={`flex justify-between items-center p-4 ${
          isDarkMode 
            ? 'bg-black/80 text-slate-300' 
            : 'bg-white/80 text-black shadow-md'
        }`}
      >
        {/* Left Section: Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            className={`text-lg font-semibold px-4 py-2 rounded ${
              isDarkMode
                ? 'hover:bg-blue-400 hover:text-white'
                : 'hover:bg-blue-500 hover:text-white'
            } transition-all`}
            style={{ textDecoration: "none" }}
            to="/"
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                className={`text-lg font-semibold px-4 py-2 rounded ${
                  isDarkMode
                    ? 'hover:bg-blue-400 hover:text-white'
                    : 'hover:bg-blue-500 hover:text-white'
                } transition-all`}
                style={{ textDecoration: "none" }}
                to="/app/v1/user/market"
              >
                Market
              </Link>
              <Link
                className={`text-lg font-semibold px-4 py-2 rounded ${
                  isDarkMode
                    ? 'hover:bg-blue-400 hover:text-white'
                    : 'hover:bg-blue-500 hover:text-white'
                } transition-all`}
                style={{ textDecoration: "none" }}
                to="/app/v1/user/crypto"
              >
                Crypto
              </Link>
              <Link
                className={`text-lg font-semibold px-4 py-2 rounded ${
                  isDarkMode
                    ? 'hover:bg-blue-400 hover:text-white'
                    : 'hover:bg-blue-500 hover:text-white'
                } transition-all`}
                style={{ textDecoration: "none" }}
                to="/app/v1/user/news"
              >
                Finance News
              </Link>
              <Link
                className={`text-lg font-semibold px-4 py-2 rounded ${
                  isDarkMode
                    ? 'hover:bg-blue-400 hover:text-white'
                    : 'hover:bg-blue-500 hover:text-white'
                } transition-all`}
                style={{ textDecoration: "none" }}
                to="/app/v1/user/profile"
              >
                Profile
              </Link>
            </>
          )}
        </div>
        
        {/* Middle Section: Search Bar */}
        <div className="flex-grow flex justify-center">
          <form
            className="flex items-center gap-2 w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Search markets"
              className={`px-4 py-2 w-72 rounded-lg ${
                isDarkMode 
                  ? 'bg-slate-700 text-white focus:ring-blue-500' 
                  : 'bg-gray-100 text-black focus:ring-blue-300'
              } focus:outline-none focus:ring shadow-md`}
            />
            <button
              type="submit"
              className={`px-3 py-2 rounded-lg shadow-md ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Enter
            </button>
          </form>
        </div>

        {/* Right Section: Theme Toggle, Auth Buttons */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Emoji Button */}
          <button 
            className="text-2xl focus:outline-none transition-transform transform hover:scale-110"
            onClick={toggleTheme}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          {/* Conditional Rendering for Auth Buttons */}
          {!isLoggedIn ? (
            <>
              <Link
                className={`text-lg font-semibold px-4 py-2 rounded ${
                  isDarkMode
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-green-500 text-white hover:bg-green-600'
                } transition-all`}
                style={{ textDecoration: "none" }}
                to="/app/v1/user/signup"
              >
                Sign up
              </Link>
              <Link
                className={`text-lg font-semibold px-4 py-2 rounded ${
                  isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-all`}
                style={{ textDecoration: "none" }}
                to="/app/v1/user/login"
              >
                Log in
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className={`text-lg font-semibold px-4 py-2 rounded ${
                isDarkMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
              } transition-all`}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;
