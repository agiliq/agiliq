# heroku

from .common import *

import os
import dj_database_url


# Complain if this env key is not set
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") or ''


INSTALLED_APPS += ('storages',)

AWS_QUERYSTRING_AUTH = False
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID') or ""
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY') or ""
AWS_STORAGE_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME') or ""

#STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
DEFAULT_FILE_STORAGE = "storages.backends.s3boto.S3BotoStorage"

DATABASES = {}
DATABASES['default'] =  dj_database_url.config()

DEBUG = "DJANGO_DEBUG" in os.environ
COMPRESS_ENABLED = "DJANGO_COMPRESS" in os.environ

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ALLOWED_HOSTS += [".herokuapp.com"]

EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
