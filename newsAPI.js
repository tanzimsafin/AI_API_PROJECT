const options = {
  headers: {
    'x-access-token': 'coinrankinged6f127f1e1f6f3ec8a1d06301524de8eb930dc6e01b184d',
  },
};

fetch('https://api.coinranking.com/v2/coins', options)
  .then((response) => response.json())
  .then((result) => {
    console.log('Stats:', JSON.stringify(result.data.stats, null, 2));
    console.table(result.data.coins);
  })
  .catch((error) => console.error('Error:', error));
