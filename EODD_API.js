const fetch = require('node-fetch');

const fetchExchangesList = async (apiToken) => {
    const url = `https://eodhd.com/api/real-time/AAPL.US?api_token=${apiToken}&fmt=json`;

    try {
        const response = await fetch(url);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

const apiToken = ' 6759801b8958c6.45217070';
fetchExchangesList(apiToken);
