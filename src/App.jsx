import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useTelegram } from './hooks/useTelegram';
import { usePriceAlerts } from './hooks/usePriceAlerts';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import TelegramWrapper from './components/TelegramWrapper/TelegramWrapper';
import Navbar from './components/Navbar/Navbar';
import CryptoList from './components/CryptoList/CryptoList';
import CoinDetail from './components/CoinDetail/CoinDetail';
import FavoritesList from './components/FavoritesList/FavoritesList';
import CryptoNews from './components/CryptoNews/CryptoNews';
import './styles/theme.css';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { isInTelegram } = useTelegram();
  const { alerts } = usePriceAlerts();

  return (
    <Router>
      <ErrorBoundary>
        <TelegramWrapper>
          <div className="app">
            <Toaster position="top-right" />
            <Navbar theme={theme} toggleTheme={toggleTheme} alerts={alerts} />
            <main className={isInTelegram ? 'telegram-main' : ''}>
              <Routes>
                <Route path="/" element={<CryptoList />} />
                <Route path="/favorites" element={<FavoritesList />} />
                <Route path="/coin/:coinId" element={<CoinDetail />} />
                <Route path="/news" element={<CryptoNews />} />
              </Routes>
            </main>
          </div>
        </TelegramWrapper>
      </ErrorBoundary>
    </Router>
  );
}

export default App;