import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { getCoinDetails, getCoinOHLC } from '../../services/api';
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
import 'chartjs-chart-financial';
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
  const [coin, setCoin] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const { tg, isInTelegram } = useTelegram();

  useEffect(() => {
    const fetchData = async () => {
      const [coinData, ohlc] = await Promise.all([
        getCoinDetails(coinId),
        getCoinOHLC(coinId)
      ]);
      setCoin(coinData);
      setPriceData(ohlc);
      setLoading(false);
    };
    fetchData();

    if (isInTelegram) {
      tg.BackButton.show();
      return () => tg.BackButton.hide();
    }
  }, [coinId, tg, isInTelegram]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!coin) return <div className="error">Coin not found</div>;

  const chartData = {
    labels: priceData.map(data => new Date(data[0]).toLocaleDateString()),
    datasets: [
      {
        label: 'Price',
        data: priceData.map(data => data[4]), // Using closing price
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataPoint = priceData[context.dataIndex];
            return [
              `Open: $${dataPoint[1].toFixed(2)}`,
              `High: $${dataPoint[2].toFixed(2)}`,
              `Low: $${dataPoint[3].toFixed(2)}`,
              `Close: $${dataPoint[4].toFixed(2)}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    }
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
        <h2>Price History</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="coin-description">
        <h2>About {coin.name}</h2>
        <p dangerouslySetInnerHTML={{ __html: coin.description.en }}></p>
      </div>
    </div>
  );
}

export default CoinDetail;