from django.conf.urls.defaults import *

from agiliqpages.models import TeamMember
from django.views.generic.simple import direct_to_template
from django.views.generic.list_detail import object_list

from django.views.decorators.cache import cache_page
ONE_DAY = 60 * 60 * 24



def cache(page):
    return cache_page(page, ONE_DAY)

cached_direct_to_template = cache(direct_to_template)
cached_object_list = cache(object_list)


urlpatterns = patterns('',
    url('^$', 
		cached_direct_to_template, 
		{'template': 'agiliqpages/index.html',
		 'extra_context': {'sitepage': 'home'},
		}, 
		name='agiliqpages_index'),
    url('^whatwedo$', 
		cached_direct_to_template, 
		{'template': 'agiliqpages/whatwedo.html', 
		 'extra_context': {'sitepage': 'whatwedo'},
		}, 
		name='agiliqpages_whatwedo'),
)

# using object_list will not cache the queryset
# if team list is passed to direct_to_template as
# a variable then the queryset will be cached
urlpatterns += patterns('',
	url('^whoweare$', 
	 	cached_object_list, 
	 	{'queryset': TeamMember.objects.all().order_by('ordering'),
	     'template_name': 'agiliqpages/whoweare.html',
	 	 'extra_context': {'sitepage': 'whoweare'}
	 	}, 
	 	name='agiliqpages_whoweare'),
)

urlpatterns += patterns('agiliqpages.views',
    url('^contactus$', 'contact_us', {"template": "agiliqpages/contactus.html"}, name='agiliqpages_contactus'),
	url('^ourwork$', 'our_work', {'template': 'agiliqpages/ourwork.html'}, name='agiliqpages_ourwork'),
)