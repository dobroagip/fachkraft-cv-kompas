// Спільні перевірки правдоподібності року/місяця для полів періоду
// (досвід роботи, освіта). HTML min/max на нативних інпутах НЕ
// блокують ручний ввід цифр (людина може дописати "2100" в полі року,
// і браузер це пропустить) — тому дублюємо перевірку в JS.

export const MIN_PERIOD_YEAR = 1970;

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function isPlausibleYear(yearLike) {
  const year = Number(yearLike);
  return Number.isInteger(year) && year >= MIN_PERIOD_YEAR && year <= getCurrentYear();
}

// Для <input type="month"> зі значенням формату "YYYY-MM".
export function isPlausibleMonthValue(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(value || '');
  if (!match) return false;
  return isPlausibleYear(match[1]);
}

export function currentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}