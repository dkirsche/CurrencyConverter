import React from 'react';
import './App.css';
import CurrencyConverter from './CurrencyConverter';
import UniswapConverter from './UniswapConverter';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>USD to EUR Currency Converter</h1>
        <CurrencyConverter />
        <UniswapConverter />
      </header>
    </div>
  );
}

export default App;
