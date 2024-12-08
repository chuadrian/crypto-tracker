import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCoinDetails, getCoinOHLC } from '../../services/api';
import { useFavorites } from '../../hooks/useFavorites';
import { useTelegram } from '../../hooks/useTelegram';
import Loader from '../Loader/Loader';
import './CoinDetail.css';
import CandlestickChart from './CandlestickChart';

function CoinDetail() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();
  const { tg, isInTelegram } = useTelegram();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [coinData, ohlc] = await Promise.all([
          getCoinDetails(coinId),
          getCoinOHLC(coinId)
        ]);

        if (!coinData) {
          setError('Cryptocurrency not found');
          return;
        }

        setCoin(coinData);
        setPriceData(ohlc);
      } catch (error) {
        setError(error.message || 'Failed to load cryptocurrency data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (isInTelegram) {
      tg.BackButton.show();
      return () => tg.BackButton.hide();
    }
  }, [coinId, tg, isInTelegram]);

  if (loading) {
    return (
      <div className="coin-detail-loader">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="coin-detail-error"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Return to Home
        </button>
      </motion.div>
    );
  }

  if (!coin) {
    return (
      <motion.div 
        className="coin-detail-not-found"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Cryptocurrency Not Found</h2>
        <p>The cryptocurrency you're looking for doesn't exist or has been delisted.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Return to Home
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="coin-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="coin-header">
        <img src={coin.image.large} alt={coin.name} className="coin-logo" />
        <h1>{coin.name}</h1>
        {!isInTelegram && (
          <button 
            className={`favorite-btn ${favorites.includes(coin.id) ? 'active' : ''}`}
            onClick={() => toggleFavorite(coin.id)}
          >
            {favorites.includes(coin.id) ? '★' : '☆'}
          </button>
        )}
      </div>

      <div className="coin-stats">
        <div className="stat-item">
          <h3>Current Price</h3>
          <p>${coin.market_data.current_price.usd.toLocaleString()}</p>
        </div>
        <div className="stat-item">
          <h3>24h Change</h3>
          <p className={coin.market_data.price_change_percentage_24h > 0 ? 'positive' : 'negative'}>
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
        <div className="stat-item">
          <h3>Market Cap</h3>
          <p>${coin.market_data.market_cap.usd.toLocaleString()}</p>
        </div>
      </div>

      <div className="chart-container">
        <h2>Price History</h2>
        <CandlestickChart data={priceData} />
      </div>

      <div className="coin-description">
        <h2>About {coin.name}</h2>
        <p dangerouslySetInnerHTML={{ __html: coin.description.en }}></p>
      </div>
    </motion.div>
  );
}

export default CoinDetail;