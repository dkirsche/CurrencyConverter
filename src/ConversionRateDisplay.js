import React from 'react';
import './ConversionRateDisplay.css';

const ConversionRateDisplay = ({ rate, gasFee, label }) => {
  const total = rate && gasFee ? (parseFloat(rate) - parseFloat(gasFee)).toFixed(2) : null;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Rate</th>
            <th>Gas Fee</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{label}</td>
            <td>{rate || 'Loading...'}</td>
            <td>{gasFee || 'Loading...'}</td>
            <td>{total || 'Loading...'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ConversionRateDisplay;
