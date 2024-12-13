import React from "react";
import Chat from './Chat';
import StockDashboard from "./live-stock";

function Home(){
    return (
        <div>
            <StockDashboard />
            <Chat />
            Home
        </div>
    )
}
export default Home;