import React from 'react';
import './App.css';
import CurrencyConverter from './CurrencyConverter';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>USD to EUR Currency Converter</h1>
        <CurrencyConverter />
      </header>
    </div>
  );
}

export default App;
