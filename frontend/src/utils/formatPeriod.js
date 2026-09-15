// Перетворює значення <input type="month"> (формат "YYYY-MM") на
// німецький формат "MM.YYYY", який очікують бачити в Lebenslauf.
export function formatMonthYear(value) {
  if (!value) return '';
  const [year, month] = value.split('-');
  if (!year || !month) return value;
  return `${month}.${year}`;
}

export function formatPeriod(entry) {
  const from = formatMonthYear(entry.periodFrom);
  const to = entry.current ? 'heute' : formatMonthYear(entry.periodTo);
  if (!from && !to) return '';
  if (!to) return from;
  return `${from} – ${to}`;
}
