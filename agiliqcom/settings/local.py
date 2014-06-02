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
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") or '7832hjghghjhggj'


# Merchant Demo

MERCHANT_TEST_MODE = True
MERCHANT_SETTINGS = {
    "authorize_net": {
        "LOGIN_ID" : os.environ.get('authorize_net_LOGIN_ID') ,
        "TRANSACTION_KEY" : os.environ.get('authorize_net_TRANSACTION_KEY') ,
        "MD5_HASH": os.environ.get('authorize_net_MD5_HASH')
    },

    "pay_pal": {
        "WPP_USER" : os.environ.get('pay_pal_WPP_USER') ,
        "WPP_PASSWORD" : os.environ.get('pay_pal_WPP_PASSWORD') ,
        "WPP_SIGNATURE" : os.environ.get('pay_pal_WPP_SIGNATURE') ,
        "RECEIVER_EMAIL" : os.environ.get('pay_pal_RECEIVER_EMAIL'),
        },

    "eway": {
        "CUSTOMER_ID" : os.environ.get('eway_CUSTOMER_ID'),
        "USERNAME" : os.environ.get('eway_USERNAME') ,
        "PASSWORD" : os.environ.get('eway_PASSWORD')
        },

    "google_checkout": {
        # GOOGLE CHECKOUT SETTINGS
        "MERCHANT_ID" : os.environ.get('google_checkout_MERCHANT_ID') ,
        "MERCHANT_KEY" : os.environ.get('google_checkout_MERCHANT_KEY')
        },

    "world_pay": {
        # WORLDPAY settings
        "HOSTED_URL_TEST": os.environ.get('world_pay_HOSTED_URL_TEST') ,
        "HOSTED_URL_LIVE" : os.environ.get('world_pay_HOSTED_URL_LIVE') ,
        "INSTALLATION_ID_TEST": os.environ.get('world_pay_INSTALLATION_ID_TEST') ,
        "MD5_SECRET_KEY": os.environ.get('world_pay_MD5_SECRET_KEY')
        },

    "stripe": {
        # Stripe settings
        "API_KEY" : os.environ.get('stripe_API_KEY'),
        "PUBLISHABLE_KEY" : os.environ.get('stripe_PUBLISHABLE_KEY')
        },

    # Paylane Settings
    "paylane": {
        "USERNAME": os.environ.get('paylane_USERNAME') ,
        "PASSWORD": os.environ.get('paylane_PASSWORD')
        },

    "samurai": {
        # Samurai Merchant Key
        "MERCHANT_KEY" : os.environ.get('samurai_MERCHANT_KEY') ,
        "MERCHANT_PASSWORD" : os.environ.get('samurai_MERCHANT_PASSWORD'),
        "PROCESSOR_TOKEN" : os.environ.get('samurai_PROCESSOR_TOKEN')
        },

    "amazon_fps": {
        "AWS_ACCESS_KEY" : os.environ.get('amazon_fps_AWS_ACCESS_KEY') ,
        "AWS_SECRET_ACCESS_KEY" : os.environ.get('amazon_fps_AWS_SECRET_ACCESS_KEY')
        },

    "braintree_payments": {
        "MERCHANT_ACCOUNT_ID" : os.environ.get('braintree_payments_MERCHANT_ACCOUNT_ID'),
        "PUBLIC_KEY" : os.environ.get('braintree_payments_PUBLIC_KEY') ,
        "PRIVATE_KEY" : os.environ.get('braintree_payments_PRIVATE_KEY')
        },

    # WePay Settings
    "we_pay": {
        "CLIENT_ID": os.environ.get('we_pay_CLIENT_ID') ,
        "CLIENT_SECRET": os.environ.get('we_pay_CLIENT_SECRET'),
        "ACCOUNT_ID": os.environ.get('we_pay_ACCOUNT_ID') ,
        "ACCESS_TOKEN": os.environ.get('we_pay_ACCESS_TOKEN') ,
    },
   "beanstream": {
        "MERCHANT_ID": int(os.environ.get('beanstream_MERCHANT_ID')) ,
        "LOGIN_COMPANY": os.environ.get('beanstream_LOGIN_COMPANY') ,
        "LOGIN_USER": os.environ.get('beanstream_LOGIN_USER') ,
        "LOGIN_PASSWORD": os.environ.get('beanstream_LOGIN_PASSWORD') ,
        "HASH_ALGORITHM"   : os.environ.get('beanstream_HASH_ALGORITHM'),
        "HASHCODE"  : os.environ.get('beanstream_HASHCODE'),
        "PAYMENT_PROFILE_PASSCODE":"",
    },

    "chargebee": {
        "API_KEY": os.environ.get('chargebee_API_KEY'),
        "SITE": os.environ.get('chargebee_SITE')
    },

    "bitcoin": {
        "RPCUSER": os.environ.get('bitcoin_RPCUSER'),
        "RPCPASSWORD": os.environ.get('bitcoin_RPCPASSWORD') ,
        "HOST": os.environ.get('bitcoin_HOST') ,
        "PORT": os.environ.get('bitcoin_PORT') ,
        "ACCOUNT": os.environ.get('bitcoin_ACCOUNT'),
    },

    "ogone_payments": {
        "SHA_PRE_SECRET": os.environ.get('ogone_payments_SHA_PRE_SECRET') ,
        "SHA_POST_SECRET": os.environ.get('ogone_payments_SHA_POST_SECRET'),
        "HASH_METHOD": os.environ.get('ogone_payments_HASH_METHOD') ,
        "PRODUCTION": not MERCHANT_TEST_MODE,
        "PSPID": os.environ.get('ogone_payments_PSPID'),
        "OGONE_TEST_URL": os.environ.get('ogone_payments_OGONE_TEST_URL') ,
        "OGONE_PROD_URL": os.environ.get('ogone_payments_OGONE_PROD_URL')
    },

    "pin": {
        "SECRET": os.environ.get('pin_SECRET')
    }
    }

# PAYPAL SETTINGS
PAYPAL_TEST = True
PAYPAL_WPP_USER = os.environ.get('PAYPAL_WPP_USER')
PAYPAL_WPP_PASSWORD = os.environ.get('PAYPAL_WPP_PASSWORD')
PAYPAL_WPP_SIGNATURE = os.environ.get('PAYPAL_WPP_SIGNATURE')
PAYPAL_RECEIVER_EMAIL = os.environ.get('PAYPAL_RECEIVER_EMAIL')


