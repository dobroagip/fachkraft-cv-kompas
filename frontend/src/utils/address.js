// Австрійська адреса в резюме традиційно виглядає як "PLZ Ort"
// (наприклад "2822 Bad Erlach"), тому індекс — обов'язкове поле,
// а назва населеного пункту — необов'язкова і завжди тільки латиницею.

export function sanitizePostalCode(raw) {
  return raw.replace(/\D/g, '').slice(0, 4);
}

export function isValidPostalCode(value) {
  return /^\d{4}$/.test(value);
}

// Узагальнена перевірка "схоже на слово/фразу німецькою латиницею":
// літери (включно з умлаутами), пробіли, дефіси, апострофи, крапки та
// коса риска (для форм на кшталт "Bäcker/in"). Використовується і для
// назви населеного пункту, і для спеціальності при ручному введенні.
export function isPlausibleLatinPhrase(value) {
  if (!value || !value.trim()) return false;
  return /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'./-]{1,}$/.test(value.trim());
}

export function isPlausibleCityName(value) {
  return isPlausibleLatinPhrase(value);
}

// Невеликий довідник індексів найбільших австрійських міст — не вся
// база (~2700 індексів), а лише орієнтир для найпоширеніших випадків,
// щоб підказати правильне написання (наприклад "Wien", а не "Wienn").
const KNOWN_CITY_BY_POSTAL_CODE = {
  '4020': 'Linz', '4030': 'Linz', '4040': 'Linz',
  '5020': 'Salzburg', '5023': 'Salzburg',
  '6020': 'Innsbruck', '6021': 'Innsbruck',
  '8010': 'Graz', '8020': 'Graz', '8036': 'Graz',
  '9020': 'Klagenfurt am Wörthersee',
  '9500': 'Villach',
  '4600': 'Wels',
  '3100': 'St. Pölten',
  '2700': 'Wiener Neustadt',
  '6850': 'Dornbirn',
  '6900': 'Bregenz',
  '8700': 'Leoben',
  '3400': 'Klosterneuburg',
  '4400': 'Steyr',
  '6800': 'Feldkirch',
  '2822': 'Bad Erlach'
};

export function suggestCityForPostalCode(postalCode) {
  if (!isValidPostalCode(postalCode)) return null;
  // Усі індекси 1010–1230 — це Відень.
  const num = Number(postalCode);
  if (postalCode.startsWith('1') && num >= 1010 && num <= 1230) return 'Wien';
  return KNOWN_CITY_BY_POSTAL_CODE[postalCode] || null;
}

// Прибирає кирилицю символ за символом одразу під час набору (а не
// заднім числом, як кнопка "Транслітерувати" на інших полях) — тут
// населений пункт майже завжди можна знайти в довіднику й ввести
// латиницею одразу, тож простіше не дозволяти кирилицю в принципі.
export function stripCyrillic(value) {
  return value.replace(/[\u0400-\u04FF]/g, '');
}