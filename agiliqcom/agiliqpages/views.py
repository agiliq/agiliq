
from django.conf import settings
from django.core.mail import mail_managers, send_mail
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.template.loader import render_to_string
from django.views.decorators.cache import cache_page
from django.http import HttpResponseRedirect

from django import http
from django.template import Context, loader

from agiliqpages.forms import ContactUsForm
from agiliqpages.models import Client, Project

def error_page(request):
    #This page is meant to cause error to test error handling
		raise Exception("This error is expected.")


# @cache_page(settings.CACHE_DURATION)
def contact_us(request, template):
	if request.method == 'POST':
		form = ContactUsForm(request.POST)
		if form.is_valid():
			form.save()
			manager_message = render_to_string('agiliqpages/contact.txt', 
											   {'name' : form.cleaned_data['name'], 
											    'email' : form.cleaned_data['email'], 
											    'query' : form.cleaned_data['message']})
			send_mail('Contact from Agiliq.com', manager_message, form.cleaned_data["email"], ['hello@agiliq.com'], fail_silently=False)
			
			customer_message = render_to_string('agiliqpages/contact_us_confirmation.txt', {})
			send_mail('Thank you for contacting www.agiliq.com', customer_message, settings.DEFAULT_FROM_EMAIL, [form.cleaned_data['email']])
			return redirect(reverse('agiliqpages_thankyou'))
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

def server_error(request, template_name='500.html'):
    """
    500 error handler.

    Templates: `500.html`
    Context:
        MEDIA_URL
            Path of static media (e.g. "media.example.org")
    """
    t = loader.get_template(template_name) # You need to create a 500.html template.
    return http.HttpResponseServerError(t.render(Context({
        'MEDIA_URL': settings.MEDIA_URL
    })))
