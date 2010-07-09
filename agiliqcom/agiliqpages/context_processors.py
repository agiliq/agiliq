
from agiliqpages.models import ContentBlock, Client, Tweet
from blogango.models import BlogEntry

def get_content_or_none(**kwargs):
    try:
        return ContentBlock.objects.get(**kwargs).content
    except ContentBlock.DoesNotExist:
        return None
    
def get_latest_object_or_none(model):
    try:
        return model.objects.latest()
    except model.DoesNotExist:
        return None
    
def extra_context(request):
    testimonials = Client.objects.filter(has_testimonial=True).order_by('?')
    hire_us = get_content_or_none(slug='hire-us')
    our_code = get_content_or_none(slug='our-code')
    
    extra_header = get_content_or_none(slug='extra-header')
    extra_footer = get_content_or_none(slug='extra-footer')
    
    tweet = get_latest_object_or_none(Tweet)
    
    blog_entries = BlogEntry.objects.filter(is_published=True)
    if blog_entries.count():
        blog_entry = blog_entries[0]
    else: 
        blog_entry = None
    return {'hire_us': hire_us, 
            'our_code': our_code, 
            'testimonials': testimonials, 
            'tweet': tweet, 
            'blog_entry': blog_entry,
            'extra_header': extra_header,
            'extra_footer': extra_footer}
