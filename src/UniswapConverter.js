import React, { useState, useEffect } from 'react';
import { ChainId, Token, WETH, Route, TokenAmount, Fetcher, Trade, TradeType } from '@uniswap/sdk';

const UniswapConverter = () => {
  // ...

  const [uniswapConversionRate, setUniswapConversionRate] = useState(null);

  // ...

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

    fetchUniswapConversionRate();
  }, []);

  return (
    <div>
      { /* ... */ }
      {uniswapConversionRate ? (
        <p>
          Uniswap: <strong>{uniswapConversionRate}</strong>
        </p>
      ) : (
        <p>Loading Uniswap conversion rate...</p>
      )}
    </div>
  );
};

export default UniswapConverter;
