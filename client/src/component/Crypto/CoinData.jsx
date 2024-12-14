import React, { useEffect, useState } from 'react';

const CoinData = () => {
    const [stats, setStats] = useState(null);
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const options = {
            headers: {
                'x-access-token': 'coinrankinged6f127f1e1f6f3ec8a1d06301524de8eb930dc6e01b184d',
            },
        };

        fetch('https://api.coinranking.com/v2/coins', options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((result) => {
                setStats(result.data.stats);
                setCoins(result.data.coins);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><div className="text-white text-xl">Loading...</div></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen"><div className="text-red-500 text-xl">Error: {error.message}</div></div>;
    }

    return (
        <div className="text-white flex flex-col items-center justify-center p-4 min-h-screen bg-gray-900">
            <h2 className="text-3xl font-bold mb-4">Cryptocurrency Prices</h2>
            <table className="table-auto w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Symbol</th>
                        <th className="px-4 py-2 text-left">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {coins.map((coin) => (
                        <tr key={coin.id} className="border-t border-gray-700">
                            <td className="px-4 py-2">{coin.name}</td>
                            <td className="px-4 py-2">{coin.symbol}</td>
                            <td className="px-4 py-2 text-green-400">{coin.price} $</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoinData;