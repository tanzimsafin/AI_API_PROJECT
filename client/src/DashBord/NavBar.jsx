import React from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import Content from "../component/Content";

import Market from "../component/Market";
import NoPage from "../component/NoPage";
import SignForm from "../component/signup";
import LoginForm from "../component/Login";
import Solana_Adapter from "../component/Crypto/solana_Addapter";
import NewsBlog from "../component/news_Blog";

function NavBar() {
  return (
    <BrowserRouter>
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554260570-e9689a3418b8?q=80&w=1782&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Content />} />
            <Route path="app/v1/user/signup" element={<SignForm />} />
            <Route path="app/v1/user/login" element={<LoginForm />} />
            <Route path="*" element={<NoPage />} />
            <Route path="app/v1/user/market" element={<Market />} />
            <Route path="app/v1/user/crypto" element={<Solana_Adapter />} />
            <Route path="app/v1/user/news" element={<NewsBlog />} />
          </Route>
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <nav
        className="flex justify-between items-center p-4 text-slate-300"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Left Section: Home and Market */}
        <div className="flex items-center gap-8">
          <Link
            className="text-lg font-semibold px-4 py-2 rounded hover:bg-blue-400 hover:text-white transition-all"
            style={{ textDecoration: "none" }}
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-lg font-semibold px-4 py-2 rounded hover:bg-blue-400 hover:text-white transition-all"
            style={{ textDecoration: "none" }}
            to="/app/v1/user/market"
          >
            Market
          </Link>
          <Link
            className="text-lg font-semibold px-4 py-2 rounded hover:bg-blue-400 hover:text-white transition-all"
            style={{ textDecoration: "none" }}
            to="/app/v1/user/crypto"
          >
            Crypto
          </Link>
          <Link
            className="text-lg font-semibold px-4 py-2 rounded hover:bg-blue-400 hover:text-white transition-all"
            style={{ textDecoration: "none" }}
            to="/app/v1/user/news"
          >
            Finance News
          </Link>
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
              className="px-4 py-2 w-72 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring focus:ring-blue-500 shadow-md"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
            >
              Enter
            </button>
          </form>
        </div>

        {/* Right Section: Sign Up and Log In */}
        <div className="flex items-center gap-8">
          <Link
            className="text-lg font-semibold px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-all"
            style={{ textDecoration: "none" }}
            to="/app/v1/user/signup"
          >
            Sign up
          </Link>
          <Link
            className="text-lg font-semibold px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-all"
            style={{ textDecoration: "none" }}
            to="/app/v1/user/login"
          >
            Log in
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;
