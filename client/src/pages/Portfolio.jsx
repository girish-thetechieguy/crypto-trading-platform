import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Portfolio = () => {
  const { user } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/portfolio');
      setPortfolio(res.data.portfolio);

      if (res.data.portfolio.length > 0) {
        const coinIds = res.data.portfolio.map(p => p.coinId).join(',');
        const priceRes = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`);
        setCurrentPrices(priceRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((total, item) => {
      const currentPrice = currentPrices[item.coinId]?.usd || 0;
      return total + (item.amount * currentPrice);
    }, 0);
  };

  const calculateProfitLoss = (item) => {
    const currentPrice = currentPrices[item.coinId]?.usd || 0;
    const currentValue = item.amount * currentPrice;
    const investedValue = item.amount * item.averageBuyPrice;
    const profitLoss = currentValue - investedValue;
    const percentage = ((profitLoss / investedValue) * 100);
    return { profitLoss, percentage };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Portfolio</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 mb-2">Wallet Balance</p>
            <p className="text-3xl font-bold">${user?.walletBalance?.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 mb-2">Portfolio Value</p>
            <p className="text-3xl font-bold">${calculateTotalValue().toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 mb-2">Total Balance</p>
            <p className="text-3xl font-bold">${(user?.walletBalance + calculateTotalValue()).toFixed(2)}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading portfolio...</div>
        ) : portfolio.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-500">Your portfolio is empty</p>
            <p className="text-gray-400 mt-2">Start trading to build your portfolio</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Asset</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-right">Avg Buy Price</th>
                  <th className="px-6 py-3 text-right">Current Price</th>
                  <th className="px-6 py-3 text-right">Current Value</th>
                  <th className="px-6 py-3 text-right">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map(item => {
                  const currentPrice = currentPrices[item.coinId]?.usd || 0;
                  const currentValue = item.amount * currentPrice;
                  const { profitLoss, percentage } = calculateProfitLoss(item);
                  const isProfit = profitLoss >= 0;

                  return (
                    <tr key={item.coinId} className="border-t">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500 uppercase">{item.symbol}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">{item.amount.toFixed(8)}</td>
                      <td className="px-6 py-4 text-right">${item.averageBuyPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">${currentPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-semibold">${currentValue.toFixed(2)}</td>
                      <td className={`px-6 py-4 text-right font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {isProfit ? '+' : ''}{profitLoss.toFixed(2)} ({percentage.toFixed(2)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
