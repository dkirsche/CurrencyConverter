import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversionRateDisplay from './ConversionRateDisplay';

const CurrencyConverter = () => {
  const [apiConversionRate, setApiConversionRate] = useState(null);
  
  


  useEffect(() => {
    const fetchApiConversionRate = async () => {
      try {
        const response = await axios.get(
          'https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=EUR',
          {
            headers: {
              apikey: 'kD4OKiM7Ps2UQ6rYaVNONAZtFKZbTBXn',
            },
          }
        );
        setApiConversionRate(response.data.rates.EUR);
      } catch (error) {
        console.error('Error fetching API conversion rate:', error);
      }
    };
    fetchApiConversionRate();
  }, []);


  return (
    <div>
      <ConversionRateDisplay
      rate={apiConversionRate}
      gasFee={20}
      label="Standard Market"
    />
      <ConversionRateDisplay
      rate={ethereumConversionRate}
      gasFee={estimatedSwapGasFee}
      label="Circle.fi (Ethereum)"
    />
      <ConversionRateDisplay
      rate={polygonConversionRate}
      gasFee={0.04}
      label="Circle.fi (Polygon)"
    />
    </div>
  );
};

export default CurrencyConverter;
