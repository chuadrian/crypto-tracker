import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

function SearchInput({ value, onChange, onSubmit }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search cryptocurrencies..."
        value={value}
        onChange={onChange}
        className="search-input"
      />
    </form>
  );
}

export default SearchInput;