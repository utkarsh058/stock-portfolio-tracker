const axios = require('axios');

const getIndices = async (req, res) => {
  try {
    const symbols = [
      { name: 'NIFTY 50', symbol: '%5ENSEI' },
      { name: 'BANK NIFTY', symbol: '%5ENSEBANK' },
    ];

    const results = await Promise.all(
      symbols.map(async (index) => {
        try {
          const response = await axios.get(
            `https://query1.finance.yahoo.com/v8/finance/chart/${index.symbol}`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
          );

          const meta = response.data.chart.result[0].meta;
          const price = meta.regularMarketPrice;
          const prevClose = meta.previousClose || meta.chartPreviousClose;
          const change = Number((price - prevClose).toFixed(2));
          const changePercent = Number(((change / prevClose) * 100).toFixed(2));

          return { name: index.name, price, change, changePercent };
        } catch (err) {
          // TEMPORARY: log the real error to terminal for debugging
          console.log(`Error fetching ${index.name}:`, err.message);
          return { name: index.name, price: null, change: null, changePercent: null };
        }
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getIndices };