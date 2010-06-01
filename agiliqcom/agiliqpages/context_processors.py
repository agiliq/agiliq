
from agiliqpages.models import ContentBlock, Client, Tweet

def get_object_or_none(model, **kwargs):
    try:
        return model.objects.get(**kwargs)
    except model.DoesNotExist:
        return None
    
def sidebar_vars(request):
    testimonials = Client.objects.filter(has_testimonial=True).order_by('?')
    hire_us = get_object_or_none(ContentBlock, slug='hire-us')
    hire_us = hire_us and hire_us.content
    our_code = get_object_or_none(ContentBlock, slug='our-code')
    our_code = our_code and our_code.content
		
    try:
        tweet = Tweet.objects.latest()
    except:
        tweet = None
        
    return {'hire_us': hire_us,
            'our_code': our_code, 
		    'testimonials': testimonials,
		    'tweet': tweet}