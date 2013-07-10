import logging

try:
    from .local import *
except ImportError as e:
    logging.warn("error importing local settings")
    logging.exception(e)
