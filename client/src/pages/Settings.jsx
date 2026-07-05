import { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { User, Bell, Shield, Code, Info } from 'lucide-react';

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const token = localStorage.getItem('token');
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Profile state
  const [name, setName] = useState(savedUser?.name || '');
  const [email, setEmail] = useState(savedUser?.email || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');

  // Preferences state (stored locally)
  const [defaultDashboard, setDefaultDashboard] = useState(localStorage.getItem('defaultDashboard') || 'Overview');
  const [defaultIndex, setDefaultIndex] = useState(localStorage.getItem('defaultIndex') || 'NIFTY 50');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'Dark');
  const [compactMode, setCompactMode] = useState(localStorage.getItem('compactMode') === 'true');
  const [refreshInterval, setRefreshInterval] = useState(localStorage.getItem('refreshInterval') || '60 seconds');
  const [prefMsg, setPrefMsg] = useState('');

  // Notifications state
  const [notifPriceAlerts, setNotifPriceAlerts] = useState(localStorage.getItem('notifPriceAlerts') !== 'false');
  const [notifNewsUpdates, setNotifNewsUpdates] = useState(localStorage.getItem('notifNewsUpdates') !== 'false');
  const [notifEmailSummary, setNotifEmailSummary] = useState(localStorage.getItem('notifEmailSummary') === 'true');
  const [notifMsg, setNotifMsg] = useState('');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');
    axios.put('http://localhost:5000/api/auth/profile', { name, email }, authHeader)
      .then((response) => {
        localStorage.setItem('user', JSON.stringify(response.data));
        setProfileMsg('Profile updated successfully!');
      })
      .catch((err) => setProfileErr(err.response?.data?.message || 'Update failed'));
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('defaultDashboard', defaultDashboard);
    localStorage.setItem('defaultIndex', defaultIndex);
    localStorage.setItem('currency', currency);
    localStorage.setItem('theme', theme);
    localStorage.setItem('compactMode', compactMode);
    localStorage.setItem('refreshInterval', refreshInterval);
    setPrefMsg('Preferences saved!');
  };

  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('notifPriceAlerts', notifPriceAlerts);
    localStorage.setItem('notifNewsUpdates', notifNewsUpdates);
    localStorage.setItem('notifEmailSummary', notifEmailSummary);
    setNotifMsg('Notification settings saved!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPassMsg('');
    setPassErr('');
    axios.put('http://localhost:5000/api/auth/password', { currentPassword, newPassword }, authHeader)
      .then(() => {
        setPassMsg('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      })
      .catch((err) => setPassErr(err.response?.data?.message || 'Password change failed'));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', desc: 'Personal information', icon: User },
    { id: 'preferences', label: 'Preferences', desc: 'App preferences', icon: Bell },
    { id: 'notifications', label: 'Notifications', desc: 'Manage alerts & updates', icon: Bell },
    { id: 'security', label: 'Security', desc: 'Password & 2FA', icon: Shield },
    { id: 'api', label: 'API', desc: 'API keys & access', icon: Code },
    { id: 'about', label: 'About', desc: 'About the application', icon: Info },
  ];

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition relative flex-shrink-0 ${checked ? 'bg-blue-600' : 'bg-gray-700'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  const Row = ({ title, description, children }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );

  return (
    <Layout>
      <h1 className="text-xl font-bold text-white">Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your preferences and account settings</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left mini-nav */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition border ${
                  activeTab === tab.id
                    ? 'bg-green-500/10 border-green-500/40'
                    : 'bg-gray-900 border-gray-800 hover:bg-gray-800'
                }`}
              >
                <Icon size={18} className={activeTab === tab.id ? 'text-green-400 mt-0.5' : 'text-gray-400 mt-0.5'} />
                <div>
                  <p className={`text-sm font-medium ${activeTab === tab.id ? 'text-green-400' : 'text-white'}`}>{tab.label}</p>
                  <p className="text-xs text-gray-500">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right content panel */}
        <div className="flex-1 space-y-6">
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white">Personal Information</h2>
              <p className="text-gray-500 text-sm mb-5">Update your personal details and profile information</p>

              {profileMsg && <div className="bg-green-600/20 border border-green-600/40 text-green-400 text-sm rounded-lg p-3 mb-4">{profileMsg}</div>}
              {profileErr && <div className="bg-red-600/20 border border-red-600/40 text-red-400 text-sm rounded-lg p-3 mb-4">{profileErr}</div>}

              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Membership</label>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400">Free</div>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Member Since</label>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400">
                      {savedUser?.createdAt ? new Date(savedUser.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium text-white">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white">Preferences</h2>
              <p className="text-gray-500 text-sm mb-2">Customize your app experience</p>

              {prefMsg && <div className="bg-green-600/20 border border-green-600/40 text-green-400 text-sm rounded-lg p-3 my-4">{prefMsg}</div>}

              <form onSubmit={handlePreferencesSubmit}>
                <Row title="Default Dashboard" description="Choose your default landing page">
                  <select value={defaultDashboard} onChange={(e) => setDefaultDashboard(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white">
                    <option>Overview</option>
                    <option>Portfolio</option>
                    <option>Watchlist</option>
                  </select>
                </Row>
                <Row title="Default Market Index" description="Select market index for overview">
                  <select value={defaultIndex} onChange={(e) => setDefaultIndex(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white">
                    <option>NIFTY 50</option>
                    <option>BANK NIFTY</option>
                    <option>SENSEX</option>
                  </select>
                </Row>
                <Row title="Currency" description="Select your preferred currency">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white">
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </Row>
                <Row title="Theme" description="Choose your preferred theme">
                  <div className="flex gap-2">
                    {['Light', 'Dark', 'System'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTheme(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          theme === t ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-gray-700 text-gray-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Row>
                <Row title="Compact Mode" description="Show more data in less space">
                  <Toggle checked={compactMode} onChange={setCompactMode} />
                </Row>
                <Row title="Data Refresh Interval" description="Auto refresh data interval">
                  <select value={refreshInterval} onChange={(e) => setRefreshInterval(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white">
                    <option>30 seconds</option>
                    <option>60 seconds</option>
                    <option>5 minutes</option>
                  </select>
                </Row>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium text-white mt-5">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <p className="text-gray-500 text-sm mb-2">Manage alerts & updates</p>

              {notifMsg && <div className="bg-green-600/20 border border-green-600/40 text-green-400 text-sm rounded-lg p-3 my-4">{notifMsg}</div>}

              <form onSubmit={handleNotificationsSubmit}>
                <Row title="Price Alert Notifications" description="Get notified when your price alerts trigger">
                  <Toggle checked={notifPriceAlerts} onChange={setNotifPriceAlerts} />
                </Row>
                <Row title="Market News Updates" description="Receive updates on market-moving news">
                  <Toggle checked={notifNewsUpdates} onChange={setNotifNewsUpdates} />
                </Row>
                <Row title="Weekly Email Summary" description="Get a weekly portfolio performance summary">
                  <Toggle checked={notifEmailSummary} onChange={setNotifEmailSummary} />
                </Row>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium text-white mt-5">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white">Change Password</h2>
              <p className="text-gray-500 text-sm mb-5">Update your password to keep your account secure</p>

              {passMsg && <div className="bg-green-600/20 border border-green-600/40 text-green-400 text-sm rounded-lg p-3 mb-4">{passMsg}</div>}
              {passErr && <div className="bg-red-600/20 border border-red-600/40 text-red-400 text-sm rounded-lg p-3 mb-4">{passErr}</div>}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium text-white">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* API */}
          {activeTab === 'api' && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white">API Keys & Access</h2>
              <p className="text-gray-500 text-sm mb-5">Manage API keys used to fetch live market data</p>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-400">
                This app uses the Finnhub API for live stock prices and Yahoo Finance for index data.
                API keys are configured securely on the backend server and are not exposed to the browser.
              </div>
            </div>
          )}

          {/* ABOUT */}
          {activeTab === 'about' && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white">About</h2>
              <p className="text-gray-500 text-sm mb-5">About this application</p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300"><span className="text-gray-500">App:</span> Stock Portfolio Tracker</p>
                <p className="text-gray-300"><span className="text-gray-500">Version:</span> 1.0.0</p>
                <p className="text-gray-300"><span className="text-gray-500">Built with:</span> React, Node.js, Express, MongoDB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Settings;