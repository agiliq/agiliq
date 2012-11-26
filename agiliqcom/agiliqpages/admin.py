from django.contrib import admin

from agiliqpages.models import *


class ContentBlockAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


class ContactUsListAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'company', 'created_at')
    class Meta:
        model = ContactUs


class TestimonialInline(admin.TabularInline):
    model = Testimonial
    extra = 1

class ContactAdmin(admin.ModelAdmin):
    model = Contact
    inlines = [ TestimonialInline ]


class ContactInline(admin.TabularInline):
    model = Contact
    extra = 1

class ClientAdmin(admin.ModelAdmin):
    list_display = ["name", "url", "is_active"]
    list_filter = ['is_active']
    inlines = [ ContactInline ]

admin.site.register(ContentBlock, ContentBlockAdmin)

admin.site.register(BlogEntry)
#admin.site.register(Client)
admin.site.register(Client, ClientAdmin)
admin.site.register(Contact, ContactAdmin)
admin.site.register(Testimonial)
#admin.site.register(ContactUs)
admin.site.register(ContactUs, ContactUsListAdmin)
admin.site.register(Project)
admin.site.register(TeamMember)
admin.site.register(Whitepaper)
