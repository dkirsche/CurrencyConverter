const { Token, CurrencyAmount, Percent, TradeType } = require('@uniswap/sdk-core');
const { Protocol } = require('@uniswap/router-sdk');
const { ChainId, AlphaRouter, SwapOptionsSwapRouter02, SwapType } = require('@uniswap/smart-order-router');
const ethers = require('ethers');

const fetchUniswapPolygonExhangeRate = async () => {
  try {
    const USDC = new Token(ChainId.POLYGON, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 6);
    const EURS = new Token(ChainId.POLYGON, '0xe111178a87a3bff0c8d18decba5798827539ae99', 2);
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/c3211f935cc24cbaa35e33b66930e06d');

    const router = new AlphaRouter({ chainId: ChainId.POLYGON, provider });

    const options = {
      recipient: '0x420ED47eA047F125cac67D0B7621C958444eD18A',
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

module.exports = fetchUniswapPolygonExhangeRate;

