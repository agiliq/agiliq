import datetime

from django import template

from agiliqpages.models import ContentBlock, Client, Testimonial
from blogango.models import BlogEntry

register = template.Library()

def get_content_or_none(**kwargs):
    try:
        return ContentBlock.objects.get(**kwargs).content
    except ContentBlock.DoesNotExist:
        return ''

def get_latest_object_or_none(model):
    try:
        return model.objects.latest()
    except model.DoesNotExist:
        return None

class ExtraContext(template.Node):
    def __init__(self):
        pass

    def render(self, context):
        testimonials = Testimonial.objects.filter(contact__testimonial__isnull=False).order_by('?')
        hire_us = get_content_or_none(slug='hire-us')
        our_code = get_content_or_none(slug='our-code')

        extra_header = get_content_or_none(slug='extra-header')
        extra_footer = get_content_or_none(slug='extra-footer')

        after_open_body_tag =  get_content_or_none(slug='after-open-body-tag')
        after_close_body_tag = get_content_or_none(slug='after-close-body-tag')

        blog_entries = BlogEntry.objects.filter(is_published=True)
        if blog_entries.count():
            blog_entry = blog_entries[0]
        else:
            blog_entry = None

        extra_context = {'hire_us': hire_us,
                'our_code': our_code,
                'testimonials': testimonials,
                'blog_entry': blog_entry,
                'extra_header': extra_header,
                'extra_footer': extra_footer,
                'after_open_body_tag': after_open_body_tag,
                'after_close_body_tag': after_close_body_tag,
                'today': datetime.datetime.today(),
                }
        context.update(extra_context)
        return ''

def get_extra_context(parser, token):
    return ExtraContext()

register.tag('get_extra_context', get_extra_context)

from lib import ttp

@register.filter
def twitterify(tweet):
    parse = ttp.Parser()
    result = parse.parse(tweet)
    return result.html