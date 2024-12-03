import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaStar, FaHome } from 'react-icons/fa';
import { motion } from 'motion/react';
import './Navbar.css';

function Navbar({ theme, toggleTheme }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            CryptoTracker
          </motion.div>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <FaHome /> Home
          </Link>
          <Link to="/favorites" className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}>
            <FaStar /> Favorites
          </Link>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;