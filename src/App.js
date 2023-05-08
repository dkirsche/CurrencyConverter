//import CurrencyConverter from './CurrencyConverter';
//import fetchMarketExchangeRate from './MarketExchangeRate';
import React, { useState, useEffect } from 'react';
import './App.css';
import ConversionRatesTable from './ConversionRatesTable';
import axios from 'axios';

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
      try {
        const response = await axios.get('/api/conversionRates');
        setConversionRates(response.data);
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
      }
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
