import { useState, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import debounce from 'debounce';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim()) {
        onSearch(searchQuery.trim());
      } else {
        onSearch('');
      }
    }, 500),
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search cryptocurrencies..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
    </form>
  );
}

export default SearchBar;