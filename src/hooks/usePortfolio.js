import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('cryptoPortfolio');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const addToPortfolio = (coin, amount) => {
    const transaction = {
      id: uuidv4(),
      coinId: coin.id,
      coinName: coin.name,
      amount,
      purchasePrice: coin.current_price,
      timestamp: Date.now(),
    };

    setPortfolio(prev => [...prev, transaction]);
    return transaction;
  };

  const removeFromPortfolio = (transactionId) => {
    setPortfolio(prev => prev.filter(item => item.id !== transactionId));
  };

  const getPortfolioValue = (currentPrices) => {
    return portfolio.reduce((total, transaction) => {
      const currentPrice = currentPrices[transaction.coinId] || transaction.purchasePrice;
      return total + (transaction.amount * currentPrice);
    }, 0);
  };

  const getPortfolioStats = (currentPrices) => {
    const stats = portfolio.reduce((acc, transaction) => {
      const currentPrice = currentPrices[transaction.coinId] || transaction.purchasePrice;
      const value = transaction.amount * currentPrice;
      const cost = transaction.amount * transaction.purchasePrice;
      const profit = value - cost;
      
      if (!acc[transaction.coinId]) {
        acc[transaction.coinId] = {
          name: transaction.coinName,
          totalAmount: 0,
          totalValue: 0,
          totalCost: 0,
          profit: 0,
        };
      }

      acc[transaction.coinId].totalAmount += transaction.amount;
      acc[transaction.coinId].totalValue += value;
      acc[transaction.coinId].totalCost += cost;
      acc[transaction.coinId].profit += profit;

      return acc;
    }, {});

    return stats;
  };

  return {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    getPortfolioValue,
    getPortfolioStats,
  };
};