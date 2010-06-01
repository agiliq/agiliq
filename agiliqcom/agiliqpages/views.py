
from django.conf import settings
from django.core.mail import mail_managers
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.template.loader import render_to_string
from django.views.decorators.cache import cache_page

from agiliqpages.forms import ContactUsForm
from agiliqpages.models import Client, Project


@cache_page(settings.CACHE_DURATION)
def contact_us(request, template):
	if request.method == 'POST':
		form = ContactUsForm(request.POST)
		if form.is_valid():
			form.save()
			message = render_to_string('agiliqpages/contact.txt', 
										{'name' : form.cleaned_data['name'], 
										'email' : form.cleaned_data['email'], 
										'query' : form.cleaned_data['message']})
			mail_managers('Contact from Agiliq.com', message, fail_silently=False)
			return redirect(reverse('agiliqpages_contactus'))
	else:
		form = ContactUsForm()
	return render_to_response(template, 
							  {'form': form, 
							   'sitepage': 'contactus'}, 
							  RequestContext(request))


@cache_page(settings.CACHE_DURATION)
def our_work(request, template):
	products = Project.objects.all()
	clients = Client.objects.all()
	return render_to_response(template, 
	                          {'products': products, 
	                           'clients': clients, 
	                           'sitepage': 'ourwork'}, 
	                          RequestContext(request))