import paramiko
import os
import sys
import time

sys.stdout.reconfigure(line_buffering=True)
key = paramiko.Ed25519Key.from_private_key_file(
    os.path.expanduser(r"~\.ssh\fixbazi_gha_deploy")
)
target_prefix = "67c6f75"


def check():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect("185.204.197.187", username="root", pkey=key, timeout=40)
    cmd = r"""
set +e
echo SHA=$(cat /root/fixbazi/DEPLOY_SHA)
echo CREATED=$(docker inspect fixbazi --format '{{.Created}}')
echo HTTP=$(curl -sI -o /dev/null -w '%{http_code}' http://127.0.0.1:3001/)
echo SERVER_MTIME=$(stat -c '%y' /root/fixbazi/.next/standalone/server.js)
echo SHA_MTIME=$(stat -c '%y' /root/fixbazi/DEPLOY_SHA)
tail -n 15 /var/log/auth.log | grep -E 'Accepted publickey|Disconnected' || true
"""
    _, out, err = c.exec_command(cmd, timeout=30)
    text = out.read().decode(errors="replace")
    c.close()
    return text


for i in range(20):
    print(f"--- poll {i} ---")
    try:
        text = check()
        print(text)
        for line in text.splitlines():
            if line.startswith("SHA=") and line[4:].startswith(target_prefix):
                print("CI_DEPLOY_OK")
                raise SystemExit(0)
    except SystemExit:
        raise
    except Exception as ex:
        print("ERR", ex)
    time.sleep(45)

print("TIMEOUT")
raise SystemExit(1)
