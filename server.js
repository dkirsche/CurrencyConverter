const express = require('express');
const axios = require('axios');
const cache = require('memory-cache');
const path = require('path');
const fetchApiConversionRate = require('./src/OpenExchangeRate');
const { fetchCurveData, fetchCurvePolygonData } = require('./src/CurveConverter');
const UniswapConverter = require('./src/UniswapConverter');
const UniswapConverterPolygon = require('./src/UniswapConverterPolygon');

const app = express();
const PORT = process.env.PORT || 3001;
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

const fetchApiData = async () => {
  // Fetch data from all APIs and return combined results
  // Replace this with the actual API calls and data processing
  const marketData = await fetchApiConversionRate();
  const curveData = await fetchCurveData();
  const curvePolygonData = await fetchCurvePolygonData();
  const uniswapData = await UniswapConverter();
  const uniswapPolygonData = await UniswapConverterPolygon();

  return [
    { label: 'Conventional Market', ...marketData },
    { label: 'Curve.fi (Ethereum)', ...curveData },
    { label: 'Curve.fi (Polygon)', ...curvePolygonData },
    { label: 'Uniswap (Ethereum)', ...uniswapData },
    { label: 'Uniswap (Polygon)', ...uniswapPolygonData },
  ];
};
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, './build')));

app.get('/api/conversionRates', async (req, res) => {
  const cachedData = cache.get('conversionRates');

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const apiData = await fetchApiData();
    cache.put('conversionRates', apiData, CACHE_EXPIRY);
    res.json(apiData);
  } catch (error) {
    console.error('Error fetching API data:', error);
    res.status(500).json({ error: 'Error fetching API data' });
  }
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
