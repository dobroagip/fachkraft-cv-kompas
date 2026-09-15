import express from 'express';
import cors from 'cors';
import { insertLead, insertFeedback, getStats } from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- health-check (для PM2/Nginx/моніторингу) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'fachkraft-cv-kompass-backend', time: new Date().toISOString() });
});

// --- логування ліда (факт скачування резюме) — для звіту гранту ---
app.post('/api/leads', (req, res) => {
  try {
    const { telegramUserId, targetRole, createdAt } = req.body || {};
    insertLead({
      telegramUserId,
      targetRole: targetRole || 'Lagerarbeiter',
      createdAt: createdAt || new Date().toISOString()
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('POST /api/leads failed:', err);
    res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

// --- логування короткого опитування після скачування ---
app.post('/api/feedback', (req, res) => {
  try {
    const { telegramUserId, answers, createdAt } = req.body || {};
    if (!answers) {
      return res.status(400).json({ ok: false, error: 'answers_required' });
    }
    insertFeedback({
      telegramUserId,
      answers,
      createdAt: createdAt || new Date().toISOString()
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('POST /api/feedback failed:', err);
    res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

// --- проста статистика для звіту гранту ---
// Захищено спрощеним токеном через query-параметр. Це не production-grade
// авторизація — для MVP-етапу без особистого кабінету цього достатньо;
// перед публічним розкриттям ендпоінту варто додати повноцінну автентифікацію.
app.get('/api/stats', (req, res) => {
  const token = req.query.token;
  if (!process.env.STATS_TOKEN || token !== process.env.STATS_TOKEN) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  res.json({ ok: true, stats: getStats() });
});

app.listen(PORT, () => {
  console.log(`Fachkraft CV-Kompass backend listening on port ${PORT}`);
});
