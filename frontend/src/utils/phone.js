// Австрійський телефон завжди зберігається у форматі "+43 XXXXXXXXX".
// Поле вводу показує лише частину після +43 — сам код країни
// зафіксований візуально і не редагується.

export const AT_COUNTRY_CODE = '+43';

// Прибирає з введеного тексту можливий дублікат коду країни (+43, 0043)
// та національний префікс "0" (0676... -> 676...), лишає тільки цифри
// та пробіли, які користувач сам розставляє для читабельності.
export function sanitizeAustrianLocalPart(raw) {
  let v = raw.replace(/^\s*\+?43/, '').replace(/^\s*0043/, '');
  v = v.replace(/[^\d\s]/g, '');
  v = v.replace(/^0+(?=\d)/, '');
  return v;
}

export function toFullAustrianPhone(localPart) {
  const cleaned = sanitizeAustrianLocalPart(localPart).trim();
  return cleaned ? `${AT_COUNTRY_CODE} ${cleaned}` : '';
}

// Для попереднього заповнення поля, коли в даних уже лежить повний
// номер (наприклад, після повернення на цей крок wizard'а).
export function extractLocalPart(fullPhone) {
  return sanitizeAustrianLocalPart(fullPhone || '');
}