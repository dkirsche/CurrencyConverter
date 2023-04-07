import React, { useState, useEffect } from 'react';
import axios from 'axios';
import curve from '@curvefi/api';

const CurrencyConverter = () => {
  const [apiConversionRate, setApiConversionRate] = useState(null);
  const [ethereumConversionRate, setEthereumConversionRate] = useState(null);
  const [polygonConversionRate, setPolygonConversionRate] = useState(null);

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

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        // Fetch Ethereum conversion rate
        await curve.init('Infura', { network: 'homestead', apiKey: 'c3211f935cc24cbaa35e33b66930e06d' }, { chainId: 1 });
        await curve.factory.fetchPools();
        await curve.cryptoFactory.fetchPools();
        const { output: ethOutput } = await curve.router.getBestRouteAndOutput('USDC', 'EURS', '1000');
        setEthereumConversionRate(ethOutput);

        // Fetch Polygon conversion rate
        await curve.init('Infura', { network: 'matic', apiKey: 'c3211f935cc24cbaa35e33b66930e06d' }, { chainId: 137 });
        await curve.factory.fetchPools();
        await curve.cryptoFactory.fetchPools();
        const { output: polyOutput } = await curve.router.getBestRouteAndOutput('USDC', '0xe111178a87a3bff0c8d18decba5798827539ae99', '1000');
        setPolygonConversionRate(polyOutput);
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
      }
    };

    fetchConversionRates();
  }, []);

  return (
    <div>
      {apiConversionRate ? (
        <p>
          Standard Markets: <strong>{apiConversionRate}</strong>
        </p>
      ) : (
        <p>Loading API conversion rate...</p>
      )}
      {ethereumConversionRate ? (
        <p>
          Ethereum: <strong>{ethereumConversionRate}</strong>
        </p>
      ) : (
        <p>Loading Ethereum conversion rate...</p>
      )}
      {polygonConversionRate ? (
        <p>
          Polygon: <strong>{polygonConversionRate}</strong>
        </p>
      ) : (
        <p>Loading Polygon conversion rate...</p>
      )}
    </div>
  );
};

export default CurrencyConverter;
