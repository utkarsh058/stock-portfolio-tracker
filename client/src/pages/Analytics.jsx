import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function Analytics() {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get('http://localhost:5000/api/stocks', authHeader)
      .then((response) => setStocks(response.data))
      .catch((error) => console.error('Error fetching stocks:', error));
  }, []);

  const totalInvested = stocks.reduce((sum, s) => sum + (s.investedAmount || 0), 0);
  const totalCurrentValue = stocks.reduce((sum, s) => sum + (s.currentValue || 0), 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalReturn = totalInvested ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : 0;

  const winners = stocks.filter((s) => s.gainLoss >= 0).length;
  const losers = stocks.filter((s) => s.gainLoss < 0).length;

  // Data for bar chart comparing invested vs current value per stock
  const chartData = stocks.map((s) => ({
    name: s.symbol,
    Invested: Number(s.investedAmount?.toFixed(2)) || 0,
    'Current Value': Number(s.currentValue?.toFixed(2)) || 0,
  }));

  const bestPerformer = stocks.length
    ? stocks.reduce((best, s) => (s.gainLossPercent > (best.gainLossPercent || -Infinity) ? s : best), stocks[0])
    : null;

  const worstPerformer = stocks.length
    ? stocks.reduce((worst, s) => (s.gainLossPercent < (worst.gainLossPercent || Infinity) ? s : worst), stocks[0])
    : null;

  return (
    <Layout>
      <h1 className="text-xl font-bold text-white mb-6">Analytics</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Return</p>
          <p className={`text-2xl font-bold mt-1 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalReturn}%
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Winning Stocks</p>
          <p className="text-2xl font-bold mt-1 text-green-400">{winners}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Losing Stocks</p>
          <p className="text-2xl font-bold mt-1 text-red-400">{losers}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Stocks</p>
          <p className="text-2xl font-bold mt-1 text-white">{stocks.length}</p>
        </div>
      </div>

      {/* Best/Worst performer */}
      {stocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-4 border border-green-600/40">
            <p className="text-gray-400 text-sm">🏆 Best Performer</p>
            <p className="text-xl font-bold mt-1 text-white">{bestPerformer.symbol}</p>
            <p className="text-green-400 text-sm">+{bestPerformer.gainLossPercent}%</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-red-600/40">
            <p className="text-gray-400 text-sm">📉 Worst Performer</p>
            <p className="text-xl font-bold mt-1 text-white">{worstPerformer.symbol}</p>
            <p className="text-red-400 text-sm">{worstPerformer.gainLossPercent}%</p>
          </div>
        </div>
      )}

      {/* Bar Chart: Invested vs Current Value per stock */}
      {stocks.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h2 className="text-lg font-semibold mb-3 text-white">Invested vs Current Value</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="Invested" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current Value" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Layout>
  );
}

export default Analytics;