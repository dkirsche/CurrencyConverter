import React from 'react';
import './App.css';
import CurrencyConverter from './CurrencyConverter';
import UniswapConverter from './UniswapConverter';
import UniswapConverterPolygon from './UniswapConverterPolygon';

function App() {
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
        <CurrencyConverter />
        <UniswapConverter />
        <UniswapConverterPolygon />
      </header>
    </div>
  );
}

export default App;
