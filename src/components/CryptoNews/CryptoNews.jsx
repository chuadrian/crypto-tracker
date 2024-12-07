import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaExternalLinkAlt } from 'react-icons/fa';
import { fetchCryptoNews } from '../../services/api';
import './CryptoNews.css';

function CryptoNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      const newsData = await fetchCryptoNews();
      setNews(newsData);
      setLoading(false);
    };
    loadNews();
  }, []);

  return (
    <div className="crypto-news">
      <div className="news-header">
        <FaNewspaper className="news-icon" />
        <h2>Latest Crypto News</h2>
      </div>

      {loading ? (
        <div className="news-loading">Loading latest news...</div>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src={item.image} alt={item.title} className="news-image" />
              <div className="news-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="news-footer">
                  <span className="news-source">{item.source}</span>
                  <FaExternalLinkAlt className="external-link-icon" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}

export default CryptoNews;