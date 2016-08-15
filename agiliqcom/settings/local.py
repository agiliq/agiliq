from .common import *

import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'febin',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                   # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                    # Set to empty string for default. Not used with sqlite3.
    }
}

DEBUG = True
TEMPLATE_DEBUG = DEBUG

BACKTYPE_API_KEY = ''

# Make this unique, and don't share it with anybody.
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") or '7832hjghghjhggj'
