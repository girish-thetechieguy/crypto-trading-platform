import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TradeModal = ({ coin, onClose, onTradeComplete }) => {
  const { fetchUserProfile } = useContext(AuthContext);
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalCost = amount * coin.current_price;

  const handleTrade = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = tradeType === 'buy' ? '/api/transactions/buy' : '/api/transactions/sell';
      await axios.post(`http://localhost:5001${endpoint}`, {
        coinId: coin.id,
        coinSymbol: coin.symbol,
        coinName: coin.name,
        amount: parseFloat(amount),
        pricePerUnit: coin.current_price
      });

      await fetchUserProfile();
      onTradeComplete();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trade {coin.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2 rounded ${
              tradeType === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2 rounded ${
              tradeType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-200'
            }`}
          >
            Sell
          </button>
        </div>

        <form onSubmit={handleTrade}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Amount ({coin.symbol.toUpperCase()})</label>
            <input
              type="number"
              step="0.00000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="0.00"
              required
            />
          </div>

          <div className="mb-4 p-4 bg-gray-100 rounded">
            <div className="flex justify-between mb-2">
              <span>Price per unit:</span>
              <span className="font-semibold">${coin.current_price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !amount}
            className={`w-full py-3 rounded font-semibold text-white ${
              tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            } disabled:bg-gray-400`}
          >
            {loading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${coin.symbol.toUpperCase()}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
