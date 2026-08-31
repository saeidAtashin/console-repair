#!/usr/bin/env python3
"""One-shot VPS helpers for fixbazi deploy. Uses VPS_PASS env var."""
from __future__ import annotations

import os
import sys
import tarfile
import tempfile
from pathlib import Path

import paramiko

HOST = "185.204.197.187"
USER = "root"


def connect() -> paramiko.SSHClient:
    password = os.environ.get("VPS_PASS")
    if not password:
        raise SystemExit("VPS_PASS not set")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=password, timeout=30)
    return client


def run(client: paramiko.SSHClient, cmd: str, timeout: int = 600) -> tuple[int, str, str]:
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    return code, out, err


def cmd_inspect() -> None:
    client = connect()
    code, out, err = run(
        client,
        "docker ps --format 'table {{.Names}}\t{{.Ports}}\t{{.Status}}'; "
        "ss -tlnp | grep -E ':3001|:3000|:80|:443' || true; "
        "ls -la /root/fixbazi | head -20; "
        "docker compose -f /root/fixbazi/docker-compose.prod.yml ps 2>&1 || true",
    )
    print(out)
    if err.strip():
        print(err)
    print("exit", code)
    client.close()


def cmd_add_key(pub_path: str) -> None:
    pub = Path(pub_path).read_text(encoding="utf-8").strip()
    client = connect()
    sftp = client.open_sftp()
    try:
        with sftp.file("/root/.ssh/authorized_keys", "r") as f:
            existing = f.read().decode()
    except OSError:
        existing = ""
    if pub not in existing:
        with sftp.file("/root/.ssh/authorized_keys", "a") as f:
            if existing and not existing.endswith("\n"):
                f.write("\n")
            f.write(pub + "\n")
        print("KEY_ADDED")
    else:
        print("KEY_EXISTS")
    sftp.close()
    client.close()


def cmd_upload_and_start(repo: str) -> None:
    repo_path = Path(repo)
    needed = [
        repo_path / ".next" / "standalone",
        repo_path / ".next" / "static",
        repo_path / "public",
        repo_path / "Dockerfile.prod",
        repo_path / "docker-compose.prod.yml",
        repo_path / "deploy",
    ]
    for p in needed:
        if not p.exists():
            raise SystemExit(f"missing: {p}")

    print("Creating archive...")
    with tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False) as tmp:
        archive = Path(tmp.name)
    with tarfile.open(archive, "w:gz") as tar:
        tar.add(repo_path / ".next" / "standalone", arcname=".next/standalone")
        tar.add(repo_path / ".next" / "static", arcname=".next/static")
        tar.add(repo_path / "public", arcname="public")
        tar.add(repo_path / "Dockerfile.prod", arcname="Dockerfile.prod")
        tar.add(repo_path / "docker-compose.prod.yml", arcname="docker-compose.prod.yml")
        tar.add(repo_path / "deploy", arcname="deploy")
        env_example = repo_path / ".env.example"
        if env_example.exists():
            tar.add(env_example, arcname=".env.example")

    print(f"Archive size: {archive.stat().st_size / 1e6:.1f} MB")
    client = connect()
    sftp = client.open_sftp()
    remote_tar = "/tmp/fixbazi-deploy.tar.gz"
    print("Uploading...")
    sftp.put(str(archive), remote_tar)
    sftp.close()
    archive.unlink(missing_ok=True)

    script = r"""
set -e
mkdir -p /root/fixbazi
cd /root/fixbazi
tar -xzf /tmp/fixbazi-deploy.tar.gz
rm -f /tmp/fixbazi-deploy.tar.gz
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://fixbazi.ir|' .env
fi
if ! grep -q '^ADMIN_PASSWORD=' .env; then
  echo 'ADMIN_PASSWORD=FixBazi!Deploy2026' >> .env
elif grep -q '^ADMIN_PASSWORD=changeme$' .env; then
  sed -i 's/^ADMIN_PASSWORD=changeme$/ADMIN_PASSWORD=FixBazi!Deploy2026/' .env
fi
cp deploy/nginx/fixbazi.ir.conf /etc/nginx/sites-available/fixbazi.ir
ln -sf /etc/nginx/sites-available/fixbazi.ir /etc/nginx/sites-enabled/fixbazi.ir
nginx -t
systemctl reload nginx
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans
docker compose -f docker-compose.prod.yml ps
sleep 2
curl -sI -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:3001/ || true
"""
    print("Extracting and starting container...")
    code, out, err = run(client, script, timeout=600)
    print(out)
    if err.strip():
        print("STDERR:", err[-4000:])
    print("exit", code)
    client.close()
    if code != 0:
        raise SystemExit(code)


def cmd_certbot() -> None:
    client = connect()
    code, out, err = run(
        client,
        "certbot --nginx -d fixbazi.ir -d www.fixbazi.ir --non-interactive --agree-tos "
        "--register-unsafely-without-email --redirect 2>&1 || true; "
        "curl -sI -o /dev/null -w 'local3001 %{http_code}\n' http://127.0.0.1:3001/; "
        "curl -sI -o /dev/null -w 'host80 %{http_code}\n' -H 'Host: fixbazi.ir' http://127.0.0.1/; "
        "dig +short fixbazi.ir A || true",
        timeout=180,
    )
    print(out)
    if err.strip():
        print(err)
    print("exit", code)
    client.close()


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("usage: inspect | add-key <pub> | upload <repo> | certbot")
    action = sys.argv[1]
    if action == "inspect":
        cmd_inspect()
    elif action == "add-key":
        cmd_add_key(sys.argv[2])
    elif action == "upload":
        cmd_upload_and_start(sys.argv[2])
    elif action == "certbot":
        cmd_certbot()
    else:
        raise SystemExit(f"unknown action: {action}")


if __name__ == "__main__":
    main()
