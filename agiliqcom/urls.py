from django.conf.urls import patterns, include, url
from django.conf import settings

from django.contrib import admin
from django.views.generic.base import TemplateView

admin.autodiscover()

handler500 = 'agiliqpages.views.server_error'

urlpatterns = patterns('',
    url(r'^', include('agiliqpages.urls')),
	url(r'^forum/', include('dinette.urls')),
	url(r'^blog/', include('blogango.urls')),
    url(r'^pystories/', include('pystories.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url('^404$', TemplateView.as_view(template_name="404.html"), name='agiliqcom_notfound'),
    url('^500$', TemplateView.as_view(template_name="500.html"), name='agiliqcom_error'),
    url('^search$', TemplateView.as_view(template_name="agiliqpages/search.html"), name='agiliqcom_search'),
)

if settings.DEBUG or getattr(settings, 'SERVE_MEDIA', False):
    urlpatterns += patterns('django.views.static',
        (r'^site_media/(?P<path>.*)$', 'serve', { 'document_root': settings.MEDIA_ROOT,
                                        'show_indexes': True }),

    )
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^static/(?P<path>.*)$', 'serve'),
    )
