from django.conf.urls.defaults import *

from agiliqpages.models import TeamMember

urlpatterns = patterns('django.views.generic.simple',
    url('^$', 
		'direct_to_template', 
		{'template': 'agiliqpages/index.html',
		 'extra_context': {'sitepage': 'home'},
		}, 
		name='agiliqpages_index'),
    url('^whatwedo$', 
		'direct_to_template', 
		{'template': 'agiliqpages/whatwedo.html', 
		 'extra_context': {'sitepage': 'whatwedo'},
		}, 
		name='agiliqpages_whatwedo'),
)

# using object_list will not cache the queryset
# if team list is passed to direct_to_template as
# a variable then the queryset will be cached
urlpatterns += patterns('django.views.generic.list_detail',
	url('^whoweare$', 
	 	'object_list', 
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