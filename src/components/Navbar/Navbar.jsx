import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaStar, FaHome, FaBell, FaNewspaper, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '../NotificationBell/NotificationBell';
import Logo from '../Logo/Logo';
import './Navbar.css';

function Navbar({ theme, toggleTheme, alerts = [] }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const menuVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: "0%",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          <Logo />
        </Link>

        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <AnimatePresence>
          {(isMenuOpen || window.innerWidth > 768) && (
            <motion.div 
              className="nav-links"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <FaHome /> <span>Home</span>
              </Link>
              <Link to="/favorites" className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}>
                <FaStar /> <span>Favorites</span>
              </Link>
              <Link to="/news" className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`}>
                <FaNewspaper /> <span>News</span>
              </Link>
              <NotificationBell alerts={alerts} />
              <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;