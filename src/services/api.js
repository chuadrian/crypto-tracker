import axios from 'axios';
import { sanitizeCryptoData, sanitizeCoinDetails } from '../utils/dataTransform';

const BASE_URL = 'https://api.coingecko.com/api/v3';

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