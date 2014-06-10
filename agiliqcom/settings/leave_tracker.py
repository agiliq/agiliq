AUTHENTICATION_BACKENDS = (
    'django_openid_auth.auth.OpenIDBackend',
    'django.contrib.auth.backends.ModelBackend',
)

# Should users be created when new OpenIDs are used to log in?
OPENID_CREATE_USERS = True

# When logging in again, should we overwrite user details based on
# data received via Simple Registration?
OPENID_UPDATE_DETAILS_FROM_SREG = True

# If set, always use this as the identity URL rather than asking the
# user.  This only makes sense if it is a server URL.
OPENID_SSO_SERVER_URL = 'https://google.com/accounts/o8/site-xrds?hd=agiliq.com'

# Tell django.contrib.auth to use the OpenID signin URLs.
LOGIN_URL = '/openid/login/'
LOGIN_REDIRECT_URL = '/'

# Should django_auth_openid be used to sign into the admin interface?
OPENID_USE_AS_ADMIN_LOGIN = False