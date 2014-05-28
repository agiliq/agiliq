import os

bind = "unix:/tmp/nginx.socket"
errorlog = '-'
loglevel = 'debug'
accesslog = '-'
os.system("touch /tmp/app-initialized")
