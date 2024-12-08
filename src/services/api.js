import axios from 'axios';
import { sanitizeCryptoData, sanitizeCoinDetails } from '../utils/dataTransform';

const BASE_URL = 'https://api.coingecko.com/api/v3';
const CRYPTO_PANIC_URL = 'https://cryptopanic.com/api/v1/posts';
const CRYPTO_PANIC_KEY = 'your_api_key'; // You'll need to sign up for a free API key

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
});

export const getTopCryptos = async (page = 1, perPage = 50) => {
  try {
    const response = await axiosInstance.get(
      `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true`
    );
    return sanitizeCryptoData(response.data);
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    return [];
  }
};

export const getCoinOHLC = async (coinId, days = 7) => {
  try {
    const response = await axiosInstance.get(
      `/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching OHLC data:', error);
    return [];
  }
};

export const getCoinDetails = async (coinId) => {
  if (!coinId) {
    throw new Error('Coin ID is required');
  }

  try {
    const response = await axiosInstance.get(
      `/coins/${coinId}?localization=false&tickers=false&market_data=true&sparkline=true`
    );
    return sanitizeCoinDetails(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const fetchCryptoNews = async () => {
  try {
    const response = await axios.get(CRYPTO_PANIC_URL, {
      params: {
        auth_token: CRYPTO_PANIC_KEY,
        public: true,
        kind: 'news'
      }
    });

    return response.data.results.map(article => ({
      id: article.id,
      title: article.title,
      description: article.metadata?.description || '',
      url: article.url,
      image: article.metadata?.image?.url || '/placeholder-news.png',
      source: article.source.title,
      publishedAt: new Date(article.published_at).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    return [];
  }
};

export const searchCryptos = async (query) => {
  if (!query) return [];
  
  try {
    const searchResponse = await axiosInstance.get(`/search?query=${encodeURIComponent(query)}`);
    
    const coinIds = searchResponse.data.coins
      .slice(0, 10)
      .map(coin => coin.id)
      .join(',');
    
    if (coinIds) {
      const marketResponse = await axiosInstance.get(
        `/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=true`
      );
      return sanitizeCryptoData(marketResponse.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error searching cryptos:', error);
    return [];
  }
};