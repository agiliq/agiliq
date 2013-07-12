from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings

from django.contrib import admin
from django.contrib.auth.views import login
from django.views.generic.base import TemplateView

from socialauth.urls import urlpatterns as socialauth_urlpatterns

admin.autodiscover()

handler500 = 'agiliqpages.views.server_error'

urlpatterns = patterns('',
    url(r'^', include('agiliqpages.urls')),
	url(r'^demo/dinette/', include('dinette.urls')),
	url(r'^blog/', include('blogango.urls')),
    url(r'^pystories/', include('pystories.urls')),
    url(r'^login/$', login, name='dinette_login'),

    url(r'^admin/', include(admin.site.urls)),
    url('^404$', TemplateView.as_view(template_name="404.html"), name='agiliqcom_notfound'),
    url('^500$', TemplateView.as_view(template_name="500.html"), name='agiliqcom_error'),
    url('^search$', TemplateView.as_view(template_name="agiliqpages/search.html"), name='agiliqcom_search'),
)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += socialauth_urlpatterns
