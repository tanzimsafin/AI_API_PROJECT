import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import Content from "../component/Content";
import Chat from "../component/Chat";
import Market from "../component/Market";
import Contact from "../component/Contact";
import NoPage from "../component/NoPage";
import SignForm from "../component/signup";
import LoginForm from "../component/Login";

function NavBar() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Content />} />
          <Route path="app/v1/user/market" element={<Market />} />
          <Route path="app/v1/user/signup" element={<SignForm />} />
          <Route path="app/v1/user/chat" element={<Chat/>} />
          <Route path="app/v1/user/login" element={<LoginForm />} />
          <Route path="app/v1/user/contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <nav className="flex justify-around gap-10 p-3 font-serif text-xl bg-blue-600 text-slate-300">
        <Link className="text-2xl font-bold" to="/">Home</Link> 
        <Link to="/app/v1/user/market">Market</Link>
        <Link to="/app/v1/user/signup">Sign up</Link>
        <Link to="/app/v1/user/login">Log in</Link>
        <Link to="/app/v1/user/chat">Chat</Link> 
        <Link to="/app/v1/user/contact">Contact</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;
