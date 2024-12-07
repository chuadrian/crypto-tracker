import axios from 'axios';
import { sanitizeCryptoData, sanitizeCoinDetails } from '../utils/dataTransform';

const BASE_URL = 'https://api.coingecko.com/api/v3';
const NEWS_API_URL = 'https://api.coingecko.com/api/v3/news';

export const getTopCryptos = async (page = 1, perPage = 50) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true`
    );
    return sanitizeCryptoData(response.data);
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    return [];
  }
};

export const getCoinOHLC = async (coinId, days = 7) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching OHLC data:', error);
    return [];
  }
};

export const fetchSearchSuggestions = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}`
    );
    return response.data.coins.slice(0, 8);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

export const searchCryptos = async (query) => {
  if (!query) return [];
  
  try {
    const searchResponse = await axios.get(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}`
    );
    
    const coinIds = searchResponse.data.coins
      .slice(0, 10)
      .map(coin => coin.id)
      .join(',');
    
    if (coinIds) {
      const marketResponse = await axios.get(
        `${BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=true`
      );
      return sanitizeCryptoData(marketResponse.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error searching cryptos:', error);
    return [];
  }
};

export const getCoinDetails = async (coinId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&sparkline=true`
    );
    return sanitizeCoinDetails(response.data);
  } catch (error) {
    console.error('Error fetching coin details:', error);
    return null;
  }
};

export const fetchCryptoNews = async () => {
  try {
    const response = await axios.get(NEWS_API_URL);
    return response.data.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.thumb_2x || article.thumb,
      source: article.author,
      publishedAt: new Date(article.published_at).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    return [];
  }
};