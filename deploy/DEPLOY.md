# Деплой Fachkraft CV-Kompass на VPS (Contabo, Ubuntu)

Ця інструкція розрахована на чистий Ubuntu 22.04/24.04 VPS.

## 0. Що вам знадобиться заздалегідь

- **Домен або піддомен**, A-запис якого вказує на IP вашого VPS
  (наприклад `cv.yourngo.at` → `1.2.3.4`). Без домена Telegram Mini App
  та Let's Encrypt SSL не запрацюють — Telegram вимагає саме HTTPS-URL
  з дійсним сертифікатом, IP-адреси недостатньо.
- Доступ по SSH до сервера з правами root/sudo.
- Токен бота, отриманий від [@BotFather](https://t.me/BotFather)
  (`/newbot`, якщо бота ще немає).

## 1. Підготовка коду на сервері

```bash
ssh root@YOUR_SERVER_IP

# Клонуємо репозиторій (або завантажуємо архів проєкту)
git clone <URL_ВАШОГО_РЕПОЗИТОРІЮ> /var/www/fachkraft-cv-kompass-src
cd /var/www/fachkraft-cv-kompass-src
```

Якщо репозиторію ще немає — просто скопіюйте папку проєкту на сервер
через `scp` або `rsync` у `/var/www/fachkraft-cv-kompass-src`.

## 2. Автоматичне розгортання

Відредагуйте змінну `DOMAIN` на початку `deploy/deploy.sh`, вкативши свій
домен, потім запустіть:

```bash
cd /var/www/fachkraft-cv-kompass-src
chmod +x deploy/deploy.sh
sudo ./deploy/deploy.sh
```

Скрипт зробить усе по черзі:

1. Оновить систему.
2. Встановить Node.js 20 LTS.
3. Встановить Nginx, Certbot, PM2, git, build-essential.
4. Налаштує `ufw` — відкриє **лише** порти 22 (SSH), 80 (HTTP), 443 (HTTPS).
5. Збере production-білд фронтенда (`npm run build`) і покладе його
   у `/var/www/fachkraft-cv-kompass/dist`.
6. Розгорне бекенд у `/var/www/fachkraft-cv-kompass-backend` і запустить
   його через PM2 (автоперезапуск при падінні чи ребуті сервера).
7. Налаштує Nginx як reverse proxy (`/` → статика фронтенда,
   `/api/` → бекенд на порту 4000).
8. Випустить безкоштовний SSL-сертифікат через Certbot і налаштує
   автоматичний редірект з HTTP на HTTPS.

### Якщо якийсь крок впав — ручні команди

**Nginx + Certbot вручну:**

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/fachkraft-cv-kompass
sudo sed -i "s/your-domain.example.com/ВАШ_ДОМЕН/g" \
  /etc/nginx/sites-available/fachkraft-cv-kompass
sudo ln -sf /etc/nginx/sites-available/fachkraft-cv-kompass /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d ВАШ_ДОМЕН
```

**PM2 вручну:**

```bash
cd /var/www/fachkraft-cv-kompass-backend
npm ci --omit=dev
pm2 start server.js --name fachkraft-cv-backend
pm2 save
pm2 startup systemd   # виконати команду, яку виведе pm2
```

**Firewall вручну:**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

## 3. Перевірка після деплою

```bash
curl https://ВАШ_ДОМЕН/api/health
# Очікувано: {"status":"ok", ...}
```

Відкрийте `https://ВАШ_ДОМЕН/` у браузері — має завантажитись wizard
(поза Telegram працює на fallback-кольорах navy/amber).

## 4. Оновлення після змін у коді

```bash
cd /var/www/fachkraft-cv-kompass-src
git pull

cd frontend && npm ci && npm run build
rsync -a --delete dist/ /var/www/fachkraft-cv-kompass/dist/

cd ../backend && npm ci --omit=dev
rsync -a --delete --exclude node_modules --exclude data ./ /var/www/fachkraft-cv-kompass-backend/
pm2 restart fachkraft-cv-backend
```

## 5. Підключення до Telegram через BotFather

1. Відкрийте чат з [@BotFather](https://t.me/BotFather).
2. Якщо бота ще нема: `/newbot` → задайте ім'я та username.
3. Прив'язка Mini App до бота — командою `/newapp`:
   - Оберіть свого бота зі списку.
   - Введіть назву застосунку (наприклад "CV-Kompass").
   - Завантажте іконку (512×512, png).
   - Введіть опис.
   - **Web App URL**: `https://ВАШ_ДОМЕН/` — обов'язково HTTPS,
     самопідписані сертифікати Telegram не прийме, тому крок з
     Certbot (розділ 2, пункт 8) є обов'язковим.
4. Щоб застосунок відкривався кнопкою поруч із полем вводу
   (замість команди) — `/setmenubutton`:
   - Оберіть бота.
   - Введіть той самий HTTPS-URL.
   - Введіть текст кнопки, наприклад "Скласти резюме".
5. Перевірте: відкрийте бота в Telegram, натисніть кнопку меню —
   має відкритись wizard, тема має підхопити кольори теми Telegram
   (світла/темна) завдяки `Telegram.WebApp.themeParams`.

## 6. Де лежать дані для звіту гранту

SQLite-файл: `/var/www/fachkraft-cv-kompass-backend/data/cv-kompass.sqlite3`.

Швидкий підсумок без встановлення додаткових утиліт:

```bash
# встановіть STATS_TOKEN у PM2-оточенні заздалегідь (env файл або
# `pm2 set` / передача через `pm2 start server.js --name ... --update-env`
# з STATS_TOKEN=... у середовищі)
curl "https://ВАШ_ДОМЕН/api/stats?token=ВАШ_STATS_TOKEN"
```

Або напряму через `sqlite3` CLI:

```bash
sqlite3 /var/www/fachkraft-cv-kompass-backend/data/cv-kompass.sqlite3 \
  "SELECT COUNT(*) FROM leads;"
```

## 7. Обмеження цього MVP (навмисно, за ТЗ)

- Немає оплати/paywall.
- Немає особистого кабінету — стан заповнення живе лише в пам'яті
  поточної сесії застосунку (не зберігається між перезаходами).
- Лише одна професія (Lagerarbeiter) і одна мовна пара
  (інтерфейс UA → резюме DE).
- Статистика (`/api/stats`) захищена спрощеним токеном, а не повноцінною
  автентифікацією — прийнятно для внутрішнього звіту гранту, але перед
  публічним розкриттям ендпоінту варто додати нормальну авторизацію.
