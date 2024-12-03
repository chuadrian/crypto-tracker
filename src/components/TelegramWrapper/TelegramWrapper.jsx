import { useEffect } from 'react';
import { useTelegram } from '../../hooks/useTelegram';

function TelegramWrapper({ children }) {
  const { tg, isInTelegram } = useTelegram();

  useEffect(() => {
    if (isInTelegram) {
      // Configure Telegram Web App
      tg.ready();
      tg.expand();

      // Set header color to match app theme
      tg.setHeaderColor('#2196f3');
      
      // Configure back button behavior
      tg.BackButton.onClick(() => window.history.back());
    }
  }, [tg, isInTelegram]);

  return children;
}

export default TelegramWrapper;