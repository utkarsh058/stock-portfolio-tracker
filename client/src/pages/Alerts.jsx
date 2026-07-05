import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('above');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAlerts = () => {
    axios.get('http://localhost:5000/api/alerts', authHeader)
      .then((response) => {
        setAlerts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching alerts:', error);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAlerts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/alerts', {
      symbol,
      targetPrice: Number(targetPrice),
      condition,
    }, authHeader)
      .then(() => {
        fetchAlerts();
        setSymbol('');
        setTargetPrice('');
      })
      .catch((error) => {
        console.error('Error adding alert:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/alerts/${id}`, authHeader)
      .then(() => {
        fetchAlerts();
      })
      .catch((error) => {
        console.error('Error deleting alert:', error);
      });
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold text-white mb-6">Price Alerts</h1>

      {/* Add Alert Form */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Create Alert</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Symbol (e.g. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[140px] text-white"
          />
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="above">Price goes above</option>
            <option value="below">Price goes below</option>
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Target Price"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            required
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-32 text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white"
          >
            Create Alert
          </button>
        </form>
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center text-gray-500">
          No alerts set. Create one above.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`bg-gray-900 rounded-xl p-4 border flex justify-between items-center ${
                alert.triggered ? 'border-green-600' : 'border-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={alert.triggered ? 'text-green-400' : 'text-gray-500'}>
                  {alert.triggered ? '🔔' : '🔕'}
                </span>
                <div>
                  <p className="text-white font-semibold">
                    {alert.symbol} {alert.condition === 'above' ? '>' : '<'} ${alert.targetPrice}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Current: ${alert.currentPrice ?? 'N/A'}
                    {alert.triggered && <span className="text-green-400 ml-2">Triggered!</span>}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(alert._id)}
                className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded-lg text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Alerts;