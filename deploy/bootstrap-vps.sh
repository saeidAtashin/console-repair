#!/bin/bash
set -euo pipefail

APP_DIR="/root/fixbazi"
REPO_URL="https://github.com/saeidAtashin/console-repair.git"
BRANCH="fixbazi-deploy"

echo "==> Checking Docker..."
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
fi

echo "==> Configuring GitHub deploy key..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh
if [ ! -f ~/.ssh/github_fixbazi ]; then
  ssh-keygen -t ed25519 -f ~/.ssh/github_fixbazi -N "" -C "fixbazi-vps-deploy"
  echo "Add this deploy key to GitHub repo Settings -> Deploy keys (read-only):"
  cat ~/.ssh/github_fixbazi.pub
fi
ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null
chmod 600 ~/.ssh/known_hosts
cat > ~/.ssh/config <<'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_fixbazi
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config

echo "==> Cloning or updating repo..."
if [ ! -d "$APP_DIR/.git" ]; then
  git clone -b "$BRANCH" git@github.com:saeidAtashin/console-repair.git "$APP_DIR"
else
  cd "$APP_DIR"
  git remote set-url origin git@github.com:saeidAtashin/console-repair.git
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
fi

cd "$APP_DIR"

echo "==> Creating .env if missing..."
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://fixbazi.ir|' .env
  echo "Created .env from .env.example — edit ADMIN_PASSWORD before going live."
fi

echo "==> Building and starting container..."
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

echo "==> Configuring nginx..."
if command -v nginx >/dev/null 2>&1; then
  cp deploy/nginx/fixbazi.ir.conf /etc/nginx/sites-available/fixbazi.ir
  ln -sf /etc/nginx/sites-available/fixbazi.ir /etc/nginx/sites-enabled/fixbazi.ir
  nginx -t
  systemctl reload nginx
  echo "nginx configured. Run certbot --nginx -d fixbazi.ir -d www.fixbazi.ir for SSL."
else
  echo "nginx not installed — install nginx and re-run the nginx section manually."
fi

echo "==> Done. App should be reachable on http://127.0.0.1:3001"
