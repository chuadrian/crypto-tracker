import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { getTopCryptos, searchCryptos } from '../../services/api';
import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import './CryptoList.css';

function CryptoList() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const loadMoreCryptos = useCallback(async () => {
    if (loading || !hasMore || isSearching) return;
    
    setLoading(true);
    try {
      const newCryptos = await getTopCryptos(page);
      if (newCryptos.length === 0) {
        setHasMore(false);
      } else {
        setCryptos(prev => [...prev, ...newCryptos]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more cryptos:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, isSearching]);

  useEffect(() => {
    const initialLoad = async () => {
      try {
        const initialCryptos = await getTopCryptos(1);
        setCryptos(initialCryptos);
        setPage(2);
      } catch (error) {
        console.error('Error loading initial cryptos:', error);
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, []);

  useEffect(() => {
    if (inView && !isSearching && hasMore && !loading) {
      loadMoreCryptos();
    }
  }, [inView, isSearching, hasMore, loading, loadMoreCryptos]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      setCryptos([]);
      setPage(1);
      setHasMore(true);
      const initialCryptos = await getTopCryptos(1);
      setCryptos(initialCryptos);
      setPage(2);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    try {
      const results = await searchCryptos(query);
      setCryptos(results);
    } catch (error) {
      console.error('Error searching cryptos:', error);
      setCryptos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSelect = async (coinId) => {
    setIsSearching(true);
    setLoading(true);
    try {
      const results = await searchCryptos(coinId);
      setCryptos(results);
    } catch (error) {
      console.error('Error fetching coin:', error);
      setCryptos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crypto-list">
      <SearchBar onSearch={handleSearch} onSuggestionSelect={handleSuggestionSelect} />
      <h2>{isSearching ? 'Search Results' : 'Top Cryptocurrencies'}</h2>
      {loading && cryptos.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="crypto-grid">
            {cryptos.map((crypto) => (
              <Link 
                to={`/coin/${crypto.id}`} 
                key={crypto.id} 
                className="crypto-card"
              >
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
          {!isSearching && hasMore && (
            <div ref={ref} className="loader-wrapper">
              <Loader />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CryptoList;