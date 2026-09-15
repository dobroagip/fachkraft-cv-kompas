# Fachkraft CV-Kompass — MVP

Telegram Mini App для генерації німецького резюме (Lebenslauf) під
професію **Lagerarbeiter** (складський робітник) для українських мігрантів
в Австрії. Інтерфейс українською, підсумкове резюме — німецькою.

## Структура проєкту

```
fachkraft-cv-kompass/
├── frontend/                      React + Vite + Tailwind, Telegram Mini App
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx               точка входу
│       ├── App.jsx                оркестрація wizard'а (7 кроків)
│       ├── index.css              Tailwind + print-стилі для PDF
│       ├── telegram.js            обгортка над Telegram WebApp SDK
│       ├── i18n/strings.js        всі тексти інтерфейсу (українською)
│       ├── data/options.js        варіанти чипів {ua, de} для кожного кроку
│       ├── context/CVContext.jsx  стан анкети (React Context)
│       ├── components/
│       │   ├── ProgressBar.jsx
│       │   ├── ChipSelect.jsx         мультивибір чипами
│       │   ├── LanguageLevelSelect.jsx
│       │   ├── StepFooter.jsx         кнопки "Назад / Далі"
│       │   ├── ResumePreview.jsx      верстка самого Lebenslauf (лише DE)
│       │   └── FeedbackSurvey.jsx     опитування з 3 питань після скачування
│       ├── steps/
│       │   ├── Step1Personal.jsx
│       │   ├── Step2Experience.jsx
│       │   ├── Step3Skills.jsx
│       │   ├── Step4Certificates.jsx
│       │   ├── Step5Languages.jsx
│       │   ├── Step6Education.jsx
│       │   └── Step7Preview.jsx       перегляд + скачування PDF
│       └── utils/
│           ├── exportPdf.js       window.print() + fallback jsPDF/html2canvas
│           └── api.js             клієнт для /api/leads, /api/feedback
│
├── backend/                       Express + SQLite (better-sqlite3)
│   ├── package.json
│   ├── server.js                  health-check, /api/leads, /api/feedback, /api/stats
│   ├── db.js                      схема SQLite і хелпери запису
│   └── data/                      cv-kompass.sqlite3 (створюється автоматично)
│
└── deploy/
    ├── deploy.sh                  повний скрипт розгортання на Ubuntu VPS
    ├── nginx.conf                 шаблон конфігурації Nginx
    └── DEPLOY.md                  покрокова інструкція + підключення до BotFather
```

## Локальний запуск (для розробки/тестування поза Telegram)

**Фронтенд:**

```bash
cd frontend
npm install
npm run dev
# відкриється http://localhost:5173 — працює і в звичайному браузері,
# використовуючи fallback-кольори navy/amber замість теми Telegram
```

**Бекенд:**

```bash
cd backend
npm install
npm start
# слухає http://localhost:4000, health-check: GET /api/health
```

За замовчуванням фронтенд звертається до `/api` (проксі Nginx у
продакшені). Для локальної розробки з окремим бекендом створіть
`frontend/.env` на основі `.env.example` і вкажіть
`VITE_API_BASE_URL=http://localhost:4000/api`.

## Технічні рішення, варті пояснення

- **PDF генерується на клієнті через `window.print()`** (не jsPDF за
  замовчуванням) — це дає чіткий, вибірний текст із коректною кирилицею
  та німецькими умлаутами, без растеризації сторінки. Обґрунтування і
  fallback через `jsPDF + html2canvas` (на випадок, якщо системний діалог
  друку не відкриється у вбудованому Telegram WebView) — в
  `frontend/src/utils/exportPdf.js`.
- **SQLite (better-sqlite3) замість плаского JSON-файлу** — витримує
  одночасні записи без пошкодження даних і дозволяє рахувати підсумки
  для звіту гранту прямим SQL-запитом. Деталі — в `backend/db.js`.
- **Дані анкети живуть лише в пам'яті вкладки** (не в localStorage) —
  свідомий вибір, оскільки WebView Telegram може очищати сховище між
  сесіями; для одноразового заповнення форми цього достатньо.
- **Тема адаптується під Telegram.WebApp.themeParams**, з fallback на
  navy `#0F172A` / amber `#D97706`, коли застосунок відкрито поза
  Telegram (див. `frontend/src/telegram.js` і `:root` у `index.css`).

## Наступні кроки (свідомо поза межами цього MVP)

Оплата/paywall, особистий кабінет, інші професії та мовні пари, AI-фічі —
все це заплановано на наступні версії й тут не реалізовувалось за ТЗ.

Детальна інструкція з деплою на VPS — у [`deploy/DEPLOY.md`](./deploy/DEPLOY.md).
