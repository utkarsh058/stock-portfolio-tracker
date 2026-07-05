import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  PieChart, Pie, Cell, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [history, setHistory] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
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

  const fetchHistory = () => {
    axios.get('http://localhost:5000/api/snapshots', authHeader)
      .then((response) => {
        const formatted = response.data.map((snap) => ({
          date: snap.date.slice(5),
          value: Number(snap.totalValue.toFixed(2)),
        }));
        setHistory(formatted);
      })
      .catch((error) => {
        console.error('Error fetching history:', error);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchStocks();
    fetchHistory();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newStock = {
      symbol,
      companyName,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
    };

    axios.post('http://localhost:5000/api/stocks', newStock, authHeader)
      .then(() => {
        fetchStocks();
        setSymbol('');
        setCompanyName('');
        setQuantity('');
        setBuyPrice('');
      })
      .catch((error) => {
        console.error('Error adding stock:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/stocks/${id}`, authHeader)
      .then(() => {
        fetchStocks();
      })
      .catch((error) => {
        console.error('Error deleting stock:', error);
      });
  };

  const totalInvested = stocks.reduce((sum, s) => sum + (s.investedAmount || 0), 0);
  const totalCurrentValue = stocks.reduce((sum, s) => sum + (s.currentValue || 0), 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPercent = totalInvested ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : 0;

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4'];
  const pieData = stocks.map((stock) => ({
    name: stock.symbol,
    value: stock.currentValue || 0,
  }));

  return (
    <Layout>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Invested</p>
          <p className="text-2xl font-bold mt-1 text-white">${totalInvested.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Current Value</p>
          <p className="text-2xl font-bold mt-1 text-white">${totalCurrentValue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Gain/Loss</p>
          <p className={`text-2xl font-bold mt-1 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${totalGainLoss.toFixed(2)} ({totalGainLossPercent}%)
          </p>
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      {history.length > 1 && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-white">Portfolio Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => `$${value}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Asset Allocation Chart */}
      {stocks.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-white">Asset Allocation</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Add Stock Form */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Add Stock</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <input
            type="text" placeholder="Symbol (e.g. AAPL)" value={symbol}
            onChange={(e) => setSymbol(e.target.value)} required
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[140px] text-white"
          />
          <input
            type="text" placeholder="Company Name" value={companyName}
            onChange={(e) => setCompanyName(e.target.value)} required
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[140px] text-white"
          />
          <input
            type="number" placeholder="Quantity" value={quantity}
            onChange={(e) => setQuantity(e.target.value)} required
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-28 text-white"
          />
          <input
            type="number" step="0.01" placeholder="Buy Price" value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)} required
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-28 text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white"
          >
            Add Stock
          </button>
        </form>
      </div>

      {/* Stock List */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 text-left">
            <tr>
              <th className="p-3">Symbol</th>
              <th className="p-3">Company</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Buy Price</th>
              <th className="p-3">Current</th>
              <th className="p-3">Gain/Loss</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock._id} className="border-t border-gray-800">
                <td className="p-3 font-semibold text-white">{stock.symbol}</td>
                <td className="p-3 text-gray-400">{stock.companyName}</td>
                <td className="p-3 text-white">{stock.quantity}</td>
                <td className="p-3 text-white">${stock.buyPrice}</td>
                <td className="p-3 text-white">${stock.currentPrice ?? 'N/A'}</td>
                <td className={`p-3 ${stock.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${stock.gainLoss} ({stock.gainLossPercent}%)
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(stock._id)}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded-lg text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Dashboard;