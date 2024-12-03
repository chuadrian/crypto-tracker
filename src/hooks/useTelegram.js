export const useTelegram = () => {
    const tg = window.Telegram?.WebApp;
  
    return {
      tg,
      user: tg?.initDataUnsafe?.user,
      queryId: tg?.initDataUnsafe?.query_id,
      isInTelegram: !!tg,
      onClose: () => tg?.close(),
      onToggleButton: () => tg?.MainButton.toggle(),
      onMainButton: (fn) => tg?.MainButton.onClick(fn),
    };
  };