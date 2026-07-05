import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Watchlist() {
  const [items, setItems] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchWatchlist = () => {
    axios.get('http://localhost:5000/api/watchlist', authHeader)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching watchlist:', error);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWatchlist();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/watchlist', { symbol, companyName }, authHeader)
      .then(() => {
        fetchWatchlist();
        setSymbol('');
        setCompanyName('');
      })
      .catch((error) => {
        console.error('Error adding to watchlist:', error);
      });
  };

  const handleRemove = (id) => {
    axios.delete(`http://localhost:5000/api/watchlist/${id}`, authHeader)
      .then(() => {
        fetchWatchlist();
      })
      .catch((error) => {
        console.error('Error removing from watchlist:', error);
      });
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">My Watchlist</h1>
        <span className="text-gray-400 text-sm">{items.length} Stocks</span>
      </div>

      {/* Add to Watchlist Form */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Add to Watchlist</h2>
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
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white"
          >
            Add to Watchlist
          </button>
        </form>
      </div>

      {/* Watchlist Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 text-left">
            <tr>
              <th className="p-3">Stock</th>
              <th className="p-3">Current Price</th>
              <th className="p-3">Change</th>
              <th className="p-3">Change %</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  Your watchlist is empty. Add a stock above to track it.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-t border-gray-800">
                  <td className="p-3">
                    <div className="font-semibold text-white">{item.symbol}</div>
                    <div className="text-gray-500 text-xs">{item.companyName}</div>
                  </td>
                  <td className="p-3 text-white">${item.currentPrice ?? 'N/A'}</td>
                  <td className={`p-3 ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change ?? '-'}
                  </td>
                  <td className={`p-3 ${item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent ?? '-'}%
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded-lg text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Watchlist;