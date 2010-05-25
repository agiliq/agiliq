var fontClassFilters = [];
var Font = function(){this.init.apply(this, arguments)};
Font.prototype = {
	fontPath: '/rp/static/fonts/',
	init: function(swf, options){
		this.swf = this.fontPath + swf;
		this.setOptions(options || {});
		String.prototype.rgbToHex = this.rgbToHex;
		String.prototype.toHex = this.toHex;
		Array.prototype.indexOf = this.indexOf;
	},
	setOptions: function(o){
		this.options = {
			sizeAdjust: o.sizeAdjust || 0,
			color: o.color || o.sColor,
			bgcolor: o.bgcolor,
			width: o.width,
			height: o.height,
			sWmode: o.sWmode || 'transparent',
			tags: o.tags || '',
			classFilter: o.classFilter || ''
		}
		if(o.classFilter) fontClassFilters[fontClassFilters.length] = o.classFilter;
	},
	replace: function(tags){
		var tags = (tags || this.options.tags).split(',');
		for(var i=0; tag=tags[i]; i++)
			this.replaceTag(tag);
	},
	replaceTag: function(tag){
		this.replaceElements(document.getElementsByTagName(tag));
	},
	replaceElements: function(els){
		for(var i=0; el=els[i]; i++)
			this.replaceElement(el);
	},
	replaceElement: function(el){
		var o = this.options;
		if(!this.hasFlash || el.oldHTML || (!o.classFilter && this.hasClassName(el, fontClassFilters)) || (o.classFilter && el.className.indexOf(o.classFilter)==-1) ) return;
		var c = this.options.color || el.style.color || document.defaultView ? document.defaultView.getComputedStyle(el, null).color : el.currentStyle ? el.currentStyle.color : '#000001';
		if(c.indexOf('rgb') > -1) c = '#'+c.rgbToHex();
		else if(c.length == 4) c = '#'+c.charAt(1)+c.charAt(1)+c.charAt(2)+c.charAt(2)+c.charAt(3)+c.charAt(3);
		var width = o.width || (el.offsetWidth + o.sizeAdjust) * .9;//fix for ie floats
		var height = o.height || el.offsetHeight;
		var sVars = 'txt=' + escape(el.innerHTML) + '&amp;textcolor=' + c + '&amp;w=' + width + '&amp;h=' + (height+o.sizeAdjust) + '';
		el.oldHTML = el.innerHTML;
		el.innerHTML = '<embed type="application/x-shockwave-flash" src="' + this.swf + '" quality="best" wmode="' + o.sWmode + '" bgcolor="' + o.bgcolor + '" flashvars="' + sVars + '" width="' + width + '" height="' + height + '" sifr="true"></embed>';
	},
	hasClassName: function(el, classNames) {
		var classNames = el.className.split(' ');
		for(var i=0; cn=classNames[i]; i++)
			if(classNames.indexOf(cn)) return true;
		return false;
	},
	indexOf: function(needle){
		for(var i=0; val=this[i]; i++)
			if(val == needle) return i;
		return -1;
	},
	toHex: function(){//borrowed from mootools.net
		var N = parseInt(this);
		if (N==0 || isNaN(N)) return "00";
		N = Math.round(Math.min(Math.max(0,N),255));
		return "0123456789abcdef".charAt((N-N%16)/16) + "0123456789abcdef".charAt(N%16);
	},
	rgbToHex: function(){//borrowed from mootools.net
		var rgb = this.match(/[rgba]{3,4}\(([\d]{0,3}),[\s]([\d]{0,3}),[\s]([\d]{0,3})\)/);
		return rgb[1].toHex()+rgb[2].toHex()+rgb[3].toHex();
	},
	hasFlash: function(){//borrowed from the original sIFR
		var nRequiredVersion = 6;
		if(navigator.appVersion.indexOf("MSIE") != -1 && navigator.appVersion.indexOf("Windows") > -1){
			document.write('<script language="VBScript"\> \non error resume next \nhasFlash = (IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash." & ' + nRequiredVersion + '))) \n</script\> \n');
			if(window.hasFlash != null)
				return window.hasFlash;
		};
		if(navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"] && navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
			var flashDescription = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description;
			return parseInt(flashDescription.charAt(flashDescription.indexOf(".") - 1)) >= nRequiredVersion;
		};
		return false;
	}()
}