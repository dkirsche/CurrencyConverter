const axios = require('axios');

const fetchApiConversionRate = async () => {
  try {
    const apiKey = '955e37c6ce9c4bf4af677720222e5738'; // Replace with your Open Exchange Rates API key
    const response = await axios.get(
      `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&base=USD&symbols=EUR`
    );
    const rate = response.data.rates.EUR * 1000;
    const gasFee = 20;
    const total = rate - gasFee;

    return {
      rate,
      gasFee,
      total,
    };
  } catch (error) {
    console.error('Error fetching Market exchange rate:', error);
    return null;
  }
};

module.exports = fetchApiConversionRate;
