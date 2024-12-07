import { motion } from 'framer-motion';
import './Logo.css';

function Logo() {
  return (
    <motion.div
      className="logo"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="var(--primary-color)" />
        <path
          d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 22c-5.514 0-10-4.486-10-10S10.486 6 16 6s10 4.486 10 10-4.486 10-10 10z"
          fill="white"
        />
        <path
          d="M17.5 11h-3v4h-4v3h4v4h3v-4h4v-3h-4v-4z"
          fill="white"
        />
      </svg>
      <span className="logo-text">CryptoTracker</span>
    </motion.div>
  );
}

export default Logo;