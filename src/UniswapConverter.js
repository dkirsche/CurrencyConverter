import React, { useState, useEffect } from 'react';
import { Token, CurrencyAmount, Percent,TradeType } from '@uniswap/sdk-core';
import { Protocol } from '@uniswap/router-sdk';
import { ChainId, AlphaRouter, SwapOptionsSwapRouter02, SwapType } from '@uniswap/smart-order-router';
import { ethers } from 'ethers';

const UniswapConverter = () => {
  const [uniswapConversionRate, setUniswapConversionRate] = useState(null);
  const [uniswapGasFee, setUniswapGasFee] = useState(null);

  useEffect(() => {
    const fetchUniswapConversionRate = async () => {
      try {
        const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6);
        const EURS = new Token(ChainId.MAINNET, '0xdB25f211AB05b1c97D595516F45794528a807ad8', 2);
        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/c3211f935cc24cbaa35e33b66930e06d');

        const router = new AlphaRouter({ chainId: ChainId.MAINNET, provider });

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
/*
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

    */
    fetchUniswapConversionRate();
  }, []);


  return (
    <div>
      {uniswapConversionRate ? (
        <p>
          Uniswap (Ethereum): <strong>{uniswapConversionRate}</strong>
        </p>
      ) : (
        <p>Loading Uniswap (Ethereum) ...</p>
      )}
      {uniswapGasFee ? (
        <p>
          gas fee (USD): <strong>{uniswapGasFee}</strong>
        </p>
      ) : (
        <p>Loading gas fee...</p>
      )}
    </div>
  );
};

export default UniswapConverter;
