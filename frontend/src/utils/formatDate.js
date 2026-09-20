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

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Перевіряє не лише діапазон року, а й реальну календарну коректність
// дати (наприклад, "31.04" — некоректно, у квітні 30 днів). У деяких
// WebView (зокрема вбудований браузер Telegram на певних пристроях)
// <input type="date"> поводиться як звичайне текстове поле без
// нативного календаря, тож туди можна ввести будь-що.
export function isPlausibleBirthDate(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || '');
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const currentYear = new Date().getFullYear();
  if (year < MIN_BIRTH_YEAR || year > currentYear) return false;
  if (month < 1 || month > 12) return false;
  const maxDay = month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1];
  if (day < 1 || day > maxDay) return false;
  return true;
}