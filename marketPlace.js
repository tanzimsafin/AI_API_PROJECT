
const url = "https://api.marketstack.com/v1/eod?access_key=55861594f77300106ad4a915495fa52e&symbols=AAPL";
const options = {
    method: "GET",
};
const fetchData = async () => {
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

fetchData();
