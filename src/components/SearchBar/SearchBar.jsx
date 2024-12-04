import { useState, useCallback, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import debounce from 'debounce';
import './SearchBar.css';

function SearchBar({ onSearch, onSuggestionSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const debouncedFetchSuggestions = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        setSuggestions(data.coins.slice(0, 8));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    debouncedFetchSuggestions(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query.trim());
  };

  const handleSuggestionClick = (coinId) => {
    setShowSuggestions(false);
    setQuery('');
    onSuggestionSelect(coinId);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={query}
          onChange={handleChange}
          className="search-input"
          onFocus={() => setShowSuggestions(true)}
        />
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-container">
          {suggestions.map((coin) => (
            <div
              key={coin.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(coin.id)}
            >
              <img src={coin.thumb} alt={coin.name} className="suggestion-thumb" />
              <div className="suggestion-info">
                <span className="suggestion-name">{coin.name}</span>
                <span className="suggestion-symbol">{coin.symbol.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;