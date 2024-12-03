import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useTelegram } from './hooks/useTelegram';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import TelegramWrapper from './components/TelegramWrapper/TelegramWrapper';
import Navbar from './components/Navbar/Navbar';
import CryptoList from './components/CryptoList/CryptoList';
import CoinDetail from './components/CoinDetail/CoinDetail';
import FavoritesList from './components/FavoritesList/FavoritesList';
import './styles/theme.css';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { isInTelegram } = useTelegram();

  return (
    <Router>
      <ErrorBoundary>
        <TelegramWrapper>
          <div className="app">
            {!isInTelegram && <Navbar theme={theme} toggleTheme={toggleTheme} />}
            <main className={isInTelegram ? 'telegram-main' : ''}>
              <Routes>
                <Route path="/" element={<CryptoList />} />
                <Route path="/favorites" element={<FavoritesList />} />
                <Route path="/coin/:coinId" element={<CoinDetail />} />
              </Routes>
            </main>
          </div>
        </TelegramWrapper>
      </ErrorBoundary>
    </Router>
  );
}

export default App;