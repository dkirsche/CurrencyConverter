import React, { useState, useEffect } from 'react';
import { Token, CurrencyAmount, Percent,TradeType } from '@uniswap/sdk-core';
import { Protocol } from '@uniswap/router-sdk';
import { ChainId, AlphaRouter, SwapOptionsSwapRouter02, SwapType } from '@uniswap/smart-order-router';
import { ethers } from 'ethers';

const UniswapConverterPolygon = () => {
  const [uniswapConversionRate, setUniswapConversionRate] = useState(null);
  const [uniswapGasFee, setUniswapGasFee] = useState(null);

  useEffect(() => {
    const fetchUniswapConversionRate = async () => {
      try {
        const USDC = new Token(ChainId.POLYGON, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 6);
        const EURS = new Token(ChainId.POLYGON, '0xe111178a87a3bff0c8d18decba5798827539ae99', 2);
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/c3211f935cc24cbaa35e33b66930e06d');

        const router = new AlphaRouter({ chainId: ChainId.POLYGON, provider });

        const options: SwapOptionsSwapRouter02 = {
          recipient: '0x420ED47eA047F125cac67D0B7621C958444eD18A',
          slippageTolerance: new Percent(5, 1000),
          deadline: Math.floor(Date.now() / 1000 + 1800),
          type: SwapType.SWAP_ROUTER_02,
          protocols: [Protocol.V3],
        };

        const route = await router.route(
           CurrencyAmount.fromRawAmount(USDC, '1000000000'),
          EURS,
          TradeType.EXACT_INPUT
          ,
          options
        );
        
        setUniswapConversionRate(route.quote.toFixed(route.quote.currency.decimals));
        setUniswapGasFee(route.estimatedGasUsedUSD.toFixed(2));
      } catch (error) {
        console.error('Error fetching Uniswap conversion rate:', error);
      }
      
    };

    fetchUniswapConversionRate();
  }, []);


  return (
    <div>
      {uniswapConversionRate ? (
        <p>
          Uniswap (Polygon): <strong>{uniswapConversionRate}</strong>
        </p>
      ) : (
        <p>Loading Uniswap conversion rate...</p>
      )}
      {uniswapGasFee ? (
        <p>
          Uniswap (Polygon) gas fee (USD): <strong>{uniswapGasFee}</strong>
        </p>
      ) : (
        <p>Loading Uniswap gas fee...</p>
      )}
    </div>
  );
};

export default UniswapConverterPolygon;
