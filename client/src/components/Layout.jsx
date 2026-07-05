import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Briefcase, Star, ClipboardList, TrendingUp,
  FileText, Wallet, Bell, StickyNote, Settings, LogOut, Search, User, Menu, X
} from 'lucide-react';

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [indices, setIndices] = useState([]);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return;
    axios.get('http://localhost:5000/api/market/indices', authHeader)
      .then((response) => setIndices(response.data))
      .catch((error) => console.error('Error fetching indices:', error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Watchlist', path: '/watchlist', icon: Star },
    { name: 'Transactions', path: '/transactions', icon: ClipboardList },
    { name: 'Dividends', path: '/dividends', icon: Wallet },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Notes', path: '/notes', icon: StickyNote },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Mobile overlay - dims background when sidebar is open on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-30 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={22} />
            <h1 className="text-lg font-bold leading-tight">
              <span className="text-white block">Stock Portfolio</span>
              <span className="text-blue-400 block text-sm -mt-1">Tracker</span>
            </h1>
          </div>
          <button className="md:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-400">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main area with top header + page content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 gap-6 sticky top-0 z-10">
          <button className="md:hidden text-gray-400" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="relative w-64 flex-shrink-0 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search stocks..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3 md:gap-4">
            {/* Live Indices */}
            <div className="hidden lg:flex items-center gap-3">
              {indices.map((index) => (
                <div key={index.name} className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 min-w-[140px]">
                  <p className="text-gray-500 text-xs">{index.name}</p>
                  {index.price !== null ? (
                    <p className="text-sm font-semibold mt-0.5">
                      <span className="text-white">{index.price.toFixed(2)}</span>{' '}
                      <span className={index.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {index.change >= 0 ? '+' : ''}{index.change?.toFixed(2)} ({index.changePercent?.toFixed(2)}%)
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 mt-0.5">N/A</p>
                  )}
                </div>
              ))}
            </div>

            <button className="relative text-gray-400 hover:text-white">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm text-white hidden sm:inline">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;