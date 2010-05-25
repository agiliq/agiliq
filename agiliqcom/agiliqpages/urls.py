from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template


urlpatterns = patterns('agiliqpages.views',

    url('^$', direct_to_template, {"template": "agiliqpages/index.html"}, name='agiliqpages_index'),
    url('^contactus$', direct_to_template, {"template_name": "agiliqpages/contactus.html"}, name='agiliqpages_index'),
    url('^ourwork$', direct_to_template, {"template_name": "agiliqpages/ourwork.html"}, name='agiliqpages_index'),
    url('^whatwedo$', direct_to_template, {"template_name": "agiliqpages/whatwedo.html"}, name='agiliqpages_index'),
    url('^whoweare$', direct_to_template, {"template_name": "agiliqpages/whoweare.html"}, name='agiliqpages_index'),
    
    )