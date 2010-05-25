from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template


urlpatterns = patterns('agiliqpages.views',

    url('^$', direct_to_template, {"template": "agiliqpages/index.html"}, name='agiliqpages_index'),
    url('^contactus$', direct_to_template, {"template": "agiliqpages/contactus.html"}, name='agiliqpages_contactus'),
    url('^ourwork$', direct_to_template, {"template": "agiliqpages/ourwork.html"}, name='agiliqpages_ourwork'),
    url('^whatwedo$', direct_to_template, {"template": "agiliqpages/whatwedo.html"}, name='agiliqpages_whatwedo'),
    url('^whoweare$', direct_to_template, {"template": "agiliqpages/whoweare.html"}, name='agiliqpages_whoweare'),
    
    )