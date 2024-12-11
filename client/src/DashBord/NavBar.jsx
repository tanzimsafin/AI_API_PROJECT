import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Content from '../DashBord/Content'
import Chat from '../component/Chat';
import Market from '../component/Market';
import Contact from '../component/Contact';
import NoPage from '../component/NoPage'; 
function NavBar() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Content/>} />
                    <Route path="app/v1/user/market" element={<Market />} />
                    <Route path="app/v1/user/chat" element={<Chat />} />
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
            <nav>
                <Link to="/">Home</Link> |
                <Link to="/app/v1/user/market">Market</Link> |
                <Link to="/app/v1/user/chat">Chat</Link> |
                <Link to="/app/v1/user/contact">Contact</Link>
            </nav>
            <Outlet />
        </div>
    );
}


export default NavBar;
