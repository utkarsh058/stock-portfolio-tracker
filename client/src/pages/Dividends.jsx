import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Dividends() {
  const [dividends, setDividends] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [shares, setShares] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchDividends = () => {
    axios.get('http://localhost:5000/api/dividends', authHeader)
      .then((response) => setDividends(response.data))
      .catch((error) => console.error('Error fetching dividends:', error));
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDividends();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/dividends', {
      symbol, amount: Number(amount), shares: Number(shares),
    }, authHeader)
      .then(() => {
        fetchDividends();
        setSymbol('');
        setAmount('');
        setShares('');
      })
      .catch((error) => console.error('Error adding dividend:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/dividends/${id}`, authHeader)
      .then(() => fetchDividends())
      .catch((error) => console.error('Error deleting dividend:', error));
  };

  const totalDividends = dividends.reduce((sum, d) => sum + d.amount, 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold text-white mb-6">Dividends</h1>

      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <p className="text-gray-400 text-sm">Total Dividends Received</p>
        <p className="text-2xl font-bold mt-1 text-green-400">${totalDividends.toFixed(2)}</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Log Dividend</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <input
            type="text" placeholder="Symbol" value={symbol}
            onChange={(e) => setSymbol(e.target.value)} required
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px] text-white"
          />
          <input
            type="number" step="0.01" placeholder="Total Amount ($)" value={amount}
            onChange={(e) => setAmount(e.target.value)} required
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-40 text-white"
          />
          <input
            type="number" placeholder="Shares Held" value={shares}
            onChange={(e) => setShares(e.target.value)} required
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-32 text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white"
          >
            Add
          </button>
        </form>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Shares</th>
              <th className="p-3">Amount</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dividends.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No dividends logged yet.
                </td>
              </tr>
            ) : (
              dividends.map((div) => (
                <tr key={div._id} className="border-t border-gray-800">
                  <td className="p-3 text-gray-400">{formatDate(div.createdAt)}</td>
                  <td className="p-3 font-semibold text-white">{div.symbol}</td>
                  <td className="p-3 text-white">{div.shares}</td>
                  <td className="p-3 text-green-400">${div.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(div._id)}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded-lg text-xs"
                    >
                      Delete
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

export default Dividends;