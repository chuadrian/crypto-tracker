import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { getCoinDetails } from '../../services/api';
import { useFavorites } from '../../hooks/useFavorites';
import { useTelegram } from '../../hooks/useTelegram';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './CoinDetail.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CoinDetail() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const { tg, isInTelegram } = useTelegram();

  useEffect(() => {
    const fetchCoinDetails = async () => {
      const data = await getCoinDetails(coinId);
      setCoin(data);
      setLoading(false);
    };
    fetchCoinDetails();

    if (isInTelegram) {
      tg.BackButton.show();
      return () => tg.BackButton.hide();
    }
  }, [coinId, tg, isInTelegram]);

  useEffect(() => {
    if (isInTelegram && coin) {
      tg.MainButton.text = favorites.includes(coin.id) ? 'Remove from Favorites' : 'Add to Favorites';
      tg.MainButton.show();
      tg.MainButton.onClick(() => toggleFavorite(coin.id));

      return () => {
        tg.MainButton.hide();
        tg.MainButton.offClick();
      };
    }
  }, [coin, favorites, toggleFavorite, tg, isInTelegram]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!coin) return <div className="error">Coin not found</div>;

  const chartData = {
    labels: coin.market_data.sparkline_7d.price.map((_, index) => 
      new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Price (USD)',
        data: coin.market_data.sparkline_7d.price,
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
      },
    ],
  };

  return (
    <div className="coin-detail">
      <div className="coin-header">
        <img src={coin.image.large} alt={coin.name} className="coin-logo" />
        <h1>{coin.name}</h1>
        {!isInTelegram && (
          <button 
            className={`favorite-btn ${favorites.includes(coin.id) ? 'active' : ''}`}
            onClick={() => toggleFavorite(coin.id)}
          >
            {favorites.includes(coin.id) ? '★' : '☆'}
          </button>
        )}
      </div>

      <div className="coin-stats">
        <div className="stat-item">
          <h3>Current Price</h3>
          <p>${coin.market_data.current_price.usd.toLocaleString()}</p>
        </div>
        <div className="stat-item">
          <h3>24h Change</h3>
          <p className={coin.market_data.price_change_percentage_24h > 0 ? 'positive' : 'negative'}>
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
        <div className="stat-item">
          <h3>Market Cap</h3>
          <p>${coin.market_data.market_cap.usd.toLocaleString()}</p>
        </div>
      </div>

      <div className="chart-container">
        <h2>7-Day Price History</h2>
        <Line data={chartData} options={{
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }} />
      </div>

      <div className="coin-description">
        <h2>About {coin.name}</h2>
        <p dangerouslySetInnerHTML={{ __html: coin.description.en }}></p>
      </div>
    </div>
  );
}

export default CoinDetail;