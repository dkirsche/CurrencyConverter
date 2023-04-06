import React, { useState, useEffect } from 'react';
import axios from 'axios';
import curve from '@curvefi/api';

const CurrencyConverter = () => {
  const [conversionRate, setConversionRate] = useState(null);
  const [expectedRate, setExpectedRate] = useState(null);
  const [gasFee, setGasFee] = useState(null);

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

    const fetchExpectedRateAndGasFee = async () => {
      try {
        await curve.init('Infura', { network: 'homestead', apiKey: 'c3211f935cc24cbaa35e33b66930e06d' }, { chainId: 1 });
        await curve.factory.fetchPools();
        await curve.cryptoFactory.fetchPools();
        
        const gas = await curve.router.estimateGas.swap('USDC', 'EURS', '1000');
        const { output } = await curve.router.getBestRouteAndOutput('USDC', 'EURS', '1000');
        
        console.log(gas)
        setExpectedRate(output);
        setGasFee(gas);
      } catch (error) {
        console.error('Error fetching expected rate and gas fee:', error);
      }
    };

    fetchConversionRate();
    fetchExpectedRateAndGasFee();
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
      {expectedRate ? (
        <p>
          Expected conversion rate from Curve (USDC to EURS): <strong>{expectedRate}</strong>
        </p>
      ) : (
        <p>Loading expected rate...</p>
      )}
      {gasFee!== null ? (
        <p>
          Gas fee for the swap (USDC to EURS): <strong>{gasFee.toString()}</strong>
        </p>
      ) : (
        <p>Loading gas fee...</p>
      )}
    </div>
  );
};

export default CurrencyConverter;
