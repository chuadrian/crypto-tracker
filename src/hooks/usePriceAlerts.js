import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export const usePriceAlerts = () => {
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('cryptoAlerts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cryptoAlerts', JSON.stringify(alerts));
  }, [alerts]);

  const checkAlerts = (currentPrices) => {
    alerts.forEach(alert => {
      const currentPrice = currentPrices[alert.coinId];
      if (!currentPrice) return;

      if (alert.type === 'above' && currentPrice >= alert.price) {
        toast.success(`${alert.coinName} has reached $${alert.price}!`);
        removeAlert(alert.id);
      } else if (alert.type === 'below' && currentPrice <= alert.price) {
        toast.success(`${alert.coinName} has dropped to $${alert.price}!`);
        removeAlert(alert.id);
      }
    });
  };

  const addAlert = (coin, price, type) => {
    const alert = {
      id: uuidv4(),
      coinId: coin.id,
      coinName: coin.name,
      price,
      type,
      createdAt: Date.now(),
    };

    setAlerts(prev => [...prev, alert]);
    toast.success(`Alert set for ${coin.name} at $${price}`);
    return alert;
  };

  const removeAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    checkAlerts,
  };
};