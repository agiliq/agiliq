import os
SITE_ROOT = os.path.dirname(os.path.realpath(__file__))


DEBUG = True
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
MEDIA_URL = '/site_media/'
STATIC_URL = "/static/"
STATIC_ROOT = "/home/shabda/repos/agiliqdotcom/agiliqdotcom/agiliqcom/static/"

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/media/'

EMAIL_BACKEND = 'mailer.backends.DbBackend'

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'os683(ah9+!==97gy3e9=81d=o(gs&!=#^2!&538sc%@#$hhu*'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
	'django.template.loaders.app_directories.Loader',
    'django.template.loaders.filesystem.Loader',

#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
	'django.contrib.auth.context_processors.auth',
	'django.core.context_processors.debug',
	'django.core.context_processors.i18n',
	'django.core.context_processors.media',
	'django.contrib.messages.context_processors.messages',
    'socialauth.context_processors.facebook_api_key',
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
		'dinette.middleware.UserActivity',
    'openid_consumer.middleware.OpenIDMiddleware',
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
    'agiliqpages',
    'blogango',
    'compressor',
	  'mailer',
    'pingback',
    'django_xmlrpc',
    'taggit',
    #'dinette',
    'socialauth',
    'openid_consumer',
    'sorl.thumbnail',
    'pagination',
    'south',
    'google_analytics',
    'pystories',
    'haystack',
	# 'registration',
)

SEND_BROKEN_LINK_EMAILS = False
EMAIL_SUBJECT_PREFIX = '[Agiliq] '

DEFAULT_FROM_EMAIL = 'Agiliq.com <webmaster@agiliq.com>'
# The e-mail address that error messages come from
SERVER_EMAIL = 'developer@agiliq.com'

TWITTER_FOLLOW = ('agiliqdotcom', 'uswaretech')

TWITTER_API_USER = 'agiliqtest'
TWITTER_API_PASSW = ''

CACHE_DURATION = 60 * 60 * 24

# Dinette Settings
import os
from django.conf import global_settings

AUTH_PROFILE_MODULE = 'dinette.DinetteUserProfile'

RANKS_NAMES_DATA = ((30, "Member"), (100, "Senior Member"), (300, 'Star'))

DINETTE_LOGIN_TEMPLATE = 'dinette/social_login.html'

#LOG_FILE_PATH in django
LOG_FILE_PATH = "\""+os.path.join(os.path.join(SITE_ROOT,'logs'),"logs.txt")+"\""

#LOG FILE NAME In django
logfilename =  os.path.join(SITE_ROOT,'logging.conf')
LOG_FILE_NAME = logfilename

FLOOD_TIME = 10

import os

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        'PATH': os.path.join(os.path.dirname(__file__), 'whoosh_index'),
    },
}

#Site URL
SITE_URL = "http://agiliq.com/"

# FEED_URL = 'http://feeds.feedburner.com/uswarearticles'


from localsettings import *
