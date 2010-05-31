
import re
from django import forms

from agiliqpages.models import ContactUs

class ContactUsForm(forms.ModelForm):
	
	def __init__(self, *args, **kwargs):
		super(ContactUsForm, self).__init__(*args, **kwargs)
		for field in self.fields:
			self.fields[field].widget.attrs.update({'class': 'formstyle'})
		
	class Meta:
		model = ContactUs
		
	def clean_phone(self):
		phone_number = self.cleaned_data['phone']
		if phone_number and not re.match('^[0-9-]+$', phone_number):
			raise forms.ValidationError('Only numbers and - are allowed in phone number')
		return phone_number
