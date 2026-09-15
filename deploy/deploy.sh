#!/usr/bin/env bash
# Скрипт первинного розгортання Fachkraft CV-Kompass на Ubuntu VPS (Contabo).
# Запускати від імені root або через sudo. Читайте DEPLOY.md для контексту.
#
# ПЕРЕД ЗАПУСКОМ:
#   1. Домен/піддомен вже має A-запис, що вказує на IP цього сервера.
#   2. Змінна DOMAIN нижче виставлена на цей домен.
#   3. Репозиторій проєкту вже склоновано або скопійовано на сервер
#      (наприклад у /var/www/fachkraft-cv-kompass-src).

set -euo pipefail

DOMAIN="your-domain.example.com"          # <-- ЗАМІНІТЬ на реальний домен
SRC_DIR="/var/www/fachkraft-cv-kompass-src"   # де лежить вихідний код (git clone)
WEB_ROOT="/var/www/fachkraft-cv-kompass"      # куди піде production-білд фронтенда
BACKEND_DIR="/var/www/fachkraft-cv-kompass-backend"

echo "== 1/8: Оновлення пакетів системи =="
apt-get update -y
apt-get upgrade -y

echo "== 2/8: Встановлення Node.js 20 LTS =="
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v
npm -v

echo "== 3/8: Встановлення Nginx, Certbot, PM2, git, build-essential =="
apt-get install -y nginx certbot python3-certbot-nginx git build-essential
npm install -g pm2

echo "== 4/8: Firewall (ufw) — відкриваємо лише 22/80/443 =="
apt-get install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status

echo "== 5/8: Збірка фронтенда =="
cd "$SRC_DIR/frontend"
npm ci
npm run build
mkdir -p "$WEB_ROOT"
rsync -a --delete "$SRC_DIR/frontend/dist/" "$WEB_ROOT/dist/"

echo "== 6/8: Розгортання бекенда =="
mkdir -p "$BACKEND_DIR"
rsync -a --delete --exclude node_modules --exclude data "$SRC_DIR/backend/" "$BACKEND_DIR/"
cd "$BACKEND_DIR"
npm ci --omit=dev
mkdir -p data

echo "== 7/8: Запуск бекенда через PM2 =="
pm2 delete fachkraft-cv-backend 2>/dev/null || true
pm2 start server.js --name fachkraft-cv-backend --cwd "$BACKEND_DIR"
pm2 save
pm2 startup systemd -u root --hp /root | tail -n 1 | bash || true

echo "== 8/8: Налаштування Nginx + SSL =="
sed "s/your-domain.example.com/${DOMAIN}/g" "$SRC_DIR/deploy/nginx.conf" \
  > /etc/nginx/sites-available/fachkraft-cv-kompass
ln -sf /etc/nginx/sites-available/fachkraft-cv-kompass /etc/nginx/sites-enabled/fachkraft-cv-kompass
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Видає та підключає безкоштовний сертифікат Let's Encrypt,
# автоматично дописує SSL-блок у конфіг Nginx і редірект з 80 на 443.
certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m admin@"${DOMAIN}" || \
  echo "Certbot не відпрацював автоматично — запустіть 'certbot --nginx -d ${DOMAIN}' вручну."

echo ""
echo "Готово. Перевірте:"
echo "  https://${DOMAIN}/          — фронтенд"
echo "  https://${DOMAIN}/api/health — бекенд"
echo "Далі: прив'яжіть цей HTTPS-URL у BotFather (див. DEPLOY.md, розділ 5)."
