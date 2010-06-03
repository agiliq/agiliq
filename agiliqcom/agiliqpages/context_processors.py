
from agiliqpages.models import ContentBlock, Client, Tweet
from blogango.models import BlogEntry

def get_object_or_none(model, **kwargs):
    try:
        return model.objects.get(**kwargs)
    except model.DoesNotExist:
        return None
    
def get_latest_object_or_none(model):
    try:
        return model.objects.latest()
    except model.DoesNotExist:
        return None
    
def sidebar_vars(request):
    testimonials = Client.objects.filter(has_testimonial=True).order_by('?')
    hire_us = get_object_or_none(ContentBlock, slug='hire-us')
    hire_us = hire_us and hire_us.content
    our_code = get_object_or_none(ContentBlock, slug='our-code')
    our_code = our_code and our_code.content
		
    tweet = get_latest_object_or_none(Tweet)
    blog_entries = BlogEntry.objects.filter(is_published=True)
    if blog_entries.count():
        blog_entry = blog_entries[0] 
        
    return {'hire_us': hire_us,
            'our_code': our_code, 
		    'testimonials': testimonials,
		    'tweet': tweet, 
            'blog_entry': blog_entry}