from django.core.urlresolvers import reverse
from django.core import mail
from django.test import TestCase
from django.test.client import Client



class PagesTest(TestCase):

    def test_get_contactpage(self):
        c = Client()
        response = c.get(reverse('agiliqpages_contactus'))
        self.assertEqual(response.status_code, 200)

    def test_get_homepage(self):
        c = Client()
        response = c.get(reverse('agiliqpages_index'))
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
