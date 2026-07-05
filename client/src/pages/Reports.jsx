import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Reports() {
  const [stocks, setStocks] = useState([]);
  const [dividends, setDividends] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get('http://localhost:5000/api/stocks', authHeader).then((r) => setStocks(r.data));
    axios.get('http://localhost:5000/api/dividends', authHeader).then((r) => setDividends(r.data));
    axios.get('http://localhost:5000/api/transactions', authHeader).then((r) => setTransactions(r.data));
  }, []);

  const totalInvested = stocks.reduce((sum, s) => sum + (s.investedAmount || 0), 0);
  const totalCurrentValue = stocks.reduce((sum, s) => sum + (s.currentValue || 0), 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalDividends = dividends.reduce((sum, d) => sum + d.amount, 0);
  const buyCount = transactions.filter((t) => t.type === 'Buy').length;
  const sellCount = transactions.filter((t) => t.type === 'Sell').length;

  const reportCards = [
    {
      title: 'Portfolio Summary',
      description: 'Overview of your portfolio performance',
      data: [
        ['Total Invested', `$${totalInvested.toFixed(2)}`],
        ['Current Value', `$${totalCurrentValue.toFixed(2)}`],
        ['Total Gain/Loss', `$${totalGainLoss.toFixed(2)}`],
      ],
    },
    {
      title: 'Transaction Report',
      description: 'All buy and sell activity',
      data: [
        ['Total Buys', buyCount],
        ['Total Sells', sellCount],
        ['Total Transactions', transactions.length],
      ],
    },
    {
      title: 'Dividend Report',
      description: 'All dividend income received',
      data: [
        ['Total Dividends', `$${totalDividends.toFixed(2)}`],
        ['Number of Payouts', dividends.length],
      ],
    },
  ];

  return (
    <Layout>
      <h1 className="text-xl font-bold text-white mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportCards.map((report) => (
          <div key={report.title} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold text-white">{report.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{report.description}</p>
            <div className="space-y-2">
              {report.data.map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Reports;