import os

bind = "127.0.0.1:8004"
workers = os.sysconf("SC_NPROCESSORS_ONLN") + 1
loglevel = "debug"
proc_name = "agiliq"
daemon = False
