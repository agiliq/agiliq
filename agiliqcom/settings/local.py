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
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") or '6567duysgdu678w6e86wed'


if 'agiliq_heroku' in os.environ:
    AWS_QUERYSTRING_AUTH = False
    AWS_ACCESS_KEY_ID = 'AKIAJ6SQGD6SLKYH225Q'
    AWS_SECRET_ACCESS_KEY = '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'
    AWS_STORAGE_BUCKET_NAME = 'agiliq-media'

    STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

    MEDIA_ROOT = 'http://' + AWS_STORAGE_BUCKET_NAME + '.s3.amazonaws.com/media/'
    MEDIA_URL = '/media/'

    import dj_database_url
    DATABASES['default'] =  dj_database_url.config()

    # Honor the 'X-Forwarded-Proto' header for request.is_secure()
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
