import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getTopCryptos, searchCryptos } from '../../services/api';
import { useFavorites } from '../../hooks/useFavorites';
import SearchHeader from '../SearchHeader/SearchHeader';
import CryptoCard from '../CryptoCard/CryptoCard';
import Loader from '../Loader/Loader';
import './CryptoList.css';

function CryptoList() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const loadMoreCryptos = useCallback(async () => {
    if (loading || !hasMore || isSearching || showFavorites) return;
    
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
  }, [page, loading, hasMore, isSearching, showFavorites]);

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

    if (!showFavorites) {
      initialLoad();
    }
  }, [showFavorites]);

  useEffect(() => {
    if (inView && !isSearching && hasMore && !loading && !showFavorites) {
      loadMoreCryptos();
    }
  }, [inView, isSearching, hasMore, loading, loadMoreCryptos, showFavorites]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      setShowFavorites(false);
      setCryptos([]);
      setPage(1);
      setHasMore(true);
      const initialCryptos = await getTopCryptos(1);
      setCryptos(initialCryptos);
      setPage(2);
      return;
    }

    setIsSearching(true);
    setShowFavorites(false);
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
    setShowFavorites(false);
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

  const handleToggleFavorites = () => {
    setShowFavorites(prev => !prev);
    if (!showFavorites) {
      setIsSearching(false);
      const favoriteCryptos = cryptos.filter(crypto => favorites.includes(crypto.id));
      setCryptos(favoriteCryptos);
    } else {
      setPage(1);
      loadMoreCryptos();
    }
  };

  const displayedCryptos = showFavorites
    ? cryptos.filter(crypto => favorites.includes(crypto.id))
    : cryptos;

  return (
    <motion.div 
      className="crypto-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SearchHeader
        showFavorites={showFavorites}
        onToggleFavorites={handleToggleFavorites}
        onSearch={handleSearch}
        onSuggestionSelect={handleSuggestionSelect}
      />
      
      <h2 className="section-title">
        {showFavorites 
          ? 'Favorite Cryptocurrencies' 
          : isSearching 
            ? 'Search Results' 
            : 'Top Cryptocurrencies'}
      </h2>
      
      {loading && cryptos.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="crypto-grid">
            {displayedCryptos.map((crypto) => (
              <CryptoCard
                key={`${crypto.id}-${crypto.symbol}`}
                crypto={crypto}
                isFavorite={favorites.includes(crypto.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          {!isSearching && !showFavorites && hasMore && (
            <div ref={ref} className="loader-wrapper">
              <Loader />
            </div>
          )}
          {showFavorites && displayedCryptos.length === 0 && (
            <div className="no-favorites">
              <h3>No favorites yet</h3>
              <p>Add some cryptocurrencies to your favorites list!</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default CryptoList;