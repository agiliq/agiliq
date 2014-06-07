# Merchant Demo

import os

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
