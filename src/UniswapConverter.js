import React, { useState, useEffect } from 'react';
import { ChainId, Token, WETH, Route, TokenAmount, Fetcher, Trade, TradeType } from '@uniswap/sdk';
import { ethers } from 'ethers';
import axios from 'axios';

const UniswapConverter = () => {
  const [uniswapConversionRate, setUniswapConversionRate] = useState(null);
  const [uniswapGasFee, setUniswapGasFee] = useState(null);

  useEffect(() => {
    const fetchUniswapConversionRate = async () => {
      try {
        const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6);
        const EURS = new Token(ChainId.MAINNET, '0xdB25f211AB05b1c97D595516F45794528a807ad8', 2);

        const pair = await Fetcher.fetchPairData(USDC, EURS);
        const route = new Route([pair], USDC);
        const trade = new Trade(route, new TokenAmount(USDC, '1000000'), TradeType.EXACT_INPUT);
        setUniswapConversionRate(trade.executionPrice.toFixed(6));
      } catch (error) {
        console.error('Error fetching Uniswap conversion rate:', error);
      }
    };

    const estimateUniswapGasFee = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/c3211f935cc24cbaa35e33b66930e06d');
        const gasPrice = await provider.getGasPrice();
        const ethPriceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const ethPrice = ethPriceResponse.data.ethereum.usd;
        const estimatedGas = 21000; // Approximate gas usage for a Uniswap swap
        const gasFeeInETH = ethers.utils.formatEther(gasPrice.mul(estimatedGas));
        const gasFeeInUSD = (parseFloat(gasFeeInETH) * ethPrice).toFixed(2);
        setUniswapGasFee(gasFeeInUSD);
      } catch (error) {
        console.error('Error estimating Uniswap gas fee:', error);
      }
    };

    fetchUniswapConversionRate().then(() => {
      estimateUniswapGasFee();
    });
  }, []);

  return (
    <div>
      {uniswapConversionRate ? (
        <p>
          Uniswap: <strong>{uniswapConversionRate}</strong>
        </p>
      ) : (
        <p>Loading Uniswap conversion rate...</p>
      )}
      {uniswapGasFee ? (
        <p>
          Uniswap gas fee (USD): <strong>{uniswapGasFee}</strong>
        </p>
      ) : (
        <p>Loading Uniswap gas fee...</p>
      )}
    </div>
  );
};

export default UniswapConverter;
