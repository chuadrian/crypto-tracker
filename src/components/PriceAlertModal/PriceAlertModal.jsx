import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import './PriceAlertModal.css';

function PriceAlertModal({ isOpen, onClose, coin, onSetAlert }) {
  const [price, setPrice] = useState(coin?.current_price || '');
  const [type, setType] = useState('above');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSetAlert(coin, parseFloat(price), type);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          static
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          open={isOpen}
          onClose={onClose}
          className="alert-modal-container"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="alert-modal"
          >
            <Dialog.Title className="alert-title">
              <FaBell className="alert-icon" />
              Set Price Alert for {coin?.name}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="alert-form">
              <div className="form-group">
                <label htmlFor="alertType">Alert Type</label>
                <select
                  id="alertType"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="alert-select"
                >
                  <option value="above">Price goes above</option>
                  <option value="below">Price goes below</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="alertPrice">Price (USD)</label>
                <input
                  id="alertPrice"
                  type="number"
                  step="0.000001"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="alert-input"
                  required
                />
              </div>

              <div className="alert-actions">
                <button type="button" onClick={onClose} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Set Alert
                </button>
              </div>
            </form>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default PriceAlertModal;