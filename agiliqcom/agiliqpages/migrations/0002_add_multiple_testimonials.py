# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Testimonial'
        db.create_table('agiliqpages_testimonial', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('testimonial', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('contact', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['agiliqpages.Contact'])),
            ('ordering', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('created_on', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated_on', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('is_active', self.gf('django.db.models.fields.BooleanField')(default=True, blank=True)),
        ))
        db.send_create_signal('agiliqpages', ['Testimonial'])

        # Adding model 'Contact'
        db.create_table('agiliqpages_contact', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('email', self.gf('django.db.models.fields.EmailField')(max_length=75)),
            ('client_company', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['agiliqpages.Client'], null=True, blank=True)),
        ))
        db.send_create_signal('agiliqpages', ['Contact'])

        # Deleting field 'Client.has_testimonial'
        db.delete_column('agiliqpages_client', 'has_testimonial')

        # Deleting field 'Client.is_active'
        db.delete_column('agiliqpages_client', 'is_active')

        # Deleting field 'Client.created_on'
        db.delete_column('agiliqpages_client', 'created_on')

        # Deleting field 'Client.contact_name'
        db.delete_column('agiliqpages_client', 'contact_name')

        # Deleting field 'Client.testimonial'
        db.delete_column('agiliqpages_client', 'testimonial')

        # Deleting field 'Client.ordering'
        db.delete_column('agiliqpages_client', 'ordering')

        # Deleting field 'Client.updated_on'
        db.delete_column('agiliqpages_client', 'updated_on')

        # Deleting field 'Client.email'
        db.delete_column('agiliqpages_client', 'email')

        # Changing field 'Client.logo'
        db.alter_column('agiliqpages_client', 'logo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True))


    def backwards(self, orm):
        
        # Deleting model 'Testimonial'
        db.delete_table('agiliqpages_testimonial')

        # Deleting model 'Contact'
        db.delete_table('agiliqpages_contact')

        # Adding field 'Client.has_testimonial'
        db.add_column('agiliqpages_client', 'has_testimonial', self.gf('django.db.models.fields.BooleanField')(default=False, blank=True), keep_default=False)

        # Adding field 'Client.is_active'
        db.add_column('agiliqpages_client', 'is_active', self.gf('django.db.models.fields.BooleanField')(default=True, blank=True), keep_default=False)

        # Adding field 'Client.created_on'
        db.add_column('agiliqpages_client', 'created_on', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, default=datetime.datetime(2010, 8, 20, 6, 30, 20, 698652), blank=True), keep_default=False)

        # Adding field 'Client.contact_name'
        db.add_column('agiliqpages_client', 'contact_name', self.gf('django.db.models.fields.CharField')(default='', max_length=100), keep_default=False)

        # Adding field 'Client.testimonial'
        db.add_column('agiliqpages_client', 'testimonial', self.gf('django.db.models.fields.TextField')(null=True, blank=True), keep_default=False)

        # Adding field 'Client.ordering'
        db.add_column('agiliqpages_client', 'ordering', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0), keep_default=False)

        # Adding field 'Client.updated_on'
        db.add_column('agiliqpages_client', 'updated_on', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, default=datetime.datetime(2010, 8, 20, 6, 30, 33, 121700), blank=True), keep_default=False)

        # Adding field 'Client.email'
        db.add_column('agiliqpages_client', 'email', self.gf('django.db.models.fields.EmailField')(default='', max_length=75), keep_default=False)

        # Changing field 'Client.logo'
        db.alter_column('agiliqpages_client', 'logo', self.gf('django.db.models.fields.files.ImageField')(max_length=100))


    models = {
        'agiliqpages.blogentry': {
            'Meta': {'object_name': 'BlogEntry'},
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'entry_summary': ('django.db.models.fields.TextField', [], {}),
            'entry_title': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'entry_url': ('django.db.models.fields.URLField', [], {'unique': 'True', 'max_length': '200'}),
            'feed_url': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'updated_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'agiliqpages.client': {
            'Meta': {'object_name': 'Client'},
            'about': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'agiliqpages.contact': {
            'Meta': {'object_name': 'Contact'},
            'client_company': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['agiliqpages.Client']", 'null': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'agiliqpages.contactus': {
            'Meta': {'object_name': 'ContactUs'},
            'company': ('django.db.models.fields.CharField', [], {'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'message': ('django.db.models.fields.TextField', [], {}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '75'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'updated_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'agiliqpages.contentblock': {
            'Meta': {'object_name': 'ContentBlock'},
            'content': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50', 'db_index': 'True'})
        },
        'agiliqpages.project': {
            'Meta': {'object_name': 'Project'},
            'blurb': ('django.db.models.fields.TextField', [], {}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'ordering': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'updated_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'agiliqpages.teammember': {
            'Meta': {'object_name': 'TeamMember'},
            'bio': ('django.db.models.fields.TextField', [], {}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designation': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'linked_in': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'ordering': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'twitter': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'updated_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'agiliqpages.testimonial': {
            'Meta': {'object_name': 'Testimonial'},
            'contact': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['agiliqpages.Contact']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True', 'blank': 'True'}),
            'ordering': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'testimonial': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'updated_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'agiliqpages.tweet': {
            'Meta': {'object_name': 'Tweet'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'screen_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'text': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'tweet_id': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'agiliqpages.whitepaper': {
            'Meta': {'object_name': 'Whitepaper'},
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'details': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'ordering': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'paper': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'updated_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['agiliqpages']
