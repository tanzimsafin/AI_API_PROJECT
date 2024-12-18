import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css"; 

function Market() {
  const [marketData, setMarketData] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) return;

    const fetchMarketData = async () => {
      setLoading(true);
      setError("");
      setMarketData([]);
      try {
        const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY || "XC7SUXSED0OP9KGF"; 
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data["Error Message"]) {
          throw new Error("Invalid stock symbol. Please try again.");
        }

        const timeSeries = data["Time Series (5min)"];
        if (timeSeries) {
          const top10Data = Object.keys(timeSeries)
            .slice(0, 10)
            .map((key) => ({
              time: key,
              ...timeSeries[key],
            }));
          setMarketData(top10Data);
        } else {
          throw new Error("No data available. Please try another symbol.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [symbol]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    if (inputValue.trim() === "") {
      setError("Stock symbol cannot be empty.");
      return;
    }
    setSymbol(inputValue.toUpperCase());
  };

  return (
    <div className="p-5 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-center text-blue-600">Welcome to Market</h1>
      <div className="mb-5 flex justify-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter stock symbol (e.g., TSLA)"
          className="p-2 text-lg mr-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          aria-label="Stock symbol input"
        />
        <button
          onClick={handleSearch}
          className="p-2 text-lg bg-blue-500 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search for stock data"
        >
          Search
        </button>
      </div>
      <div className="max-w-4xl mx-auto">
        {loading && <p className="text-center text-lg text-black">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {marketData.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-center text-blue-600">Market Data for {symbol}</h2>
            <ul className="list-none p-0">
              {marketData.map((entry, index) => (
                <li
                  key={index}
                  className="mb-2 p-4 border border-gray-300 rounded shadow-sm text-black"
                >
                  <strong>{entry.time}</strong>: Open: {entry["1. open"]}, High:{" "}
                  {entry["2. high"]}, Low: {entry["3. low"]}, Close:{" "}
                  {entry["4. close"]}, Volume: {entry["5. volume"]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Market;
