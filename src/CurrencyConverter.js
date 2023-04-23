import React, { useState, useEffect } from 'react';
import axios from 'axios';
import curve from '@curvefi/api';
import { ethers } from 'ethers';

const CurrencyConverter = () => {
  const [apiConversionRate, setApiConversionRate] = useState(null);
  const [ethereumConversionRate, setEthereumConversionRate] = useState(null);
  const [polygonConversionRate, setPolygonConversionRate] = useState(null);
  const [estimatedSwapGasFee, setEstimatedSwapGasFee] = useState(null);

  const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const EURS = '0xdB25f211AB05b1c97D595516F45794528a807ad8';

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
    //estimating swap fees for Curve on Ethereum. This is a rough estimate because the curve.router.estimateGas.swap() method requires wallet approval to work.
    const estimateSwapGasFee = async () => {
      try {
        const ethPriceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const ethPrice = ethPriceResponse.data.ethereum.usd;
        const gasUnits = 200000;
        const gasPrice = await new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/c3211f935cc24cbaa35e33b66930e06d').getGasPrice();
        const gasFeeInETH = ethers.utils.formatEther(gasPrice.mul(gasUnits));
        const gasFeeInUSD = (parseFloat(gasFeeInETH) * ethPrice).toFixed(2);
        setEstimatedSwapGasFee(gasFeeInUSD);
      } catch (error) {
        console.error('Error estimating swap gas fee:', error);
      }
    };

    fetchApiConversionRate();
    estimateSwapGasFee();
  }, []);

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        // Fetch Ethereum conversion rate
        await curve.init('Infura', { network: 'homestead', apiKey: 'c3211f935cc24cbaa35e33b66930e06d' }, { chainId: 1 });
        await curve.factory.fetchPools();
        await curve.cryptoFactory.fetchPools();
        const {  route, output  } = await curve.router.getBestRouteAndOutput(USDC, EURS, '1000');
        console.log('route:', route.length);
        setEthereumConversionRate(output.toString());

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
        <p>Loading Standard Markets...</p>
      )}
      {ethereumConversionRate ? (
        <p>
          Circle.fi (Ethereum): <strong>{ethereumConversionRate}</strong>
        </p>
      ) : (
        <p>Loading Circle.fi (Ethereum)...</p>
      )}
      {estimatedSwapGasFee ? (
        <p>
          gas fee (USD): <strong>{estimatedSwapGasFee}</strong>
        </p>
      ) : (
        <p>Loading gas fee...</p>
      )}
      {polygonConversionRate ? (
        <p>
          Circle.fi (Polygon): <strong>{polygonConversionRate}</strong>
        </p>
      ) : (
        <p>Loading Circle.fi (Polygon)...</p>
      )}
    </div>
  );
};

export default CurrencyConverter;
