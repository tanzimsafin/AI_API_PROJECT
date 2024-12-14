import React, { useState, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram } from "@solana/web3.js";

function AirDrop() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const LAMPORTS_PER_SOL = 1000000000;

  const [balance, setBalance] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const [recipient, setRecipient] = useState("");
  const sendAmountRef = useRef(null);

  useEffect(() => {
    if (wallet.connected) {
      setBalance(null); // Reset balance when wallet is connected
    }
  }, [wallet.connected]);

  async function fetchBalance() {
    if (!wallet.connected) {
      alert("Please connect your wallet!");
      return;
    }
    try {
      const balance = await connection.getBalance(wallet.publicKey);
      setBalance((balance / LAMPORTS_PER_SOL)); // Convert lamports to SOL
    } catch (error) {
      alert("Failed to fetch balance: " + error.message);
    }
  }

  function toggleBalance() {
    if (!showBalance) {
      fetchBalance();
    }
    setShowBalance(!showBalance);
  }

  async function sendTransaction() {
    const amount = parseFloat(sendAmountRef.current.value);
    const recipientAddress = recipient;
    if (!wallet.publicKey || !recipientAddress) {
      alert("Please connect your wallet and enter a recipient address!");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount to send!");
      return;
    }
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientAddress,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, {
        commitment: "finalized",
        preflightCommitment: "processed",
      });
      alert(`Transaction successful! Signature: ${signature}`);
      fetchBalance(); // Update balance after transaction
    } catch (error) {
      alert("Transaction failed: " + error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Crypto Transaction
        </h1>
        <div className="mb-6">
          <label
            htmlFor="sendAmount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Amount to Send (SOL)
          </label>
          <input
            ref={sendAmountRef}
            id="sendAmount"
            type="number"
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="recipient"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <button
          onClick={sendTransaction}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-300 mb-4"
          disabled={!wallet.connected}
        >
          Send Transaction
        </button>
        <button
          onClick={toggleBalance}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          disabled={!wallet.connected}
        >
          {showBalance ? "Hide Balance" : "Check Balance"}
        </button>
        {showBalance && balance !== null && (
          <p className="mt-4 text-gray-700 font-medium text-center">
            Your Balance: {balance} SOL
          </p>
        )}
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
