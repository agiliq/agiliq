
from django.contrib import admin

from agiliqpages.models import BlogEntry, Client, ContactUs, ContentBlock, Project, TeamMember, Whitepaper

class ContentBlockAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}

admin.site.register(ContentBlock, ContentBlockAdmin)

admin.site.register(BlogEntry)
admin.site.register(Client)
admin.site.register(ContactUs)
admin.site.register(Project)
admin.site.register(TeamMember)
admin.site.register(Whitepaper)