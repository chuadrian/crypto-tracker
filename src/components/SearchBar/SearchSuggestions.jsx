import { motion } from 'framer-motion';
import './SearchBar.css';

function SearchSuggestions({ suggestions, onSelect }) {
  if (!suggestions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="suggestions-container"
    >
      {suggestions.map((coin) => (
        <div
          key={coin.id}
          className="suggestion-item"
          onClick={() => onSelect(coin.id)}
        >
          <img src={coin.thumb} alt={coin.name} className="suggestion-thumb" />
          <div className="suggestion-info">
            <span className="suggestion-name">{coin.name}</span>
            <span className="suggestion-symbol">{coin.symbol.toUpperCase()}</span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default SearchSuggestions;