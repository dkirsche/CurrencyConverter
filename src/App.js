import React, { useState, useEffect } from 'react';
import './App.css';
//import CurrencyConverter from './CurrencyConverter';
//import fetchMarketExchangeRate from './MarketExchangeRate';
import fetchApiConversionRate from './OpenExchangeRate';
import {fetchCircleData,fetchCirclePolygonData} from './CircleConverter';
import UniswapConverter from './UniswapConverter';
import UniswapConverterPolygon from './UniswapConverterPolygon';
import ConversionRatesTable from './ConversionRatesTable';

function App() {
  const [conversionRates, setConversionRates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      //const currencyData = await CurrencyConverter();
      const marketData = await fetchApiConversionRate();
      const curveData = await fetchCircleData();
      const curvePolygonData = await fetchCirclePolygonData();
      const uniswapData = await UniswapConverter();
      const uniswapPolygonData = await UniswapConverterPolygon();

      setConversionRates([
        //{ label: 'Currency Converter', ...currencyData },
        { label: 'Conventional Market', ...marketData },
        { label: 'Curve.fi (Ethereum)', ...curveData },
        { label: 'Curve.fi (Polygon)', ...curvePolygonData },
        { label: 'Uniswap (Ethereum)', ...uniswapData },
        { label: 'Uniswap (Polygon)', ...uniswapPolygonData },
      ]);
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
