from django.conf.urls import patterns, url


urlpatterns = patterns('',
    url(r'^$', 'graphosdemo.views.home', name='demo_home'),
    url(r'^tutorial/$', 'graphosdemo.views.tutorial', name='demo_tutorial'),
    url(r'^gchart/$', 'graphosdemo.views.gchart_demo', name='demo_gchart_demo'),
    url(r'^yui/$', 'graphosdemo.views.yui_demo', name='demo_yui_demo'),
    url(r'^flot/$', 'graphosdemo.views.flot_demo', name='demo_flot_demo'),
    url(r'^highcharts/$', 'graphosdemo.views.highcharts_demo', name='demo_highcharts_demo'),
    url(r'^morris/$', 'graphosdemo.views.morris_demo', name='demo_morris_demo'),
    url(r'^matplotlib/$', 'graphosdemo.views.matplotlib_demo', name='demo_matplotlib_demo'),
    url(r'^time_series/$', 'graphosdemo.views.time_series_demo',
                           name='demo_time_series_example'),
    url(r"^gchart-json/$", "graphosdemo.views.custom_gchart_renderer", name="demo_custom_gchart"),
    url(r"^mongo-json/$", "graphosdemo.views.mongo_json", name="demo_mongo_json"),
    url(r"^mongo-json2/$", "graphosdemo.views.mongo_json2", name="demo_mongo_json2"),
    url(r"^mongo-json-multi/$", "graphosdemo.views.mongo_json_multi", name="demo_mongo_json_multi"),
    url(r"^mongo-json-multi2/$", "graphosdemo.views.mongo_json_multi2", name="demo_mongo_json_multi2"),
)

