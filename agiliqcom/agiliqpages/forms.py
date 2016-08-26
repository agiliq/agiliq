import re
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from agiliqpages.models import ContactUs


class ContactUsForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(ContactUsForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update({'class': 'formstyle'})

    class Meta:
        model = ContactUs
        #added on migration to 1.8
        fields = "__all__"

    def clean_phone(self):
        phone_number = self.cleaned_data['phone']
        if phone_number and not re.match('^[0-9-]+$', phone_number):
            raise forms.ValidationError('Only numbers and - are allowed in phone number')
        return phone_number


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(label='Email')

    class Meta:
        model = User
        fields = ("username", "email")
