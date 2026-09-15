// Форматує значення <input type="date"> (формат "YYYY-MM-DD") у
// німецький вигляд "DD.MM.YYYY" вручну, рядком — без new Date(...).
//
// ЧОМУ НЕ new Date(str).toLocaleDateString():
// new Date("2003-03-23") парситься як UTC-північ, а .toLocaleDateString()
// далі конвертує в локальний часовий пояс браузера — залежно від пояса
// дата могла зміщуватись на день, а в деяких браузерах/устройствах
// (наприклад, при "прокрутці" нативного пікера року в Telegram WebView)
// рік міг зберігатися без ведучих нулів ("3" замість "2003"). Ручний
// розбір рядка усуває обидві проблеми.
export function formatBirthDate(isoDate) {
  if (!isoDate) return '—';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

// HTML min/max на <input type="date"> лише позначають значення як
// "невалідне" для стандартної форм-валідації — вони НЕ блокують і не
// обрізають те, що людина вручну ввела по цифрах у полі року (звідси
// й траплялися дати на кшталт 12.12.1211). Тому рік перевіряємо ще раз
// у JS явно, перед тим як пускати людину на наступний крок.
const MIN_BIRTH_YEAR = 1940;

export function isPlausibleBirthDate(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || '');
  if (!match) return false;
  const year = Number(match[1]);
  const currentYear = new Date().getFullYear();
  return year >= MIN_BIRTH_YEAR && year <= currentYear;
}