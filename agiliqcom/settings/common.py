import os
import sys
SITE_ROOT = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

DEBUG = False
TEMPLATE_DEBUG = True

ADMINS = (
    ('Agiliq', 'hello@agiliq.com'),
)

MANAGERS = ADMINS

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

TEMPLATE_DIRS = (
    os.path.join(SITE_ROOT, "templates/"),
)

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = os.path.join(SITE_ROOT, 'media/')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/media/'


STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(SITE_ROOT, 'static/')


# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/media/'

EMAIL_BACKEND = "mailer.backend.DbBackend"

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
	'django.contrib.auth.context_processors.auth',
	'django.core.context_processors.debug',
	'django.core.context_processors.i18n',
	'django.core.context_processors.media',
	'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.request',
    'django.core.context_processors.static'
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.contrib.redirects.middleware.RedirectFallbackMiddleware',
    'django.contrib.flatpages.middleware.FlatpageFallbackMiddleware',
    'pagination.middleware.PaginationMiddleware'
)

ROOT_URLCONF = 'agiliqcom.urls'

STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    'compressor.finders.CompressorFinder',
    )


INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.redirects',
    'django.contrib.sessions',
    'django.contrib.sitemaps',
    'django.contrib.sites',
    'django.contrib.messages',
	'django.contrib.humanize',
	'django.contrib.markup',
    'django.contrib.flatpages',
    'django.contrib.staticfiles',
    'django.contrib.comments',

    #Our Apps
    'agiliqpages',
    'blogango',
    'graphosdemo',
    'graphos',
    'parsleydemo',
    'parsley',
    'app',
    'billing',
    'paypal.pro',
    'dinette',
    'leave_tracker',
    'exapp',

    #Third Party apps
    'crispy_forms',
    'compressor',
	'mailer',
    'pingback',
    'django_xmlrpc',
    'taggit',
    'sorl.thumbnail',
    'pagination',
    'south',
    'django_wysiwyg',
    'django_coverage',
    'raven.contrib.django.raven_compat',
    'django_openid_auth',
)

PROJECT_APPS = ('agiliqpages', 'blogango', 'dinette')

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
}

BACKEND_ENGINE = "django.contrib.sessions.backends.cache"

SEND_BROKEN_LINK_EMAILS = False
EMAIL_SUBJECT_PREFIX = '[Agiliq] '

DEFAULT_FROM_EMAIL = 'Agiliq.com <hello@agiliq.com>'
# The e-mail address that error messages come from
SERVER_EMAIL = 'hello@agiliq.com'

CACHE_DURATION = 60 * 60 * 24

# Dinette Settings
AUTH_PROFILE_MODULE = 'dinette.DinetteUserProfile'



LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'formatters': {
        'verbose': {
            'format': '[DJANGO] %(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'console':{
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },

    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        "": {
            "handlers": ["console"],
            'level': 'INFO',
            'propagate': True,
            'stream': sys.stdout
        }
    }
}

THUMBNAIL_FORMAT = "PNG"

#Site URL
SITE_URL = "https://agiliq.com/"

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'agiliq.com', '.agiliq.com', ]

LOGIN_URL  = "/login"
LOGIN_REDIRECT_URL = '/'


from .merchant_demo import *
from .dinnete_demo import *
from .leave_tracker import *
