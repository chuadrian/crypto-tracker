import Lottie from 'react-lottie';
import { motion } from 'framer-motion';
import animationData from './bitcoin-loader.json';
import './Loader.css';

function Loader() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <motion.div 
      className="loader-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Lottie 
        options={defaultOptions}
        height={120}
        width={120}
        isClickToPauseDisabled={true}
      />
      <p className="loading-text">Loading cryptocurrencies...</p>
    </motion.div>
  );
}

export default Loader;