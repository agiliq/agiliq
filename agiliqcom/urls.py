from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from django.views.generic.simple import direct_to_template
admin.autodiscover()
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
handler500 = 'agiliqpages.views.server_error'

urlpatterns = patterns('',
    # Example:
    # (r'^agiliqcom/', include('agiliqcom.foo.urls')),
    
    (r'^', include('agiliqpages.urls')),
	# (r'^accounts/', include('registration.urls')),
                       (r'^forum/', include('dinette.urls')),
                       (r'^socialauth/', include('socialauth.urls')),
                       (r'^blog/', include('blogango.urls')),	
                       (r'^pystories/', include('pystories.urls')),
   

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
    url(r'^', include('cms.urls')),
    url('^404$', direct_to_template, {'template': '404.html'}, name='agiliqcom_notfound'),
    url('^500$', direct_to_template, {'template': '500.html'}, name='agiliqcom_error'),
)+staticfiles_urlpatterns()

if settings.DEBUG or getattr(settings, 'SERVE_MEDIA', False):
    urlpatterns += patterns('django.views.static',
                            (r'^site_media/(?P<path>.*)$', 'serve', { 'document_root': settings.MEDIA_ROOT,
                                                                      'show_indexes': True }),
                            
                            )

