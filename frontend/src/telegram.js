// Тонка обгортка над Telegram WebApp SDK.
// Якщо застосунок відкрито поза Telegram (наприклад, у браузері під час
// розробки чи тестування), усі виклики безпечно ігноруються і
// використовуються запасні (fallback) кольори з tailwind.config.js.

const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;

export const isTelegram = Boolean(tg && typeof tg.initData === 'string' && tg.initData.length > 0);

const FALLBACK_THEME = {
  bg_color: '#FBFAF7',
  text_color: '#0F172A',
  hint_color: '#64748B',
  button_color: '#D97706',
  button_text_color: '#FFFFFF',
  secondary_bg_color: '#F1EFE9'
};

export function initTelegram() {
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    applyThemeParams(tg.themeParams);
    tg.onEvent('themeChanged', () => applyThemeParams(tg.themeParams));
  } catch (e) {
    // Тихо ігноруємо — застосунок працює і без Telegram-контексту.
    console.warn('Telegram WebApp init failed, using fallback theme.', e);
  }
}

function applyThemeParams(themeParams = {}) {
  const theme = { ...FALLBACK_THEME, ...themeParams };
  const root = document.documentElement.style;
  root.setProperty('--tg-bg', theme.bg_color);
  root.setProperty('--tg-text', theme.text_color);
  root.setProperty('--tg-hint', theme.hint_color);
  root.setProperty('--tg-button', theme.button_color);
  root.setProperty('--tg-button-text', theme.button_text_color);
  root.setProperty('--tg-secondary-bg', theme.secondary_bg_color);
}

// Керування головною кнопкою Telegram (MainButton).
// На кроках 1–6 ми використовуємо власну кнопку «Далі» для простоти
// логіки валідації; на останньому кроці (перегляд) віддаємо перевагу
// нативній MainButton, якщо застосунок відкрито в Telegram.
export function setMainButton({ text, onClick, visible = true, disabled = false }) {
  if (!tg) return () => {};
  tg.MainButton.setText(text);
  tg.MainButton.offClick(onClick);
  tg.MainButton.onClick(onClick);
  if (disabled) {
    tg.MainButton.disable();
  } else {
    tg.MainButton.enable();
  }
  if (visible) {
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }
  return () => {
    tg.MainButton.offClick(onClick);
  };
}

export function hideMainButton() {
  if (!tg) return;
  tg.MainButton.hide();
}

export function hapticImpact(style = 'light') {
  if (!tg?.HapticFeedback) return;
  try {
    tg.HapticFeedback.impactOccurred(style);
  } catch (e) {
    /* no-op */
  }
}

export function getTelegramUser() {
  return tg?.initDataUnsafe?.user ?? null;
}

export function closeTelegram() {
  if (tg) tg.close();
}

export default tg;
