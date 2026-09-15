import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'cv-kompass.sqlite3');
export const db = new Database(dbPath);

// Простий вибір на користь SQLite (замість "просто JSON-файл"):
// - декілька одночасних записів (кілька людей тиснуть кнопку одночасно)
// не призведуть до пошкодження файлу, як може статись при неатомарному
// перезаписі JSON;
// - легко порахувати підсумки для звіту гранту (COUNT, GROUP BY)
// прямо SQL-запитом, без ручного парсингу;
// - better-sqlite3 синхронний і не потребує окремого сервера БД —
// для MVP на одному VPS цього достатньо. За потреби пізніше легко
// перейти на Postgres, змінивши лише цей файл.

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_user_id TEXT,
    target_role TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_user_id TEXT,
    clarity TEXT,
    helpful TEXT,
    difficulty TEXT,
    created_at TEXT NOT NULL
  );
`);

export function insertLead({ telegramUserId, targetRole, createdAt }) {
  const stmt = db.prepare(
    `INSERT INTO leads (telegram_user_id, target_role, created_at) VALUES (?, ?, ?)`
  );
  return stmt.run(telegramUserId ? String(telegramUserId) : null, targetRole, createdAt);
}

export function insertFeedback({ telegramUserId, answers, createdAt }) {
  const stmt = db.prepare(
    `INSERT INTO feedback (telegram_user_id, clarity, helpful, difficulty, created_at)
     VALUES (?, ?, ?, ?, ?)`
  );
  return stmt.run(
    telegramUserId ? String(telegramUserId) : null,
    answers?.clarity ?? null,
    answers?.helpful ?? null,
    answers?.difficulty ?? null,
    createdAt
  );
}

export function getStats() {
  const totalLeads = db.prepare('SELECT COUNT(*) AS n FROM leads').get().n;
  const totalFeedback = db.prepare('SELECT COUNT(*) AS n FROM feedback').get().n;
  const clarityBreakdown = db
    .prepare('SELECT clarity, COUNT(*) AS n FROM feedback GROUP BY clarity')
    .all();
  const helpfulBreakdown = db
    .prepare('SELECT helpful, COUNT(*) AS n FROM feedback GROUP BY helpful')
    .all();
  const difficultyBreakdown = db
    .prepare('SELECT difficulty, COUNT(*) AS n FROM feedback GROUP BY difficulty')
    .all();
  return { totalLeads, totalFeedback, clarityBreakdown, helpfulBreakdown, difficultyBreakdown };
}
