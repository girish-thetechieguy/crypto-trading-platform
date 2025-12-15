import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          🪙 CryptoTrade
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link to="/portfolio" className="hover:text-blue-400">Portfolio</Link>
          <Link to="/transactions" className="hover:text-blue-400">Transactions</Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm">💰 ${user?.walletBalance?.toFixed(2)}</span>
            <span className="text-sm">👤 {user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
