from django.conf.urls import *
from django.conf import settings

from agiliqpages.models import TeamMember
from agiliqpages.views import (CachedListView, CachedTemplateView, error_page,
                               UserCreationView)

urlpatterns = patterns('',
                       url('^$', CachedTemplateView.as_view(
                           template_name='agiliqpages/index.html', extra_context={'sitepage': 'home'}), name='agiliqpages_index'),
                       url('^registration/$', UserCreationView.as_view(), name='registration'),
                       url('^whatwedo$', CachedTemplateView.as_view(
                           template_name='agiliqpages/whatwedo.html', extra_context={'sitepage': 'whatwedo'}), name='agiliqpages_whatwedo'),
                       url('^whoweare$', CachedListView.as_view(template_name='agiliqpages/whoweare.html', queryset=TeamMember.objects.exclude(active=False).order_by('ordering'), extra_context={
                           'sitepage': 'whoweare'
                       }), name='agiliqpages_whoweare'),
                       url('^thankyou$', CachedTemplateView.as_view(
                           template_name='agiliqpages/thankyou.html', extra_context={}), name='agiliqpages_thankyou'),
                       url('^errorpage-500$', error_page, name='agiliqpages_error_page'),
                       )

urlpatterns += patterns('agiliqpages.views',
                        url('^contactus$', 'contact_us', {
                            "template": "agiliqpages/contactus.html"}, name='agiliqpages_contactus'),
                        url('^ourwork$', 'our_work', {
                            'template': 'agiliqpages/ourwork.html'}, name='agiliqpages_ourwork'),
                        )
