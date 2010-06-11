
from django.conf import settings
from django.core.urlresolvers import reverse

from agiliqpages.models import Client
from blogango.models import BlogRoll
from taggit.models import Tag

def sidebar_vars(request):
    testimonials = Client.objects.filter(has_testimonial=True).order_by('?')
    clients = Client.objects.all()
    blog_rolls = BlogRoll.objects.filter(is_published=True)
    tags = Tag.objects.all()
    feed_url = getattr(settings, 'FEED_URL', reverse('blogango_feed', args=['latest'])) 
    
    return {'clients': clients,
            'blog_rolls': blog_rolls,
            'tags': tags, 
            'canonical_url': request.build_absolute_uri(),
            'feed_url': feed_url,
            'pingback_xmlrpc_url': request.build_absolute_uri(reverse('xmlrpc'))}