from django.conf.urls import patterns, url

from .views import HomeView


urlpatterns = patterns('core.views',
    url(r'^$', HomeView.as_view(), name='parsleydemo_home'),
)
