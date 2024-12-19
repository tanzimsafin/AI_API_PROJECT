import React, { useEffect, useState } from 'react';

const CoinData = () => {
    const [stats, setStats] = useState(null);
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [emailSending, setEmailSending] = useState(false);

    // Fetch cryptocurrency data
    useEffect(() => {
        const fetchCoins = async () => {
            const options = {
                headers: {
                    'x-access-token': 'coinrankinged6f127f1e1f6f3ec8a1d06301524de8eb930dc6e01b184d',
                },
            };

            try {
                const response = await fetch('https://api.coinranking.com/v2/coins', options);
                if (!response.ok) throw new Error('Failed to fetch cryptocurrency data.');

                const result = await response.json();
                setStats(result.data.stats);
                setCoins(result.data.coins);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCoins();
    }, []);

    // Send top cryptocurrency details via email
    const handleSendEmail = async () => {
        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }

        if (coins.length === 0) {
            alert('No coin data is available.');
            return;
        }

        setEmailSending(true);

        const topCoin = coins.reduce((prev, current) => (parseFloat(prev.price) > parseFloat(current.price) ? prev : current));
        const emailContent = `
            The cryptocurrency with the highest price is ${topCoin.name} (${topCoin.symbol}).
            Current price: ${topCoin.price} USD.
        `;

        try {
            const response = await fetch('http://localhost:5000/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: 'Top Cryptocurrency Price',
                    to: email,
                    body: emailContent,
                    from: 'iftekharul840@gmail.com',
                    appPassword: 'vpxw cxjr trer ybtp',
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Email sent successfully!');
            } else {
                throw new Error(result.message || 'Failed to send the email.');
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setEmailSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="text-white flex flex-col items-center justify-center p-4 min-h-screen bg-gray-900">
            <h2 className="text-3xl font-bold mb-6">Cryptocurrency Prices</h2>

            {/* Email Input */}
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 px-4 py-2 w-full max-w-md text-gray-900 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Send Email Button */}
            <button
                onClick={handleSendEmail}
                disabled={emailSending}
                className={`mb-6 px-6 py-2 ${emailSending ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition duration-200`}
            >
                {emailSending ? 'Sending...' : 'Send Top Crypto Price to My Email'}
            </button>

            {/* Cryptocurrency Table */}
            <table className="table-auto w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Symbol</th>
                        <th className="px-4 py-2 text-left">Price (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {coins.map((coin) => (
                        <tr key={coin.id} className="border-t border-gray-700 hover:bg-gray-600">
                            <td className="px-4 py-2">{coin.name}</td>
                            <td className="px-4 py-2">{coin.symbol}</td>
                            <td className="px-4 py-2 text-green-400">${parseFloat(coin.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoinData;
