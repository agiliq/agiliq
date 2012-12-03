from django.contrib.auth.models import User
from django.db import models

class ContactUs(models.Model):
    name = models.CharField(max_length=75)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField()
    company = models.CharField(max_length=75, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Contacts from web'

    def __unicode__(self):
        return '%s - %s - %s' % (self.name, self.email, self.company)

class TestimonialManager(models.Manager):
    def get_query_set(self, *args, **kwargs):
        return super(TestimonialManager, self).get_query_set().filter(is_active=True)

class Testimonial(models.Model):
    testimonial = models.TextField(null=True, blank=True)
    contact = models.ForeignKey('Contact')

    ordering = models.PositiveSmallIntegerField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    default = models.Manager()
    objects = TestimonialManager()

    class Meta:
        get_latest_by = ('ordering', )
        ordering = ('ordering', )

    def __unicode__(self):
        return self.testimonial[:30]+" ..."

class ClientManager(models.Manager):
    def get_query_set(self, *args, **kwargs):
        return super(ClientManager, self).get_query_set(*args, **kwargs).filter(is_active=True)

class Client(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    about = models.TextField()
    url = models.URLField()
    is_active = models.BooleanField(default=True)

    default = models.Manager()
    objects = ClientManager()

    class Meta:
        ordering = ("-is_active", )

    def __unicode__(self):
        return self.name

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    client_company = models.ForeignKey('Client', null=True, blank=True)

    def has_testimonial(self):
        return bool(self.testimonial_set.count())

    def is_active(self):
        return self.client_company.is_active

    def __unicode__(self):
        return self.name

class BlogEntry(models.Model):
    feed_url = models.URLField()

    #Entry
    entry_title = models.CharField(max_length=100)
    entry_url = models.URLField(unique=True)
    entry_summary = models.TextField()

    #Who columns
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        get_latest_by = ('created_on', )

    def __unicode__(self):
        return self.entry_title

class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()
    photo = models.ImageField(upload_to='people/', null=True, blank=True)
    designation = models.CharField(max_length=100)

    user = models.OneToOneField(User, blank=True, null=True)
    tag_line = models.CharField(max_length=255, blank=True, null=True)

    twitter = models.URLField(null=True, blank=True)
    linked_in = models.URLField(null=True, blank=True)

    ordering = models.PositiveSmallIntegerField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    active = models.NullBooleanField()
    class Meta:
        get_latest_by = ('ordering', )
        ordering = ('-active', 'ordering', )

    def __unicode__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=100)
    blurb = models.TextField()
    url = models.URLField()
    logo = models.ImageField(upload_to='project_logos/')

    category = models.CharField(choices=(
        ('Web App', 'Web App'),
        ('Android App', 'Android App'),
        ('iOS App', 'iOS App'),
        ), max_length=100, default="Web App")
    ordering = models.PositiveSmallIntegerField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    is_active = models.NullBooleanField(default=True)
    is_featured = models.NullBooleanField(default = False)

    class Meta:
        get_latest_by = ('ordering', )
        ordering = ('ordering', )

    def __unicode__(self):
        return self.name

class Whitepaper(models.Model):
    name = models.CharField(max_length=100)
    details = models.TextField()
    paper =  models.FileField(upload_to='whitepapers/')

    ordering = models.PositiveSmallIntegerField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        get_latest_by = ('ordering', )
        ordering = ('ordering', )


    def __unicode__(self):
        return self.name

class ContentBlock(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField()
    content = models.TextField()

    def __unicode__(self):
        return self.name
