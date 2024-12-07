import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import './NotificationBell.css';

function NotificationBell({ alerts = [] }) {
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <div className="notification-bell-container">
      <motion.button
        className="notification-bell-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAlerts(!showAlerts)}
      >
        <FaBell className="bell-icon" />
        {alerts.length > 0 && (
          <span className="notification-badge">{alerts.length}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {showAlerts && (
          <motion.div
            className="alerts-dropdown"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className="alert-item">
                  <img src={alert.coinImage} alt={alert.coinName} className="alert-coin-image" />
                  <div className="alert-content">
                    <h4>{alert.coinName}</h4>
                    <p>{alert.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-alerts">
                <p>No active price alerts</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;