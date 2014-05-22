from .common import *

import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'agiliq',                      # Or path to database file if using sqlite3.
        'USER': 'agiliq',                      # Not used with sqlite3.
        'PASSWORD': 'agiliq',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

DEBUG = True
TEMPLATE_DEBUG = DEBUG

BACKTYPE_API_KEY = ''

# Make this unique, and don't share it with anybody.
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") or ''


if 'agiliq_heroku' in os.environ:
    AWS_QUERYSTRING_AUTH = False
    AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
    AWS_STORAGE_BUCKET_NAME = os.environ['S3_BUCKET_NAME']

    STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

    MEDIA_URL = 'http://' + AWS_STORAGE_BUCKET_NAME + '.s3.amazonaws.com/media/'
    MEDIA_ROOT = ''

    import dj_database_url
    DATABASES['default'] =  dj_database_url.config()

    # Honor the 'X-Forwarded-Proto' header for request.is_secure()
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
