import axios from 'axios';

const fetchMarketExchangeRate = async () => {
  try {
    const response = await axios.get(
      'https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=EUR',
      {
        headers: {
          apikey: 'kD4OKiM7Ps2UQ6rYaVNONAZtFKZbTBXn',
        },
      }
    );
    const rate = response.data.rates.EUR;
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

export default fetchMarketExchangeRate;
