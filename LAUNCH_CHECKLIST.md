# Чек-ліст запуску та тестування перед конкурсом ОІФ

## Поточний статус
✅ Проєкт розроблено та працює локально в браузері  
⏳ Потрібно задеплоїти та підключити до Telegram  
⏳ Провести повне тестування в реальному Telegram  
⏳ Підготувати до подання на конкурс  

---

## Крок 1: Підготовка сервера та домену

### 1.1 VPS-сервер
Вам знадобиться:
- Ubuntu 22.04/24.04 VPS (Contabo, DigitalOcean, Hetzner тощо)
- Мінімум: 1 CPU, 1GB RAM, 10GB SSD
- SSH-доступ з правами sudo/root

### 1.2 Домен
**КРИТИЧНО:** Telegram Mini Apps працюють ЛИШЕ з HTTPS-доменами.

Варіанти:
1. Якщо у вас вже є домен (наприклад `yourngo.at`) — створіть піддомен:
   - `cv.yourngo.at` → вкажіть A-запис на IP вашого VPS
   - Змініть у файлі `deploy/deploy.sh` змінну `DOMAIN="cv.yourngo.at"`

2. Якщо домену немає — зареєструйте безкоштовний:
   - [Freenom](https://www.freenom.com/) — `.tk`, `.ml`, `.ga` (безкоштовно)
   - Cloudflare Pages — можна отримати піддомен `*.pages.dev`
   - Або купіть дешевий `.at` / `.eu` домен (~€10/рік)

**Перевірте DNS перед деплоєм:**
```bash
# Має показати IP вашого сервера
nslookup cv.yourngo.at
# або
dig cv.yourngo.at +short
```

---

## Крок 2: Деплой на сервер

### 2.1 Завантажте код на сервер

**Варіант A: Через Git (рекомендовано)**
```bash
ssh root@YOUR_SERVER_IP

# Клонуємо проєкт
git clone <URL_ВАШОГО_РЕПО> /var/www/fachkraft-cv-kompass-src
cd /var/www/fachkraft-cv-kompass-src
```

**Варіант B: Через SCP (якщо репо немає)**
```bash
# На вашому локальному Mac:
cd ~/Downloads/Images_oil/itnew_2/
tar -czf cv-kompass.tar.gz fachkraft-cv-kompass/
scp cv-kompass.tar.gz root@YOUR_SERVER_IP:/var/www/

# На сервері:
ssh root@YOUR_SERVER_IP
cd /var/www
tar -xzf cv-kompass.tar.gz
mv fachkraft-cv-kompass fachkraft-cv-kompass-src
```

### 2.2 Налаштування домену в deploy-скрипті

```bash
cd /var/www/fachkraft-cv-kompass-src/deploy

# Відредагуйте deploy.sh — змініть DOMAIN на ваш
nano deploy.sh
# Знайдіть рядок: DOMAIN="your-domain.example.com"
# Змініть на:      DOMAIN="cv.yourngo.at"
# Збережіть: Ctrl+O, Enter, Ctrl+X
```

### 2.3 Запуск автоматичного деплою

```bash
chmod +x /var/www/fachkraft-cv-kompass-src/deploy/deploy.sh
sudo /var/www/fachkraft-cv-kompass-src/deploy/deploy.sh
```

**Скрипт зробить все автоматично (~10-15 хв):**
- Встановить Node.js 20, Nginx, Certbot, PM2
- Налаштує firewall (лише порти 22, 80, 443)
- Збере фронтенд, запустить бекенд через PM2
- Випустить SSL-сертифікат Let's Encrypt
- Налаштує Nginx як reverse proxy

### 2.4 Перевірка після деплою

```bash
# 1. Перевірка бекенду
curl https://cv.yourngo.at/api/health
# Очікується: {"status":"ok","timestamp":"..."}

# 2. Перевірка PM2
pm2 list
# Має бути процес "fachkraft-cv-backend" зі статусом "online"

# 3. Перевірка Nginx
sudo nginx -t
sudo systemctl status nginx
```

**Відкрийте у браузері:** `https://cv.yourngo.at/`  
Має відкритись wizard з кроком 1 "Особисті дані" (поки що без Telegram-теми).

---

## Крок 3: Підключення до Telegram Bot

### 3.1 Створення бота (якщо ще немає)

1. Відкрийте Telegram, знайдіть [@BotFather](https://t.me/BotFather)
2. Надішліть команду `/newbot`
3. Введіть **ім'я бота** (наприклад: `CV Kompass Helper`)
4. Введіть **username бота** (має закінчуватись на `bot`, наприклад: `fachkraft_cv_bot`)
5. **ЗБЕРЕЖІТЬ токен** (виглядає як `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 3.2 Створення Mini App

1. У BotFather надішліть `/newapp`
2. Оберіть свого бота зі списку
3. **Назва застосунку:** `CV Kompass` (або інша, до 30 символів)
4. **Короткий опис:** `Безкоштовний конструктор німецького резюме для Lagerarbeiter`
5. **Фото (512×512 px, PNG):** підготуйте іконку (можна через Figma/Canva)
   - Приклад: синій/жовтий градієнт, іконка документа + прапор України
6. **Web App URL:** `https://cv.yourngo.at/` ⚠️ **ОБОВ'ЯЗКОВО HTTPS!**
7. **GIF-демо (необов'язково):** можна пропустити на етапі MVP

### 3.3 Налаштування кнопки Menu Button

Щоб застосунок відкривався кнопкою поруч із полем вводу:

1. У BotFather надішліть `/setmenubutton`
2. Оберіть свого бота
3. Введіть той самий URL: `https://cv.yourngo.at/`
4. **Текст кнопки:** `📄 Скласти резюме`

### 3.4 Опис бота (необов'язково, але краще зробити)

```
/setdescription — Опис, який бачить користувач перед стартом бота
/setabouttext   — Короткий опис (до 120 символів) у профілі бота
/setuserpic     — Аватар бота (квадратна картинка)
```

**Приклад тексту для `/setdescription`:**
```
Безкоштовний конструктор резюме (Lebenslauf) німецькою мовою для професії Lagerarbeiter.

✅ Інтерфейс українською
✅ Резюме німецькою за стандартом DE/AT
✅ Скачування PDF за 5 хвилин

Створено за підтримки [назва вашої НГО / грант ОІФ].
```

---

## Крок 4: Тестування в Telegram

### 4.1 Базова перевірка

1. Відкрийте свого бота в Telegram
2. Натисніть кнопку `📄 Скласти резюме` (Menu Button)
3. **Має відкритись Mini App** з кроком 1 та темою Telegram (світла/темна)

### 4.2 Повний сценарій тестування (golden path)

**Крок 1: Особисті дані**
- ✅ Введіть ім'я: `Олена`
- ✅ Прізвище: `Шевченко`
- ✅ Email: `test@example.com`
- ✅ Телефон: `+43 664 1234567`
- ✅ Місто: `Wien`
- ⏭️ Кнопка "Далі" активна та веде на крок 2

**Крок 2: Досвід роботи**
- ✅ Оберіть 2-3 чипи (наприклад: "Комплектування замовлень", "Інвентаризація")
- ✅ Період роботи: `2020 - 2023`
- ✅ Назва роботодавця: `Silpo Logistics`
- ⏭️ "Далі" → крок 3

**Крок 3: Навички**
- ✅ Оберіть 3-5 чипів (наприклад: "Використання навантажувачів", "Робота з WMS")
- ⏭️ "Далі" → крок 4

**Крок 4: Сертифікати**
- ✅ Оберіть 1-2 (або жодного) — наприклад: "Водійські права категорії B"
- ⏭️ "Далі" → крок 5

**Крок 5: Мови**
- ✅ Українська: `Рідна мова`
- ✅ Німецька: `B1 - Середній`
- ✅ Англійська: `A2 - Базовий`
- ⏭️ "Далі" → крок 6

**Крок 6: Освіта**
- ✅ Рівень: `Середня спеціальна освіта`
- ✅ Заклад: `Київський технікум`
- ✅ Роки: `2015 - 2019`
- ⏭️ "Далі" → крок 7

**Крок 7: Перегляд та скачування**
- ✅ Перевірте, що резюме показується **НІМЕЦЬКОЮ**
- ✅ Усі дані з попередніх кроків відображаються коректно
- ✅ Натисніть **"Завантажити PDF"**
  - У Telegram WebView може відкритись діалог друку (iOS) або завантажитись файл (Android)
  - Якщо `window.print()` не спрацює — спрацює fallback через jsPDF
- ✅ Після скачування показується **опитування з 3 питань**
- ✅ Заповніть опитування та натисніть "Надіслати відгук"

### 4.3 Edge cases (граничні випадки)

**Тест 1: Порожні необов'язкові поля**
- Крок 4 (сертифікати) — не обирайте жодного → має працювати
- У резюме просто не буде секції "Zertifikate"

**Тест 2: Дуже довгі тексти**
- Ім'я: 50+ символів
- Досвід: 5+ пунктів
- Має поміститись на 1 сторінку PDF (або розтягнутись на 2 сторінки без обрізу)

**Тест 3: Повернення "Назад"**
- Пройдіть до кроку 5
- Натисніть "Назад" → має повернутись на крок 4 із збереженими даними
- Змініть щось і йдіть "Далі" → має оновитись

**Тест 4: Закриття та повторне відкриття**
- Заповніть крок 1-3
- Закрийте Mini App (кнопка "×" або згорни Telegram)
- Відкрийте знову через Menu Button
- ⚠️ **Очікується:** дані НЕ збережуться (це навмисно за ТЗ — немає localStorage)
- Користувач починає з кроку 1

---

## Крок 5: Перевірка збереження лідів

### 5.1 Налаштування STATS_TOKEN (якщо ще не зробили)

```bash
ssh root@YOUR_SERVER_IP

# Згенеруйте токен (будь-який складний рядок)
STATS_TOKEN=$(openssl rand -hex 16)
echo "STATS_TOKEN=$STATS_TOKEN" >> /var/www/fachkraft-cv-kompass-backend/.env

# Додайте токен у PM2
pm2 restart fachkraft-cv-backend --update-env
pm2 save

# ЗБЕРЕЖІТЬ ТОКЕН — він знадобиться для перегляду статистики
echo "Ваш STATS_TOKEN: $STATS_TOKEN"
```

### 5.2 Перевірка API статистики

```bash
# На сервері або локально (замініть YOUR_TOKEN на згенерований вище)
curl "https://cv.yourngo.at/api/stats?token=YOUR_TOKEN"
```

**Очікуваний результат:**
```json
{
  "totalLeads": 1,
  "withFeedback": 1,
  "avgRating": 5,
  "lastLead": {
    "timestamp": "2026-09-19T20:30:00.000Z",
    "email": "test@example.com",
    "phone": "+43 664 1234567"
  }
}
```

### 5.3 Прямий доступ до SQLite (для детального звіту)

```bash
ssh root@YOUR_SERVER_IP
sqlite3 /var/www/fachkraft-cv-kompass-backend/data/cv-kompass.sqlite3

-- Кількість резюме
SELECT COUNT(*) FROM leads;

-- Останні 10 лідів
SELECT id, firstName, lastName, email, phone, city, createdAt 
FROM leads 
ORDER BY createdAt DESC 
LIMIT 10;

-- Середній рейтинг з опитувань
SELECT AVG(rating) FROM feedback;

-- Вихід
.exit
```

---

## Крок 6: Фінальна перевірка перед конкурсом

### Контрольний список (checklist)

- [ ] **Домен працює через HTTPS** (Let's Encrypt, замок у браузері)
- [ ] `/api/health` повертає `{"status":"ok"}`
- [ ] **Mini App відкривається в Telegram** через Menu Button
- [ ] **Тема адаптується** під світлу/темну тему Telegram
- [ ] Всі 7 кроків wizard'а працюють без помилок
- [ ] **PDF скачується** (через window.print або fallback)
- [ ] **Резюме НІМЕЦЬКОЮ**, всі умлаути (`ä ö ü ß`) коректні
- [ ] **Опитування після скачування** показується та надсилається
- [ ] **Ліди зберігаються** у SQLite (`/api/stats` показує count > 0)
- [ ] **Firewall налаштований** (лише порти 22, 80, 443 відкриті)
- [ ] **PM2 автостарт** (pm2 startup виконано, виживає після reboot)
- [ ] **Бекап коду** (git push або архів проєкту збережено)

### Додаткова документація для конкурсу

1. **Скріншоти для заявки:**
   - Крок 1 (світла тема)
   - Крок 7 з перегляду резюме
   - Готовий PDF Lebenslauf
   - Опитування після скачування

2. **Метрики для звіту:**
   - Кількість згенерованих резюме (`SELECT COUNT(*) FROM leads`)
   - Середній рейтинг задоволеності (`SELECT AVG(rating) FROM feedback`)
   - Найпопулярніші навички (якщо зберігались у структурованому вигляді)

3. **Технічний опис:**
   - Використано: React 18, Vite, Tailwind CSS, Telegram Mini Apps SDK
   - Бекенд: Node.js, Express, SQLite (better-sqlite3)
   - Деплой: Ubuntu VPS, Nginx, PM2, Let's Encrypt SSL
   - PDF: Client-side через window.print() (вибірний текст, без OCR)

---

## Крок 7: Усунення проблем (troubleshooting)

### Проблема 1: Mini App не відкривається в Telegram

**Симптом:** Кнопка Menu Button сіра або показує помилку "WebApp not available"

**Рішення:**
1. Перевірте, чи домен працює через HTTPS:
   ```bash
   curl -I https://cv.yourngo.at/
   # Має бути статус 200 і заголовок з сертифікатом
   ```
2. Перевірте, чи BotFather прийняв URL (має бути HTTPS, не самопідписаний)
3. Спробуйте `/deleteapp` та `/newapp` заново в BotFather

### Проблема 2: Білий екран або помилка в консолі

**Симптом:** Mini App відкривається, але показує білий екран

**Рішення:**
1. Відкрийте Telegram Desktop або Web (telegram.org/k) — там є DevTools
2. Правою кнопкою на Mini App → "Inspect Element" → Console
3. Подивіться на помилки:
   - `Telegram is not defined` → не підключився SDK, перевірте `index.html`
   - `Failed to fetch /api/health` → бекенд не працює, перевірте PM2
   - CORS error → Nginx неправильно налаштований

### Проблема 3: PDF не скачується

**Симптом:** Кнопка "Завантажити PDF" нічого не робить

**Рішення:**
1. iOS Telegram: `window.print()` відкриває діалог друку → натисніть "Share" → "Save as PDF"
2. Android Telegram: має автоматично завантажитись через jsPDF fallback
3. Перевірте консоль браузера — можливо, помилка в jsPDF (забракло шрифтів)

### Проблема 4: Бекенд падає або не зберігає ліди

**Симптом:** `/api/leads` повертає 500 або дані не з'являються в SQLite

**Рішення:**
```bash
# Перевірте логи PM2
pm2 logs fachkraft-cv-backend --lines 50

# Перезапустіть бекенд
pm2 restart fachkraft-cv-backend

# Перевірте права на папку data/
ls -la /var/www/fachkraft-cv-kompass-backend/data/
# Має бути sqlite3-файл, власник — користувач, під яким запущено PM2
```

### Проблема 5: Certbot не випустив сертифікат

**Симптом:** `sudo certbot --nginx -d cv.yourngo.at` повертає помилку

**Рішення:**
1. Перевірте DNS: `nslookup cv.yourngo.at` → має показати IP сервера
2. Перевірте, чи порт 80 відкритий: `sudo ufw status` → має бути `80/tcp ALLOW`
3. Перевірте, чи Nginx слухає 80: `sudo netstat -tlnp | grep :80`
4. Спробуйте manual mode:
   ```bash
   sudo certbot certonly --manual -d cv.yourngo.at
   # Слідуйте інструкціям (challenge через DNS або HTTP)
   ```

---

## Корисні посилання

- **Telegram Mini Apps документація:** https://core.telegram.org/bots/webapps
- **BotFather команди:** https://t.me/BotFather
- **Let's Encrypt troubleshooting:** https://letsencrypt.org/docs/
- **PM2 документація:** https://pm2.keymetrics.io/docs/usage/quick-start/
- **SQLite Browser (для перегляду бази):** https://sqlitebrowser.org/

---

## Підсумок: готовність до конкурсу

Після виконання всіх кроків вище ваш проєкт буде:

✅ **Функціональний** — працює в реальному Telegram як Mini App  
✅ **Безпечний** — HTTPS, firewall, PM2 автоперезапуск  
✅ **Готовий до звітності** — SQLite зберігає всі ліди та відгуки  
✅ **Масштабований** — Nginx + PM2 витримають 100+ одночасних користувачів  

**Наступний крок:** Подайте заявку на конкурс ОІФ з:
- Посиланням на бота в Telegram
- Демо-відео (screencast проходження всіх 7 кроків)
- Скріншотами резюме та статистики
- Цим README як технічною документацією

**Успіхів! 🚀🇺🇦**
