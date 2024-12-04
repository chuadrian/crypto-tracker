export const sanitizeCryptoData = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(crypto => ({
      id: crypto.id || '',
      name: crypto.name || '',
      symbol: crypto.symbol || '',
      current_price: crypto.current_price || 0,
      image: crypto.image || '',
      price_change_percentage_24h: crypto.price_change_percentage_24h || 0,
      market_cap: crypto.market_cap || 0,
      sparkline_in_7d: crypto.sparkline_in_7d ? {
        price: Array.isArray(crypto.sparkline_in_7d.price) ? 
          crypto.sparkline_in_7d.price : []
      } : { price: [] }
    }));
  };
  
  export const sanitizeCoinDetails = (data) => {
    if (!data) return null;
    
    return {
      id: data.id || '',
      name: data.name || '',
      symbol: data.symbol || '',
      description: {
        en: data.description?.en || ''
      },
      image: {
        large: data.image?.large || ''
      },
      market_data: {
        current_price: {
          usd: data.market_data?.current_price?.usd || 0
        },
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
        market_cap: {
          usd: data.market_data?.market_cap?.usd || 0
        },
        sparkline_7d: {
          price: Array.isArray(data.market_data?.sparkline_7d?.price) ?
            data.market_data.sparkline_7d.price : []
        }
      }
    };
  };