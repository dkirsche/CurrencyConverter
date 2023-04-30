//import CurrencyConverter from './CurrencyConverter';
//import fetchMarketExchangeRate from './MarketExchangeRate';
import React, { useState, useEffect } from 'react';
import './App.css';
import fetchApiConversionRate from './OpenExchangeRate';
import {fetchCircleData,fetchCirclePolygonData} from './CircleConverter';
import UniswapConverter from './UniswapConverter';
import UniswapConverterPolygon from './UniswapConverterPolygon';
import ConversionRatesTable from './ConversionRatesTable';

function App() {
  const [conversionRates, setConversionRates] = useState([
    { label: 'Conventional Market', rate: 'Loading...', gasFee: 'Loading...', total: 'Loading...' },
    { label: 'Curve.fi (Ethereum)', rate: 'Loading...', gasFee: 'Loading...', total: 'Loading...' },
    { label: 'Curve.fi (Polygon)', rate: 'Loading...', gasFee: 'Loading...', total: 'Loading...' },
    { label: 'Uniswap (Ethereum)', rate: 'Loading...', gasFee: 'Loading...', total: 'Loading...' },
    { label: 'Uniswap (Polygon)', rate: 'Loading...', gasFee: 'Loading...', total: 'Loading...' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const marketData = await fetchApiConversionRate();
      const curveData = await fetchCircleData();
      const curvePolygonData = await fetchCirclePolygonData();
      const uniswapData = await UniswapConverter();
      const uniswapPolygonData = await UniswapConverterPolygon();

      setConversionRates(prevRates => prevRates.map((rate, index) => {
        const newData = [
          marketData,
          curveData,
          curvePolygonData,
          uniswapData,
          uniswapPolygonData
        ][index];

        return { ...rate, ...newData };
      }));
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <div className="nav-wrapper">
            <a href="/" className="brand-logo">Fluid Funds</a>
          </div>
        </nav>
        <div className="description-section">
          Simplifying Cross-Border Payments with Blockchain and AI
        </div>
        <h1>USD to EUR Currency Converter</h1>
        <ConversionRatesTable rates={conversionRates} />
      </header>
    </div>
  );
}

export default App;
