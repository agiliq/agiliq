from django.test import TestCase
from django.test.client import Client
from django.core.urlresolvers import reverse

class PagesTest(TestCase):

    def test_get_home(self):
        c = Client()
        response = c.get(reverse('parsleydemo_home'))
        self.assertEqual(response.status_code, 200)
