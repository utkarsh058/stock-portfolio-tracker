import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Portfolio() {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchStocks = () => {
    axios.get('http://localhost:5000/api/stocks', authHeader)
      .then((response) => {
        setStocks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stocks:', error);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchStocks();
  }, []);

  const totalInvested = stocks.reduce((sum, s) => sum + (s.investedAmount || 0), 0);
  const totalCurrentValue = stocks.reduce((sum, s) => sum + (s.currentValue || 0), 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPercent = totalInvested ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : 0;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">My Portfolio</h1>
        <span className="text-gray-400 text-sm">{stocks.length} Stocks</span>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Value</p>
          <p className="text-xl font-bold mt-1 text-white">${totalCurrentValue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Investment</p>
          <p className="text-xl font-bold mt-1 text-white">${totalInvested.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total P&L</p>
          <p className={`text-xl font-bold mt-1 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${totalGainLoss.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">P&L %</p>
          <p className={`text-xl font-bold mt-1 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGainLossPercent}%
          </p>
        </div>
      </div>

      {/* Detailed Holdings Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 text-left">
            <tr>
              <th className="p-3">Stock</th>
              <th className="p-3">Shares</th>
              <th className="p-3">Avg. Price</th>
              <th className="p-3">Current Price</th>
              <th className="p-3">Invested</th>
              <th className="p-3">Current Value</th>
              <th className="p-3">P&L</th>
              <th className="p-3">P&L %</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No stocks yet. Add one from the Dashboard.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock._id} className="border-t border-gray-800">
                  <td className="p-3">
                    <div className="font-semibold text-white">{stock.symbol}</div>
                    <div className="text-gray-500 text-xs">{stock.companyName}</div>
                  </td>
                  <td className="p-3 text-white">{stock.quantity}</td>
                  <td className="p-3 text-white">${stock.buyPrice}</td>
                  <td className="p-3 text-white">${stock.currentPrice ?? 'N/A'}</td>
                  <td className="p-3 text-white">${stock.investedAmount?.toFixed(2)}</td>
                  <td className="p-3 text-white">${stock.currentValue?.toFixed(2)}</td>
                  <td className={`p-3 ${stock.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${stock.gainLoss}
                  </td>
                  <td className={`p-3 ${stock.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.gainLossPercent}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {stocks.length > 0 && (
            <tfoot>
              <tr className="border-t border-gray-700 bg-gray-800/50 font-semibold">
                <td className="p-3 text-white" colSpan="4">Total</td>
                <td className="p-3 text-white">${totalInvested.toFixed(2)}</td>
                <td className="p-3 text-white">${totalCurrentValue.toFixed(2)}</td>
                <td className={`p-3 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${totalGainLoss.toFixed(2)}
                </td>
                <td className={`p-3 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalGainLossPercent}%
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </Layout>
  );
}

export default Portfolio;