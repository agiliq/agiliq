
from django.core.management import setup_environ
import settings
setup_environ(settings) 


from pystories.services.EntryService import FetchManager


fmanager = FetchManager()
fmanager.triggerfetchFeed()

