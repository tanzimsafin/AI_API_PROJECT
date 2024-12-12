import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"

const cryptoDashboard = () => {
const [stockData, setStockData] = useState([]);
const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your WebSocket URL and API key
    const API_TOKEN = "demo"; // Replace with your actual API token
    const socketUrl = `wss://ws.eodhistoricaldata.com/ws/crypto?api_token=${API_TOKEN}`;

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established.");

      // Subscribe to specific stocks (AMZN, TSLA as example)
      const subscribeMessage = JSON.stringify({
        action: "subscribe",
        symbols: "ETH_USD", // Add more symbols if needed
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
      <h1 className="text-2xl font-bold text-center mb-4">Live Stock Market Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Symbol</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Change</th>
              <th className="border p-2 text-left">Volume</th>
              <th className="border p-2 text-left">Market Status</th>
              <th className="border p-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border p-2">{stock.symbol}</td>
                <td className="border p-2">
                  ${(stock.price || 0).toFixed(2)}
                </td>
                <td 
                  className={`border p-2 ${
                    (stock.change || 0) >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {(stock.change || 0).toFixed(2)}
                </td>
                <td className="border p-2">{stock.volume}</td>
                <td className="border p-2">{stock.marketStatus}</td>
                <td className="border p-2">
                  {new Date(stock.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default cryptoDashboard;