import os

bind = "unix:/tmp/nginx.socket"
errorlog = '-'
loglevel = 'info'
accesslog = '-'
os.system("touch /tmp/app-initialized")
