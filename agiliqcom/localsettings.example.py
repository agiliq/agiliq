
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'dev.db',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}



REPLY_PAGE_SIZE = 10
DEBUG = True
TEMPLATE_DEBUG = DEBUG

# Django-Socialauth settings
LOGIN_REDIRECT_URL = '/forum/'
LOGOUT_REDIRECT_URL = '/'
LOGIN_URL = '/socialauth/login/'

OPENID_REDIRECT_NEXT = '/socialauth/openid/done/'

OPENID_SREG = {"requred": "nickname, email, fullname",
               "optional":"postcode, country",
               "policy_url": ""}

#example should be something more like the real thing, i think
OPENID_AX = [{"type_uri": "http://axschema.org/contact/email",
              "count": 1,
              "required": True,
              "alias": "email"},
             {"type_uri": "http://axschema.org/schema/fullname",
              "count":1 ,
              "required": False,
              "alias": "fname"}]

OPENID_AX_PROVIDER_MAP = {'Google': {'email': 'http://axschema.org/contact/email',
                                     'firstname': 'http://axschema.org/namePerson/first',
                                     'lastname': 'http://axschema.org/namePerson/last'},
                          'Default': {'email': 'http://axschema.org/contact/email',
                                      'fullname': 'http://axschema.org/namePerson',
                                      'nickname': 'http://axschema.org/namePerson/friendly'}
                          }

TWITTER_CONSUMER_KEY = ''
TWITTER_CONSUMER_SECRET = ''

FACEBOOK_APP_ID = ''
FACEBOOK_API_KEY = ''
FACEBOOK_SECRET_KEY = ''

LINKEDIN_CONSUMER_KEY = ''
LINKEDIN_CONSUMER_SECRET = ''

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'socialauth.auth_backends.OpenIdBackend',
    'socialauth.auth_backends.TwitterBackend',
    'socialauth.auth_backends.FacebookBackend',
    'socialauth.auth_backends.LinkedInBackend',
)

BACKTYPE_API_KEY = ''

import markdown
from docutils.core import publish_parts

def render_rest(markup):
    parts = publish_parts(source=markup, writer_name="html4css1")
    return parts["fragment"]

#MARKUP_FIELD_TYPES = (
#    ('markdown', markdown.markdown),
#    ('ReST', render_rest),
#)

#MARKUP_RENDERERS = []

from markupfield.markup import DEFAULT_MARKUP_TYPES
from dinette.libs.postmarkup import render_bbcode

DEFAULT_MARKUP_TYPES.append(('bbcode', render_bbcode))
MARKUP_RENDERERS = DEFAULT_MARKUP_TYPES

DEFAULT_MARKUP_TYPE = "markdown"

TWITTER_API_USER = 'agiliqtest'
TWITTER_API_PASSW = ''
