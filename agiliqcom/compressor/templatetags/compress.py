import time

from django import template
from django.core.cache import cache
from compressor import CssCompressor, JsCompressor
from compressor.conf import settings

register = template.Library()

class CompressorNode(template.Node):
    def __init__(self, nodelist, kind=None):
        self.nodelist = nodelist
        self.kind = kind

    def cache_get(self, key):
        packed_val = cache.get(key)
        if packed_val is None:
            return None
        val, refresh_time, refreshed = packed_val
        if (time.time() > refresh_time) and not refreshed:
            # Store the stale value while the cache
            # revalidates for another MINT_DELAY seconds.
            self.cache_set(key, val, timeout=settings.MINT_DELAY, refreshed=True)
            return None
        return val

    def cache_set(self, key, val, timeout=settings.REBUILD_TIMEOUT, refreshed=False):
        refresh_time = timeout + time.time()
        real_timeout = timeout + settings.MINT_DELAY
        packed_val = (val, refresh_time, refreshed)
        return cache.set(key, packed_val, real_timeout)

    def render(self, context):
        content = self.nodelist.render(context)
        if not settings.COMPRESS or not len(content.strip()):
            return content
        if self.kind == 'css':
            compressor = CssCompressor(content)
        if self.kind == 'js':
            compressor = JsCompressor(content)
        output = self.cache_get(compressor.cachekey)
        if output is None:
            try:
                output = compressor.output()
                self.cache_set(compressor.cachekey, output)
            except:
                from traceback import format_exc
                raise Exception(format_exc())
        return output

@register.tag
def compress(parser, token):
    """
    Compresses linked and inline javascript or CSS into a single cached file.

    Syntax::

        {% compress <js/css> %}
        <html of inline or linked JS/CSS>
        {% endcompress %}

    Examples::

        {% compress css %}
        <link rel="stylesheet" href="/media/css/one.css" type="text/css" charset="utf-8">
        <style type="text/css">p { border:5px solid green;}</style>
        <link rel="stylesheet" href="/media/css/two.css" type="text/css" charset="utf-8">
        {% endcompress %}

    Which would be rendered something like::

        <link rel="stylesheet" href="/media/CACHE/css/f7c661b7a124.css" type="text/css" media="all" charset="utf-8">

    or::

        {% compress js %}
        <script src="/media/js/one.js" type="text/javascript" charset="utf-8"></script>
        <script type="text/javascript" charset="utf-8">obj.value = "value";</script>
        {% endcompress %}

    Which would be rendered something like::

        <script type="text/javascript" src="/media/CACHE/js/3f33b9146e12.js" charset="utf-8"></script>

    Linked files must be on your COMPRESS_URL (which defaults to MEDIA_URL).
    If DEBUG is true off-site files will throw exceptions. If DEBUG is false
    they will be silently stripped.
    """

    nodelist = parser.parse(('endcompress',))
    parser.delete_first_token()

    args = token.split_contents()

    if not len(args) == 2:
        raise template.TemplateSyntaxError("%r tag requires either 1, 3 or 5 arguments." % args[0])

    kind = args[1]
    if not kind in ['css', 'js']:
        raise template.TemplateSyntaxError("%r's argument must be 'js' or 'css'." % args[0])

    return CompressorNode(nodelist, kind)
