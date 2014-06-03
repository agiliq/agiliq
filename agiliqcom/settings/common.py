import os
import sys
SITE_ROOT = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

DEBUG = False
TEMPLATE_DEBUG = True

ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
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
STATICFILES_DIRS = (
    os.path.join(SITE_ROOT, 'static_seed/'),
)

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
    'demo',
    'graphos',
    'app',
    'billing',
    'paypal.pro',
    'dinette',

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
    'raven.contrib.django.raven_compat'
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

DEFAULT_FROM_EMAIL = 'Agiliq.com <webmaster@agiliq.com>'
# The e-mail address that error messages come from
SERVER_EMAIL = 'developer@agiliq.com'

CACHE_DURATION = 60 * 60 * 24

# Dinette Settings
AUTH_PROFILE_MODULE = 'dinette.DinetteUserProfile'

RANKS_NAMES_DATA = ((30, "Member"), (100, "Senior Member"), (300, 'Star'))

DINETTE_LOGIN_TEMPLATE = 'dinette/social_login.html'

FLOOD_TIME = 10

REPLY_PAGE_SIZE = 10

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
            'level': 'DEBUG',
            'propagate': True,
            'stream': sys.stdout
        }
    }
}

THUMBNAIL_FORMAT = "PNG"

#Site URL
SITE_URL = "http://agiliq.com/"

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'agiliq.com', '.agiliq.com', ]

from markupfield.markup import DEFAULT_MARKUP_TYPES
from dinette.libs.postmarkup import render_bbcode

DEFAULT_MARKUP_TYPES.append(('bbcode', render_bbcode))
MARKUP_RENDERERS = DEFAULT_MARKUP_TYPES

LOGIN_URL  = "/login"
LOGIN_REDIRECT_URL = '/'

# Merchant Demo
MERCHANT_ID = ""
if 'beanstream_MERCHANT_ID' in os.environ:
    MERCHANT_ID = int(os.environ.get('beanstream_MERCHANT_ID'))
MERCHANT_TEST_MODE = True
MERCHANT_SETTINGS = {
    "authorize_net": {
        "LOGIN_ID" : os.environ.get('authorize_net_LOGIN_ID') or "",
        "TRANSACTION_KEY" : os.environ.get('authorize_net_TRANSACTION_KEY') or "" ,
        "MD5_HASH": os.environ.get('authorize_net_MD5_HASH') or ""
    },

    "pay_pal": {
        "WPP_USER" : os.environ.get('pay_pal_WPP_USER') or "" ,
        "WPP_PASSWORD" : os.environ.get('pay_pal_WPP_PASSWORD') or "" ,
        "WPP_SIGNATURE" : os.environ.get('pay_pal_WPP_SIGNATURE') or "" ,
        "RECEIVER_EMAIL" : os.environ.get('pay_pal_RECEIVER_EMAIL') or "",
        },

    "eway": {
        "CUSTOMER_ID" : os.environ.get('eway_CUSTOMER_ID') or "",
        "USERNAME" : os.environ.get('eway_USERNAME') or "" ,
        "PASSWORD" : os.environ.get('eway_PASSWORD') or ""
        },

    "google_checkout": {
        # GOOGLE CHECKOUT SETTINGS
        "MERCHANT_ID" : os.environ.get('google_checkout_MERCHANT_ID') or "" ,
        "MERCHANT_KEY" : os.environ.get('google_checkout_MERCHANT_KEY') or ""
        },

    "world_pay": {
        # WORLDPAY settings
        "HOSTED_URL_TEST": os.environ.get('world_pay_HOSTED_URL_TEST') or "https://select-test.wp3.rbsworldpay.com/wcc/purchase",
        "HOSTED_URL_LIVE" : os.environ.get('world_pay_HOSTED_URL_LIVE') or "https://secure.wp3.rbsworldpay.com/wcc/purchase",
        "INSTALLATION_ID_TEST": os.environ.get('world_pay_INSTALLATION_ID_TEST') ,
        "MD5_SECRET_KEY": os.environ.get('world_pay_MD5_SECRET_KEY') or ""
        },

    "stripe": {
        # Stripe settings
        "API_KEY" : os.environ.get('stripe_API_KEY') or "",
        "PUBLISHABLE_KEY" : os.environ.get('stripe_PUBLISHABLE_KEY') or ""
        },

    # Paylane Settings
    "paylane": {
        "USERNAME": os.environ.get('paylane_USERNAME') or "" ,
        "PASSWORD": os.environ.get('paylane_PASSWORD') or ""
        },

    "samurai": {
        # Samurai Merchant Key
        "MERCHANT_KEY" : os.environ.get('samurai_MERCHANT_KEY') or "" ,
        "MERCHANT_PASSWORD" : os.environ.get('samurai_MERCHANT_PASSWORD') or "",
        "PROCESSOR_TOKEN" : os.environ.get('samurai_PROCESSOR_TOKEN') or ""
        },

    "amazon_fps": {
        "AWS_ACCESS_KEY" : os.environ.get('amazon_fps_AWS_ACCESS_KEY') or "" ,
        "AWS_SECRET_ACCESS_KEY" : os.environ.get('amazon_fps_AWS_SECRET_ACCESS_KEY') or ""
        },

    "braintree_payments": {
        "MERCHANT_ACCOUNT_ID" : os.environ.get('braintree_payments_MERCHANT_ACCOUNT_ID') or "",
        "PUBLIC_KEY" : os.environ.get('braintree_payments_PUBLIC_KEY') or "" ,
        "PRIVATE_KEY" : os.environ.get('braintree_payments_PRIVATE_KEY') or ""
        },

    # WePay Settings
    "we_pay": {
        "CLIENT_ID": os.environ.get('we_pay_CLIENT_ID') or "" ,
        "CLIENT_SECRET": os.environ.get('we_pay_CLIENT_SECRET') or "",
        "ACCOUNT_ID": os.environ.get('we_pay_ACCOUNT_ID') or "" ,
        "ACCESS_TOKEN": os.environ.get('we_pay_ACCESS_TOKEN') or "" ,
    },
   "beanstream": {
        "MERCHANT_ID": MERCHANT_ID,
        "LOGIN_COMPANY": os.environ.get('beanstream_LOGIN_COMPANY') or "" ,
        "LOGIN_USER": os.environ.get('beanstream_LOGIN_USER') or "" ,
        "LOGIN_PASSWORD": os.environ.get('beanstream_LOGIN_PASSWORD') or ""  ,
        "HASH_ALGORITHM"   : os.environ.get('beanstream_HASH_ALGORITHM') or "" ,
        "HASHCODE"  : os.environ.get('beanstream_HASHCODE') or "" ,
        "PAYMENT_PROFILE_PASSCODE":"",
    },

    "chargebee": {
        "API_KEY": os.environ.get('chargebee_API_KEY') or "" ,
        "SITE": os.environ.get('chargebee_SITE') or ""
    },

    "bitcoin": {
        "RPCUSER": os.environ.get('bitcoin_RPCUSER') or "" ,
        "RPCPASSWORD": os.environ.get('bitcoin_RPCPASSWORD') or ""  ,
        "HOST": os.environ.get('bitcoin_HOST') or ""  ,
        "PORT": os.environ.get('bitcoin_PORT') or ""  ,
        "ACCOUNT": os.environ.get('bitcoin_ACCOUNT') or "" ,
    },

    "ogone_payments": {
        "SHA_PRE_SECRET": os.environ.get('ogone_payments_SHA_PRE_SECRET') or ""  ,
        "SHA_POST_SECRET": os.environ.get('ogone_payments_SHA_POST_SECRET') or "" ,
        "HASH_METHOD": os.environ.get('ogone_payments_HASH_METHOD') or ""  ,
        "PRODUCTION": not MERCHANT_TEST_MODE,
        "PSPID": os.environ.get('ogone_payments_PSPID') or "" ,
        "OGONE_TEST_URL": os.environ.get('ogone_payments_OGONE_TEST_URL') or 'https://secure.ogone.com/ncol/test/orderstandard.asp',
        "OGONE_PROD_URL": os.environ.get('ogone_payments_OGONE_PROD_URL') or 'https://secure.ogone.com/ncol/prod/orderstandard.asp'
    },

    "pin": {
        "SECRET": os.environ.get('pin_SECRET') or ""
    }
}

# PAYPAL SETTINGS
PAYPAL_TEST = True
PAYPAL_WPP_USER = os.environ.get('PAYPAL_WPP_USER')
PAYPAL_WPP_PASSWORD = os.environ.get('PAYPAL_WPP_PASSWORD')
PAYPAL_WPP_SIGNATURE = os.environ.get('PAYPAL_WPP_SIGNATURE')
PAYPAL_RECEIVER_EMAIL = os.environ.get('PAYPAL_RECEIVER_EMAIL')

