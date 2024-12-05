import { motion } from 'framer-motion';
import { FaStar, FaSearch } from 'react-icons/fa';
import './SearchHeader.css';

function SearchHeader({ 
  showFavorites, 
  onToggleFavorites, 
  onSearch, 
  onSuggestionSelect 
}) {
  return (
    <div className="search-header">
      <div className="search-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`favorites-toggle ${showFavorites ? 'active' : ''}`}
          onClick={onToggleFavorites}
          aria-label={showFavorites ? 'Show all cryptocurrencies' : 'Show favorites'}
        >
          <FaStar />
          <span className="favorites-label">Favorites</span>
        </motion.button>
      </div>
    </div>
  );
}

export default SearchHeader;