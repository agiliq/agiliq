
from django.contrib import admin

from agiliqpages.models import *

class ContentBlockAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}

admin.site.register(ContentBlock, ContentBlockAdmin)

admin.site.register(BlogEntry)
admin.site.register(Client)
admin.site.register(Contact)
admin.site.register(Testimonial)
admin.site.register(ContactUs)
admin.site.register(Project)
admin.site.register(TeamMember)
admin.site.register(Whitepaper)