import os

bind = "unix:/tmp/nginx.socket"
os.system("touch /tmp/app-initialized")
