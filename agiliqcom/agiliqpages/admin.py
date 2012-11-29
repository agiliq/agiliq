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
    list_display = ["name", "has_testimonial", "is_active"]
    inlines = [ TestimonialInline ]


class ContactInline(admin.TabularInline):
    model = Contact
    extra = 1

class ClientAdmin(admin.ModelAdmin):
    list_display = ["name", "url", "is_active"]
    list_filter = ['is_active']
    change_form_template = "admin/client_change_form.html"
    inlines = [ ContactInline ]


class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ["name", "active"]
    change_form_template = "admin/team_member_change_form.html"

class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active']
    list_editable = ['is_active']
    change_form_template = "admin/project_change_form.html"

admin.site.register(ContentBlock, ContentBlockAdmin)

admin.site.register(BlogEntry)
admin.site.register(Client, ClientAdmin)
admin.site.register(Contact, ContactAdmin)
admin.site.register(Testimonial)
admin.site.register(ContactUs, ContactUsListAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(TeamMember, TeamMemberAdmin)
admin.site.register(Whitepaper)
