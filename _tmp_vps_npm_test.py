import paramiko
import os

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    "185.204.197.187",
    username="root",
    password=os.environ["VPS_PASS"],
    timeout=30,
)
cmd = (
    'docker run --rm node:22-alpine sh -c '
    '"npm -v; npm ping; '
    'timeout 120 npm install lodash --omit=dev --no-audit --fund=false; '
    'echo EXIT:$?"'
)
stdin, stdout, stderr = client.exec_command(cmd, timeout=180)
print(stdout.read().decode(errors="replace"))
print(stderr.read().decode(errors="replace")[-2500:])
print("exit", stdout.channel.recv_exit_status())
client.close()
