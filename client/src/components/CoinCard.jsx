import React, { useState } from 'react';
import TradeModal from './TradeModal';

const CoinCard = ({ coin, onTradeComplete }) => {
  const [showModal, setShowModal] = useState(false);

  const priceChange = coin.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img src={coin.image} alt={coin.name} className="w-10 h-10" />
            <div>
              <h3 className="font-bold text-lg">{coin.name}</h3>
              <p className="text-gray-500 text-sm uppercase">{coin.symbol}</p>
            </div>
          </div>
          <div className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <p className="font-bold text-xl">${coin.current_price?.toLocaleString()}</p>
            <p className="text-sm">{isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-500">Market Cap</p>
            <p className="font-semibold">${(coin.market_cap / 1e9).toFixed(2)}B</p>
          </div>
          <div>
            <p className="text-gray-500">Volume (24h)</p>
            <p className="font-semibold">${(coin.total_volume / 1e9).toFixed(2)}B</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Trade
        </button>
      </div>

      {showModal && (
        <TradeModal
          coin={coin}
          onClose={() => setShowModal(false)}
          onTradeComplete={onTradeComplete}
        />
      )}
    </>
  );
};

export default CoinCard;
