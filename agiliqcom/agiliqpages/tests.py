"""
This file demonstrates two different styles of tests (one doctest and one
unittest). These will both pass when you run "manage.py test".

Replace these with more appropriate tests for your application.
"""
from django.core.urlresolvers import reverse
from django.core import mail
from django.test import TestCase
from django.test.client import Client


class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.failUnlessEqual(1 + 1, 2)

__test__ = {"doctest": """
Another way to test that 1 + 1 is equal to 2.

>>> 1 + 1 == 2
True
"""}


class ContactUsTest(TestCase):

    def test_get_contactpage(self):
        c = Client()
        response = c.get(reverse('agiliqpages_contactus'))
        self.assertEqual(response.status_code, 200)

    def test_post_contactpage(self):
        c = Client()
        response = c.post(reverse('agiliqpages_contactus'), {
            'name': 'test',
            'email': 'test@test.com',
            'message': 'test message'
        },
            follow=True
        )
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(response.status_code, 200)
