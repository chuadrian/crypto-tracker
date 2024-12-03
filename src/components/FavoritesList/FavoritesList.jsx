import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { getTopCryptos } from '../../services/api';
import './FavoritesList.css';

function FavoritesList() {
  const [favoriteCoins, setFavoriteCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    const fetchFavorites = async () => {
      const allCoins = await getTopCryptos();
      const filteredCoins = allCoins.filter(coin => favorites.includes(coin.id));
      setFavoriteCoins(filteredCoins);
      setLoading(false);
    };
    fetchFavorites();
  }, [favorites]);

  if (loading) return <div className="loading">Loading...</div>;
  if (favoriteCoins.length === 0) {
    return (
      <div className="no-favorites">
        <h2>No Favorite Cryptocurrencies</h2>
        <p>Add some cryptocurrencies to your favorites to see them here!</p>
        <Link to="/" className="browse-link">Browse Cryptocurrencies</Link>
      </div>
    );
  }

  return (
    <div className="favorites-list">
      <h2>Your Favorite Cryptocurrencies</h2>
      <div className="crypto-grid">
        {favoriteCoins.map((crypto) => (
          <Link to={`/coin/${crypto.id}`} key={crypto.id} className="crypto-card">
            <img src={crypto.image} alt={crypto.name} className="crypto-logo" />
            <h3>{crypto.name}</h3>
            <p className="crypto-symbol">{crypto.symbol.toUpperCase()}</p>
            <p className="crypto-price">${crypto.current_price.toLocaleString()}</p>
            <p className={`price-change ${crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FavoritesList;