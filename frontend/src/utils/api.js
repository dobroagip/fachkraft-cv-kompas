// Мінімальний клієнт для бекенду. Якщо запит не вдається (наприклад,
// бекенд ще не задеплоєний під час локальної розробки фронтенда),
// помилка лише логується в консоль і не ламає UX користувача —
// збереження PDF відбувається повністю на клієнті і не залежить від бекенду.

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function postJson(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`API ${path} responded with ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[api] ${path} failed:`, err.message);
    return null;
  }
}

export function logLead({ telegramUserId, targetRole = 'Lagerarbeiter' }) {
  return postJson('/leads', {
    telegramUserId,
    targetRole,
    createdAt: new Date().toISOString()
  });
}

export function logFeedback({ telegramUserId, answers }) {
  return postJson('/feedback', {
    telegramUserId,
    answers,
    createdAt: new Date().toISOString()
  });
}
