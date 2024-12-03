import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTopCryptos, searchCryptos } from '../../services/api';
import SearchBar from '../SearchBar/SearchBar';
import './CryptoList.css';

function CryptoList() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchCryptos = async () => {
      const data = await getTopCryptos();
      setCryptos(data);
      setLoading(false);
    };
    fetchCryptos();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      const data = await getTopCryptos();
      setCryptos(data);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    const results = await searchCryptos(query);
    setCryptos(results);
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crypto-list">
      <SearchBar onSearch={handleSearch} />
      <h2>{isSearching ? 'Search Results' : 'Top 50 Cryptocurrencies'}</h2>
      {cryptos.length === 0 && isSearching ? (
        <div className="no-results">No cryptocurrencies found</div>
      ) : (
        <div className="crypto-grid">
          {cryptos.map((crypto) => (
            <Link to={`/coin/${crypto.id}`} key={crypto.id} className="crypto-card">
              <img src={crypto.image} alt={crypto.name} className="crypto-logo" />
              <h3>{crypto.name}</h3>
              <p className="crypto-symbol">{crypto.symbol.toUpperCase()}</p>
              <p className="crypto-price">${crypto.current_price?.toLocaleString()}</p>
              {crypto.price_change_percentage_24h && (
                <p className={`price-change ${crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CryptoList;