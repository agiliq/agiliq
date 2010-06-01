
from agiliqpages.models import ContentBlock, Client

def sidebar_vars(request):
	testimonials = Client.objects.filter(has_testimonial=True).order_by('?')
	try:
		hire_us = ContentBlock.objects.get(slug='hire-us').content
	except:
		hire_us = None
	return {'hire_us': hire_us,
	        'testimonials': testimonials}