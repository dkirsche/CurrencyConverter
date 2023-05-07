const { Token, CurrencyAmount, Percent, TradeType } = require('@uniswap/sdk-core');
const { Protocol } = require('@uniswap/router-sdk');
const { ChainId, AlphaRouter, SwapOptionsSwapRouter02, SwapType } = require('@uniswap/smart-order-router');
const ethers = require('ethers');

const fetchUniswapData = async () => {
  try {
    const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6);
    const EURS = new Token(ChainId.MAINNET, '0xdB25f211AB05b1c97D595516F45794528a807ad8', 2);
    const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

    const router = new AlphaRouter({ chainId: ChainId.MAINNET, provider });

    const options = {
      recipient: `${process.env.WALLET_ID}`,
      slippageTolerance: new Percent(5, 1000),
      deadline: Math.floor(Date.now() / 1000 + 1800),
      type: SwapType.SWAP_ROUTER_02,
      protocols: [Protocol.V3],
    };

    const route = await router.route(
      CurrencyAmount.fromRawAmount(USDC, '1000000000'),
      EURS,
      TradeType.EXACT_INPUT,
      options
    );

    const rate = route.quote.toFixed(route.quote.currency.decimals);
    const gasFee = route.estimatedGasUsedUSD.toFixed(2);
    const total = parseFloat(rate) - parseFloat(gasFee);

    return {
      rate,
      gasFee,
      total,
    };
  } catch (error) {
    console.error('Error fetching Uniswap conversion rate:', error);
    return null;
  }
};

module.exports = fetchUniswapData;
