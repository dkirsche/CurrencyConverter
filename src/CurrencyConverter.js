import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = () => {
  const [conversionRate, setConversionRate] = useState(null);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await axios.get(
          'https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=EUR',
          {
            headers: {
              apikey: 'kD4OKiM7Ps2UQ6rYaVNONAZtFKZbTBXn',
            },
          }
        );
        setConversionRate(response.data.rates.EUR);
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    fetchConversionRate();
  }, []);

  return (
    <div>
      {conversionRate ? (
        <p>
          Current conversion rate (USD to EUR): <strong>{conversionRate}</strong>
        </p>
      ) : (
        <p>Loading conversion rate...</p>
      )}
    </div>
  );
};

export default CurrencyConverter;
