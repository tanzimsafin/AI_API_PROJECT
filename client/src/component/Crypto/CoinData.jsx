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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='text-white te flex flex-col items-center justify-center p-4'>
            <h2>Coins</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {coins.map((coin) => (
                        <tr key={coin.id}>
                            <td>{coin.name}</td>
                            <td>{coin.symbol}</td>
                            <td className='text-green-400'>{coin.price} $</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoinData;