const axios = require('axios');
const ethers = require('ethers');
const curve = require('@curvefi/api');

const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const EURS = '0xdB25f211AB05b1c97D595516F45794528a807ad8';

const fetchCurveData = async () => {
  try {
    // Fetch Ethereum conversion rate
    await curve.default.init('Infura', { network: 'homestead', apiKey: process.env.INFURA_API_KEY }, { chainId: 1 });
    await curve.default.factory.fetchPools();
    await curve.default.cryptoFactory.fetchPools();
    const { output: ethOutput } = await curve.default.router.getBestRouteAndOutput(USDC, EURS, '1000');
    const ethereumConversionRate = ethOutput.toString();

    // Estimate swap gas fee for Curve on Ethereum
    const ethPriceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const ethPrice = ethPriceResponse.data.ethereum.usd;
    const gasUnits = 200000;
    const gasPrice = await new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/c3211f935cc24cbaa35e33b66930e06d').getGasPrice();
    const gasFeeInETH = ethers.utils.formatEther(gasPrice.mul(gasUnits));
    const estimatedSwapGasFee = (parseFloat(gasFeeInETH) * ethPrice).toFixed(2);

    const total = parseFloat(ethereumConversionRate) - parseFloat(estimatedSwapGasFee);

    return {
      rate: ethereumConversionRate,
      gasFee: estimatedSwapGasFee,
      total,
    };
  } catch (error) {
    console.error('Error fetching Curve conversion data:', error);
    return null;
  }
};
const fetchCurvePolygonData = async () => {
    try {
      // Fetch Ethereum conversion rate
      await curve.default.init('Infura', { network: 'matic', apiKey: process.env.INFURA_API_KEY }, { chainId: 137 });
      await curve.default.factory.fetchPools();
      await curve.default.cryptoFactory.fetchPools();
      const { output: polyOutput } = await curve.default.router.getBestRouteAndOutput('USDC', '0xe111178a87a3bff0c8d18decba5798827539ae99', '1000');
      const polyConversionRate = polyOutput.toString();
      const estimatedSwapGasFee = 0.04;
  
      
      const total = parseFloat(polyConversionRate) - parseFloat(estimatedSwapGasFee);
  
      return {
        rate: polyConversionRate,
        gasFee: estimatedSwapGasFee,
        total,
      };
    } catch (error) {
      console.error('Error fetching Curve on Polygon conversion data:', error);
      return null;
    }
  };

  module.exports = {
    fetchCurveData,
    fetchCurvePolygonData,
  };
