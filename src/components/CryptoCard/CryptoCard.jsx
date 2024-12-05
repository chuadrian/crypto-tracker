import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaBell } from 'react-icons/fa';
import PriceAlertModal from '../PriceAlertModal/PriceAlertModal';
import './CryptoCard.css';

function CryptoCard({ crypto, isFavorite, onToggleFavorite, onSetAlert }) {
  const [showAlertModal, setShowAlertModal] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(crypto.id);
  };

  const handleAlertClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAlertModal(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to={`/coin/${crypto.id}`} className="crypto-card">
          <div className="crypto-card-header">
            <img src={crypto.image} alt={crypto.name} className="crypto-logo" />
            <div className="card-actions">
              <button
                className="action-button"
                onClick={handleAlertClick}
                aria-label="Set price alert"
              >
                <FaBell />
              </button>
              <button
                className={`action-button ${isFavorite ? 'active' : ''}`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FaStar />
              </button>
            </div>
          </div>
          <div className="crypto-card-content">
            <h3 className="crypto-name">{crypto.name}</h3>
            <p className="crypto-symbol">{crypto.symbol.toUpperCase()}</p>
            <p className="crypto-price">${crypto.current_price?.toLocaleString()}</p>
            {crypto.price_change_percentage_24h && (
              <p className={`price-change ${crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                {crypto.price_change_percentage_24h > 0 ? '↑' : '↓'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </p>
            )}
          </div>
        </Link>
      </motion.div>

      <PriceAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        coin={crypto}
        onSetAlert={onSetAlert}
      />
    </>
  );
}

export default CryptoCard;