
from agiliqpages.models import ContentBlock

def sidebar_vars(request):
	return {'hire_us': ContentBlock.objects.get(slug='hire-us').content}