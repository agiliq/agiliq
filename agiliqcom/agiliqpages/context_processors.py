
from agiliqpages.models import ContentBlock, Client

def sidebar_vars(request):
	testimonials = Client.objects.filter(has_testimonial=True).order_by('?')
	return {'hire_us': ContentBlock.objects.get(slug='hire-us').content,
	        'testimonials': testimonials}