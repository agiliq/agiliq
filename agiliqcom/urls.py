from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings

from django.contrib import admin
from django.contrib.auth.views import login
from django.views.generic.base import TemplateView

admin.autodiscover()

#handler500 = 'agiliqpages.views.server_error'
handler500 = TemplateView.as_view(template_name="500.html")

urlpatterns = patterns('',
    url(r'^', include('agiliqpages.urls')),
	url(r'^blog/', include('blogango.urls')),
    url(r'^login/$', login, name='dinette_login'),

    url(r'^demo/graphos/', include('graphosdemo.urls')),
    url(r'^demo/merchant/', include('app.urls')),
    url(r'^demo/dinette/', include('dinette.urls')),
    url(r'^demo/parsley/', include('parsleydemo.urls')),
    url(r'^team/leaves/', include('leave_tracker.urls')),
    url(r'^team/expensify/', include('exapp.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url('^404$', TemplateView.as_view(template_name="404.html"), name='agiliqcom_notfound'),
    url('^500$', TemplateView.as_view(template_name="500.html"), name='agiliqcom_error'),
    url('^search$', TemplateView.as_view(template_name="agiliqpages/search.html"), name='agiliqcom_search'),

)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
