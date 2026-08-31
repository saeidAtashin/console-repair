#!/bin/bash
set -euo pipefail

APP_DIR="/root/shopghab"
VPS_IP="185.204.197.187"
CONF_SRC="$APP_DIR/deploy/nginx/shopghab.ir.conf"

echo "==> Installing nginx vhost for shopghab.ir"

if [ ! -f "$CONF_SRC" ]; then
  echo "Missing $CONF_SRC"
  echo "Copy deploy/nginx/shopghab.ir.conf onto the VPS first (or wait for a CI deploy that packs it)."
  exit 1
fi

if ! command -v nginx >/dev/null 2>&1; then
  echo "nginx is not installed. Install nginx, then re-run this script."
  exit 1
fi

cp "$CONF_SRC" /etc/nginx/sites-available/shopghab.ir
ln -sf /etc/nginx/sites-available/shopghab.ir /etc/nginx/sites-enabled/shopghab.ir
nginx -t
systemctl reload nginx
echo "nginx reloaded. shopghab.ir / www.shopghab.ir → 127.0.0.1:3002"

echo "==> Checking public DNS (must be $VPS_IP)"
dns_ok=1
for host in shopghab.ir www.shopghab.ir; do
  resolved="$(getent ahostsv4 "$host" 2>/dev/null | awk '{print $1; exit}' || true)"
  if [ "$resolved" = "$VPS_IP" ]; then
    echo "  $host → $resolved"
  else
    echo "  $host → ${resolved:-unresolved}  (expected $VPS_IP)"
    dns_ok=0
  fi
done

if [ "$dns_ok" -eq 1 ]; then
  echo "DNS is ready. Issue TLS with:"
  echo "  certbot --nginx -d shopghab.ir -d www.shopghab.ir"
else
  echo "DNS is not answering $VPS_IP yet. Do not run certbot until it does."
  echo "The app is already on http://127.0.0.1:3002 — the public name will work after DNS + this vhost."
fi
