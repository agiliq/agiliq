import logging

try:
    from .local import *
except ImportError as e:
    logging.warn("error importing local settings")
    logging.exception(e)

if 'agiliq_heroku' in os.environ:
    try:
        from .heroku import *
    except ImportError as e:
        logging.warn("error importing local settings")
        logging.exception(e)
