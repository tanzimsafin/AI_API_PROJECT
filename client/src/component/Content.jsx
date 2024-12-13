import React from "react";
import Chat from './Chat'
import StockDashboard from "./live-stock";
function Content(){
    return (
        <div className="flex justify-center m-4 p-4">
            <StockDashboard />
            <Chat />
            <div>
              
            </div>
            
        </div>
    )
}
export default Content;