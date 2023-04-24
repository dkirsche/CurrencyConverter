import React from 'react';

const ConversionRatesTable = ({ rates }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Label</th>
          <th>Rate</th>
          <th>Gas Fee</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {rates.map((rateData, index) => (
          <tr key={index}>
            <td>{rateData.label}</td>
            <td>{rateData.rate || 'Loading...'}</td>
            <td>{rateData.gasFee || 'Loading...'}</td>
            <td>{rateData.total || 'Loading...'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConversionRatesTable;
