import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

function AirDrop() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const LAMPORTS_PER_SOL = 1000000000;

  async function requestAirdrop() {
    const amount = document.getElementById("amount").value;
    if (!wallet.publicKey) {
      alert("Please connect your wallet!");
      return;
    }
    try {
      await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
      alert(`${amount} SOL has been sent to address ${wallet.publicKey.toBase58()}`);
    } catch (error) {
      alert("Airdrop failed: " + error.message);
    }
  }

  async function getBalance() {
    if (!wallet.connected) {
      alert("Please connect your wallet!");
      return;
    }
    try {
      const balance = await connection.getBalance(wallet.publicKey);
      alert(`Your Balance Is ${(balance / LAMPORTS_PER_SOL).toFixed(2)} SOL`);
    } catch (error) {
      alert("Failed to fetch balance: " + error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Solana Airdrop Tool
        </h1>
        <div className="mb-6">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Amount (SOL)
          </label>
          <input
            id="amount"
            type="number"
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={requestAirdrop}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-4"
          disabled={!wallet.connected}
        >
          Request Airdrop
        </button>
        <button
          onClick={getBalance}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-300"
          disabled={!wallet.connected}
        >
          Get Balance
        </button>
        {!wallet.connected && (
          <p className="mt-6 text-red-600 text-sm font-medium text-center">
            Please connect your wallet to use the tools.
          </p>
        )}
      </div>
    </div>
  );
}

export default AirDrop;
