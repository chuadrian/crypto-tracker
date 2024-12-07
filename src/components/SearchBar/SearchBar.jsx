import { useState, useCallback, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { AnimatePresence } from 'framer-motion';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import { fetchSearchSuggestions } from '../../services/api';
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
        const results = await fetchSearchSuggestions(searchQuery);
        setSuggestions(results);
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

  const handleSuggestionSelect = (coinId) => {
    setShowSuggestions(false);
    setQuery('');
    onSuggestionSelect(coinId);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <SearchInput
        value={query}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      
      <AnimatePresence>
        {showSuggestions && (
          <SearchSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;