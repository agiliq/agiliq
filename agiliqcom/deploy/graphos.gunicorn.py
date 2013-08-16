import os

bind = "127.0.0.1:8001"
workers = (os.sysconf("SC_NPROCESSORS_ONLN") * 2) + 1
loglevel = "debug"
proc_name = "agiliq"
daemon = False
