import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const StockDashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your WebSocket URL and API key
    const API_TOKEN = "demo"; // Replace with your actual API token
    const socketUrl = `wss://ws.eodhistoricaldata.com/ws/us?api_token=${API_TOKEN}`;

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established.");

      // Subscribe to specific stocks (AMZN, TSLA as example)
      const subscribeMessage = JSON.stringify({
        action: "subscribe",
        symbols: "AAPL,TSLA", // Add more symbols if needed
      });
      socket.send(subscribeMessage);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);

        // Defensive data mapping with default values
        const mappedData = {
          symbol: data.s || 'N/A',
          price: data.p || 0,
          change: Array.isArray(data.c) ? data.c[0] || 0 : 0,
          volume: data.v || 0,
          marketStatus: data.ms || "unknown",
          timestamp: data.t || Date.now(),
          disabled: data.dp || false
        };

        setStockData((prevData) => {
          // Ensure only unique symbols are kept (prevent duplicates)
          const filteredData = prevData.filter(
            (stock) => stock.symbol !== mappedData.symbol
          );
          return [mappedData, ...filteredData].slice(0, 10); // Keep latest 10 records
        });
      } catch (err) {
        console.error("Error parsing WebSocket data:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Failed to fetch live data. Please try again later.");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => socket.close(); // Cleanup on unmount
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Live Stock Market Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-striped table-bordered table-sm w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border p-2">Symbol</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Change</th>
              <th className="border p-2">Volume</th>
              <th className="border p-2">Market Status</th>
              <th className="border p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border p-2 bg-black text-white">{stock.symbol}</td>
                <td className="border p-2 bg-black text-white">
                  ${(stock.price || 0).toFixed(2)}
                </td>
                <td 
                  className="border p-2 bg-black text-white">
                  {(stock.change || 0).toFixed(2)}
                </td>
                <td className="border p-2 bg-black text-white">{stock.volume}</td>
                <td className="border p-2 bg-black text-white">{stock.marketStatus}</td>
                <td className="border p-2 bg-black text-white">
                  {/* Format timestamp to a shorter form */}
                  {new Date(stock.timestamp).toLocaleDateString()}{" "}
                  {new Date(stock.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockDashboard;
