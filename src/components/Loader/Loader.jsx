import Lottie from 'react-lottie';
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
    <div className="loader-container">
      <Lottie 
        options={defaultOptions}
        height={200}
        width={200}
        isClickToPauseDisabled={true}
      />
    </div>
  );
}

export default Loader;