(function($) {

	$.fn.layerSlider = function( options ){

		// initializing

		if( (typeof(options)).match('object|undefined') ){
			return this.each(function(i){
				new layerSlider(this, options);
			});
		}else{
			if( options == 'data' ){
				var lsData = $(this).data('LayerSlider');
				if( lsData ){
					return lsData;
				}
			}else{
				return this.each(function(i){

					// prev, next, start, stop, change functions

					var lsData = $(this).data('LayerSlider');
					if( lsData ){
						if( !lsData.g.isAnimating ){
							if( typeof(options) == 'number' ){
								if( options > 0 && options < lsData.g.layersNum + 1 && options != lsData.g.curLayerIndex ){
									lsData.change(options);
								}								
							}else{
								switch(options){
									case 'prev':
										lsData.o.cbPrev();
										lsData.prev();
										break;
									case 'next':
										lsData.o.cbNext();
										lsData.next();
										break;
									case 'start':
										if( !lsData.g.autoSlideshow ){
											lsData.o.cbStart();
											lsData.start();
										}							
										break;
								}
							}
						}
						if( lsData.g.autoSlideshow && options == 'stop' ){
							lsData.o.cbStop();
							lsData.stop();
						}
					}
				});				
			}
		}
	};

	// LayerSlider Methods 

	var layerSlider = function(el, options) {

		var ls = this;
		ls.$el = $(el).addClass('ls-container');
		ls.$el.data('LayerSlider', ls);

		ls.init = function(){

			// setting options (user settings) and global (not modificable) parameters
			
			ls.o = $.extend({},layerSlider.options, options);
			ls.g = $.extend({},layerSlider.global);
			
			// BUGFIX v1.6 if there is only ONE layer, duplicating it
			
			if( $(el).find('.ls-layer').length == 1 ){
				$(el).find('.ls-layer:eq(0)').clone().appendTo( $(el) );
			}
			
			ls.g.sliderOriginalWidth = $(el)[0].style.width;

			// storing unique settings of layers and sublayers into object.data

			$(el).find('.ls-layer, *[class^="ls-s"]').each(function(){

				if( $(this).attr('rel') || $(this).attr('style') ){
					if( $(this).attr('rel') ){
						var params = $(this).attr('rel').toLowerCase().split(';');
					}else{
						var params = $(this).attr('style').toLowerCase().split(';');						
					}
					for(x=0;x<params.length;x++){
						param = params[x].split(':');
						if( param[0].indexOf('easing') != -1 ){
							param[1] = ls.ieEasing( param[1] );
						}
						$(this).data( $.trim(param[0]), $.trim(param[1]) );
					}
				}

				// NEW FEATURE v1.7 making the slider responsive - we have to use style.left instead of jQuery's .css('left') function!

				$(this).data( 'originalLeft', $(this)[0].style.left );
				$(this).data( 'originalTop', $(this)[0].style.top );
			});

			// setting variables

			ls.g.layersNum = $(el).find('.ls-layer').length;
			ls.o.firstLayer = ls.o.firstLayer < ls.g.layersNum + 1 ? ls.o.firstLayer : 1;
			ls.o.firstLayer = ls.o.firstLayer < 1 ? 1 : ls.o.firstLayer;

			// NEW FEATURE v1.7 animating first layer
			
			if( ls.o.animateFirstLayer == true ){
				ls.o.firstLayer = ls.o.firstLayer - 1 == 0 ? ls.g.layersNum : ls.o.firstLayer-1;				
			}

			ls.g.curLayerIndex = ls.o.firstLayer;
			ls.g.curLayer = $(el).find('.ls-layer:eq('+(ls.g.curLayerIndex-1)+')');				
			
			// NEW FEATURE v1.7 making the slider responsive

			ls.g.sliderWidth = function(){
				return $(el).width();
			}
			
			ls.g.sliderHeight = function(){
				return $(el).height();
			}

			// NEW FEATURE v1.7 added yourLogo
			
			if( ls.o.yourLogo ){
				var yourLogo = $('<img>').appendTo($(el)).attr( 'src', ls.o.yourLogo ).attr('style', ls.o.yourLogoStyle );

				// NEW FEATURES v1.8 added yourLogoLink & yourLogoTarget

				if( ls.o.yourLogoLink != false ){
					$('<a>').appendTo($(el)).attr( 'href', ls.o.yourLogoLink ).attr('target', ls.o.yourLogoTarget ).css({
						textDecoration : 'none',
						outline : 'none'
					}).append( yourLogo );
				}
			}

			// moving all layers to .ls-inner container

			$(el).find('.ls-layer').wrapAll('<div class="ls-inner"></div>');

			// adding styles

			if( $(el).css('position') == 'static' ){
				$(el).css('position','relative');
			}

			$(el).find('.ls-inner').css({
				backgroundColor : ls.o.globalBGColor
			});
			
			if( ls.o.globalBGImage ){
				$(el).find('.ls-inner').css({
					backgroundImage : 'url('+ls.o.globalBGImage+')'
				});
			}

			$(el).find('.ls-bg').css({
				marginLeft : - ( ls.g.sliderWidth() / 2 )+'px',
				marginTop : - ( ls.g.sliderHeight() / 2 )+'px'
			});

			// creating navigation

			if( ls.o.navPrevNext ){

				$('<a class="ls-nav-prev" href="#" />').click(function(e){
					e.preventDefault();
					$(el).layerSlider('prev');
				}).appendTo($(el));

				$('<a class="ls-nav-next" href="#" />').click(function(e){
					e.preventDefault();
					$(el).layerSlider('next');
				}).appendTo($(el));					
			}

			if( ls.o.navStartStop || ls.o.navButtons ){
				
				$('<div class="ls-bottom-nav-wrapper" />').appendTo( $(el) );

				if( ls.o.navButtons ){
					
					$('<span class="ls-bottom-slidebuttons" />').appendTo( $(el).find('.ls-bottom-nav-wrapper') );

					for(x=1;x<ls.g.layersNum+1;x++){

						$('<a href="#"></a>').appendTo( $(el).find('.ls-bottom-slidebuttons') ).click(function(e){
							e.preventDefault();
							$(el).layerSlider( ($(this).index() + 1) );
						});
					}
					$(el).find('.ls-bottom-slidebuttons a:eq('+(ls.o.firstLayer-1)+')').addClass('ls-nav-active');
				}

				if( ls.o.navStartStop ){
					
					$('<a class="ls-nav-start" href="#" />').click(function(e){
						e.preventDefault();
						$(el).layerSlider('start');
					}).prependTo( $(el).find('.ls-bottom-nav-wrapper') );

					$('<a class="ls-nav-stop" href="#" />').click(function(e){
						e.preventDefault();
						$(el).layerSlider('stop');
					}).appendTo( $(el).find('.ls-bottom-nav-wrapper') );
				}else{

					$('<span class="ls-nav-sides ls-nav-sideleft" />').prependTo( $(el).find('.ls-bottom-nav-wrapper') );
					$('<span class="ls-nav-sides ls-nav-sideright" />').appendTo( $(el).find('.ls-bottom-nav-wrapper') );						
				}
			}

			// adding keyboard navigation if turned on

			if( ls.o.keybNav ){
				
				$('body').bind('keydown',function(e){ 
					if( !ls.g.isAnimating ){
						if( e.which == 37 ){
							ls.o.cbPrev();							
							ls.prev();
						}else if( e.which == 39 ){
							ls.o.cbNext();							
							ls.next();							
						}
					}
				});
			}

			// adding touch-control navigation
			
			if('ontouchstart' in window){

			   $(el).bind('touchstart', function( e ) {
					var t = e.touches ? e.touches : e.originalEvent.touches;
					if( t.length == 1 ){
						ls.g.touchStartX = ls.g.touchEndX = t[0].clientX;
					}
			    });

			   $(el).bind('touchmove', function( e ) {
					var t = e.touches ? e.touches : e.originalEvent.touches;
					if( t.length == 1 ){
						ls.g.touchEndX = t[0].clientX;
					}
					if( Math.abs( ls.g.touchStartX - ls.g.touchEndX ) > 45 ){
						e.preventDefault();							
					}
			    });

				$(el).bind('touchend',function( e ){
					if( Math.abs( ls.g.touchStartX - ls.g.touchEndX ) > 45 ){
						if( ls.g.touchStartX - ls.g.touchEndX > 0 ){
							ls.o.cbNext();
							$(el).layerSlider('next');
						}else{
							ls.o.cbPrev();
							$(el).layerSlider('prev');
						}
					}
				});
			}
			
			// pauseOnHover
			
			if( ls.o.pauseOnHover == true ){
				
				// BUGFIX v1.6 stop was not working because of pause on hover

				$(el).find('.ls-inner').hover(
					function(){

						// Calling cbPause callback function

						ls.o.cbPause();

						if( ls.g.autoSlideshow ){
							ls.stop();
							ls.g.paused = true;
						}
					},
					function(){
						if( ls.g.paused ){
							ls.start();
							ls.g.paused = false;
						}						
					}
				);
			}

			// applying skin
			
			$(el).addClass('ls-'+ls.o.skin);
			var skinStyle = ls.o.skinsPath+ls.o.skin+'/skin.css';

			if (document.createStyleSheet){
				document.createStyleSheet(skinStyle);
			}else{
				$('<link rel="stylesheet" href="'+skinStyle+'" type="text/css" />').appendTo( $('head') );
			}				
						
			// NEW FEATURE v1.7 animating first layer

			if( ls.o.animateFirstLayer == true ){

				if( ls.o.autoStart ){
					ls.g.autoSlideshow = true;
				}
				ls.next();

			}else{
				
				// if autostart is true, begin to slide

				ls.imgPreload(ls.g.curLayer,function(){
					ls.g.curLayer.fadeIn(1000).addClass('ls-active');
										
					if( ls.o.autoStart ){
						ls.start();
					}
				});
			}

			// NEW FEATURE v1.7 added window resize function for make responsive layout better

			$(window).resize(function() {
				ls.makeResponsive( ls.g.curLayer, function(){return;});
			});			

			// must be called because of Firefox, Safari and IE9 outerWidth bug

			$(el).delay(150).queue(function(){
				ls.makeResponsive( ls.g.curLayer, function(){return;});
			});

			// NEW FEATURE v1.7 added cbInit function

			ls.o.cbInit( $(el) );
		};

		ls.start = function(){
			
			if( ls.g.autoSlideshow ){
				if( ls.g.prevNext == 'prev' && ls.o.twoWaySlideshow ){
					ls.prev();
				}else{
					ls.next();
				}
			}else{
				ls.g.autoSlideshow = true;
				ls.timer();
			}
		};
		
		ls.timer = function(){
			
			var delaytime = $(el).find('.ls-active').data('slidedelay') ? parseInt( $(el).find('.ls-active').data('slidedelay') ) : ls.o.slideDelay;

			clearTimeout( ls.g.slideTimer );
			ls.g.slideTimer = window.setTimeout(function(){
				ls.start();
			}, delaytime );
		};

		ls.stop = function(){

			clearTimeout( ls.g.slideTimer );
			ls.g.autoSlideshow = false;
		};

		// because of an ie7 bug, we have to override the strings

		ls.ieEasing = function( e ){

			// BUGFIX v1.6 and v1.8 some type of animations didn't work properly

			if( $.trim(e.toLowerCase()) == 'swing' || $.trim(e.toLowerCase()) == 'linear'){
				return e.toLowerCase();
			}else{
				return e.replace('easeinout','easeInOut').replace('easein','easeIn').replace('easeout','easeOut').replace('quad','Quad').replace('quart','Quart').replace('cubic','Cubic').replace('quint','Quint').replace('sine','Sine').replace('expo','Expo').replace('circ','Circ').replace('elastic','Elastic').replace('back','Back').replace('bounce','Bounce');				
			}
		};

		// calculating prev layer

		ls.prev = function(){

			var prev = ls.g.curLayerIndex < 2 ? ls.g.layersNum : ls.g.curLayerIndex - 1;
			ls.g.prevNext = 'prev';
			ls.change(prev,ls.g.prevNext);
		};

		// calculating next layer

		ls.next = function(){

			var next = ls.g.curLayerIndex < ls.g.layersNum ? ls.g.curLayerIndex + 1 : 1;
			ls.g.prevNext = 'next';
			ls.change(next,ls.g.prevNext);
		};

		ls.change = function(num,prevnext){

			clearTimeout( ls.g.slideTimer );
			ls.g.nextLayerIndex = num;
			ls.g.nextLayer = $(el).find('.ls-layer:eq('+(ls.g.nextLayerIndex-1)+')');

			// BUGFIX v1.6 fixed wrong directions of animations if navigating by slidebuttons

			if( !prevnext ){

				if( ls.g.curLayerIndex < ls.g.nextLayerIndex ){
					ls.g.prevNext = 'next';
				}else{
					ls.g.prevNext = 'prev';
				}
			}

			ls.imgPreload(ls.g.nextLayer,function(){
				ls.animate();
			});
		};

		ls.imgPreload = function(layer,callback){

			if( ls.o.imgPreload ){
				var preImages = [];
				var preloaded = 0;

				// layer bg
				
				if( layer.css('background-image') != 'none' && layer.css('background-image').indexOf('url') != -1 ){
					var bgi = layer.css('background-image');
					bgi = bgi.match(/url\((.*)\)/)[1].replace(/"/gi, '');
					preImages.push(bgi);
				}
				
				// images inside layer
				
				layer.find('img').each(function(){
					preImages.push($(this).attr('src'));
				});
				
				// bg images inside layer
				
				layer.find('*').each(function(){
					
					// BUGFIX v1.7 fixed preload bug with sublayers with gradient backgrounds

					if( $(this).css('background-image') != 'none' && $(this).css('background-image').indexOf('url') != -1 ){
						var bgi = $(this).css('background-image');
						bgi = bgi.match(/url\((.*)\)/)[1].replace(/"/gi, '');
						preImages.push(bgi);
					}
				});

				// BUGFIX v1.7 if there are no images in a layer, calling the callback function

				if(preImages.length == 0){
					ls.makeResponsive(layer, callback);
				}else{
					for(x=0;x<preImages.length;x++){
						$('<img>').load(function(){
							if( ++preloaded == preImages.length ){
								ls.makeResponsive(layer, callback);
							}
						}).attr('src',preImages[x]);
					}					
				}
			}else{				
				ls.makeResponsive(layer, callback);
			}
		};
		
		// NEW FEATURE v1.7 making the slider responsive

		ls.makeResponsive = function(layer, callback){

			layer.css({
				display: 'block',
				visibility: 'hidden'
			});

			ls.resizeSlider();

			for(var _sl=0;_sl < layer.children().length;_sl++){

				var sl = layer.children(':eq('+_sl+')');
				var ol = sl.data('originalLeft');
				var ot = sl.data('originalTop');

				// (RE)positioning sublayer (left property)

				if( ol && ol.indexOf('%') != -1 ){
					sl.css({
						left : ls.g.sliderWidth() / 100 * parseInt(ol) - sl.outerWidth() / 2
					});
				}

				// (RE)positioning sublayer (top property)

				if( ot && ot.indexOf('%') != -1 ){
					sl.css({
						top : ls.g.sliderHeight() / 100 * parseInt(ol) - sl.outerHeight() / 2
					});
				}
			}

			layer.css({
				display: 'none',
				visibility: 'visible'
			});

			callback();

			$(this).dequeue();
		};
		
		ls.resizeSlider = function(){

			if( $(el).closest('.ls-wp-forceresponsive-container').length ){
				
				$(el).closest('.ls-wp-forceresponsive-helper').css({
					height : $(el).outerHeight(true)
				});

				$(el).closest('.ls-wp-forceresponsive-container').css({
					height : $(el).outerHeight(true)
				});

				$(el).closest('.ls-wp-forceresponsive-helper').css({
					width : $(window).width(),
					left : - $(window).width() / 2
				});

				if( ls.g.sliderOriginalWidth.split('%') != -1 ){

					var percentWidth = parseInt( ls.g.sliderOriginalWidth );
					var newWidth = $('body').width() / 100 * percentWidth - ( $(el).outerWidth() - $(el).width() );
					$(el).width( newWidth );
				}
			}

			$(el).find('.ls-inner, .ls-layer').css({
				width : ls.g.sliderWidth(),
				height : ls.g.sliderHeight()
			});

			$(el).find('.ls-bg').css({
				marginLeft : - ( ls.g.sliderWidth() / 2 )+'px',
				marginTop : - ( ls.g.sliderHeight() / 2 )+'px'
			});
		};

		ls.animate = function(){
			
			// calling cbAnimStart callback function

			ls.o.cbAnimStart();

			// changing variables

			ls.g.isAnimating = true;
			
			// adding .ls-animating class to next layer
			
			ls.g.nextLayer.addClass('ls-animating');

			// setting position and styling of current and next layers

			var curLayerLeft = curLayerRight = curLayerTop = curLayerBottom = nextLayerLeft = nextLayerRight = nextLayerTop = nextLayerBottom = layerMarginLeft = layerMarginRight = layerMarginTop = layerMarginBottom = 'auto';
			var curLayerWidth = nextLayerWidth = ls.g.sliderWidth();
			var curLayerHeight = nextLayerHeight = ls.g.sliderHeight();

			// calculating direction

			var prevOrNext = ls.g.prevNext == 'prev' ? ls.g.curLayer : ls.g.nextLayer;
			var chooseDirection = prevOrNext.data('slidedirection') ? prevOrNext.data('slidedirection') : ls.o.slideDirection;

			// setting the direction of sliding

			var slideDirection = ls.g.slideDirections[ls.g.prevNext][chooseDirection];

			if( slideDirection == 'left' || slideDirection == 'right' ){
				curLayerWidth = curLayerTop = nextLayerWidth = nextLayerTop = 0;
				layerMarginTop = 0;				
			}
			if( slideDirection == 'top' || slideDirection == 'bottom' ){
				curLayerHeight = curLayerLeft = nextLayerHeight = nextLayerLeft = 0;
				layerMarginLeft = 0;
			}

			switch(slideDirection){
				case 'left':
					curLayerRight = nextLayerLeft = 0;
					layerMarginLeft = -ls.g.sliderWidth();
					break;
				case 'right':
					curLayerLeft = nextLayerRight = 0;
					layerMarginLeft = ls.g.sliderWidth();
					break;
				case 'top':
					curLayerBottom = nextLayerTop = 0;
					layerMarginTop = -ls.g.sliderHeight();
					break;
				case 'bottom':
					curLayerTop = nextLayerBottom = 0;
					layerMarginTop = ls.g.sliderHeight89;
					break;
			}

			// setting start positions and styles of layers

			ls.g.curLayer.css({
				left : curLayerLeft,
				right : curLayerRight,
				top : curLayerTop,
				bottom : curLayerBottom			
			});
			ls.g.nextLayer.css({
				width : nextLayerWidth,
				height : nextLayerHeight,
				left : nextLayerLeft,
				right : nextLayerRight,
				top : nextLayerTop,
				bottom : nextLayerBottom
			});

			// animating current layer

			// BUGFIX v1.6 fixed some wrong parameters of current layer

			// BUGFIX v1.7 fixed using of delayout of current layer

			var curDelay = ls.g.curLayer.data('delayout') ? parseInt(ls.g.curLayer.data('delayout')) : ls.o.delayOut;
			var curTime = ls.g.curLayer.data('durationout') ? parseInt(ls.g.curLayer.data('durationout')) : ls.o.durationOut;
			var curEasing = ls.g.curLayer.data('easingout') ? ls.g.curLayer.data('easingout') : ls.o.easingOut;

			// BUGFIX v1.6 added an additional delaytime to current layer to fix the '1px gap' bug
			// BUGFIX v1.7 modified from curTime / 20 to curTime / 80

			ls.g.curLayer.delay( curDelay + curTime / 80 ).animate({
				width : curLayerWidth,
				height : curLayerHeight
			}, curTime, curEasing,function(){

				// setting current layer

				ls.g.curLayer = ls.g.nextLayer;
				ls.g.curLayerIndex = ls.g.nextLayerIndex;

				// changing some css classes

				$(el).find('.ls-layer').removeClass('ls-active');
				$(el).find('.ls-layer:eq(' + ( ls.g.curLayerIndex - 1 ) + ')').addClass('ls-active').removeClass('ls-animating');
				$(el).find('.ls-bottom-slidebuttons a').removeClass('ls-nav-active');
				$(el).find('.ls-bottom-slidebuttons a:eq('+( ls.g.curLayerIndex - 1 )+')').addClass('ls-nav-active');
			
				// changing variables

				ls.g.isAnimating = false;

				// Calling cbAnimStop callback function

				ls.o.cbAnimStop();

				// setting timer if needed

				if( ls.g.autoSlideshow ){

					ls.timer();
				}
			});

			// animating sublayers of current layer

			ls.g.curLayer.find(' > *[class^="ls-s"]').each(function(){

				var curSubSlideDir = $(this).data('slidedirection') ? $(this).data('slidedirection') : slideDirection;
				var lml, lmt;

				switch(curSubSlideDir){
					case 'left':
						lml = -ls.g.sliderWidth();
						lmt = 0;
						break;
					case 'right':
						lml = ls.g.sliderWidth();
						lmt = 0;
						break;
					case 'top':
						lmt = -ls.g.sliderHeight();
						lml = 0;
						break;
					case 'bottom':
						lmt = ls.g.sliderHeight();
						lml = 0;
						break;
				}

				// NEW FEATURE v1.6 added slideoutdirection to sublayers

				var curSubSlideOutDir = $(this).data('slideoutdirection') ? $(this).data('slideoutdirection') : false;

				switch(curSubSlideOutDir){
					case 'left':
						lml = ls.g.sliderWidth();
						lmt = 0;
						break;
					case 'right':
						lml = -ls.g.sliderWidth();
						lmt = 0;
						break;
					case 'top':
						lmt = ls.g.sliderHeight();
						lml = 0;
						break;
					case 'bottom':
						lmt = -ls.g.sliderHeight();
						lml = 0;
						break;
				}

				var curSubParMod = ls.g.curLayer.data('parallaxout') ? parseInt(ls.g.curLayer.data('parallaxout')) : ls.o.parallaxOut;
				var curSubPar = parseInt( $(this).attr('class').split('ls-s')[1] ) * curSubParMod;
				
				var curSubDelay = $(this).data('delayout') ? parseInt($(this).data('delayout')) : ls.o.delayOut;
				var curSubTime = $(this).data('durationout') ? parseInt($(this).data('durationout')) : ls.o.durationOut;
				var curSubEasing = $(this).data('easingout') ? $(this).data('easingout') : ls.o.easingOut;

				// NEW FEATURE v1.6 added fading feature to sublayers

				if( curSubSlideOutDir == 'fade' || ( !curSubSlideOutDir && curSubSlideDir == 'fade' )){
					
					$(this).delay( curSubDelay ).fadeOut(curSubTime, curSubEasing);					
				}else{
					
					$(this).stop().delay( curSubDelay ).animate({
						marginLeft : -lml * curSubPar,
						marginTop : -lmt * curSubPar
					}, curSubTime, curSubEasing);
				}
			});	

			// animating next layer

				// override global parameters with unique if need

				var nextDelay = ls.g.nextLayer.data('delayin') ? parseInt(ls.g.nextLayer.data('delayin')) : ls.o.delayIn;
				var nextTime = ls.g.nextLayer.data('durationin') ? parseInt(ls.g.nextLayer.data('durationin')) : ls.o.durationIn;
				var nextEasing = ls.g.nextLayer.data('easingin') ? ls.g.nextLayer.data('easingin') : ls.o.easingIn;

				ls.g.nextLayer.delay( curDelay + nextDelay ).animate({
					width : ls.g.sliderWidth(),
					height : ls.g.sliderHeight()
				}, nextTime, nextEasing);

			// animating sublayers of next layer

			ls.g.nextLayer.find(' > *[class^="ls-s"]').each(function(){

				// override global parameters with unique if need

				var nextSubSlideDir = $(this).data('slidedirection') ? $(this).data('slidedirection') : slideDirection;
				var lml, lmt;

				switch(nextSubSlideDir){
					case 'left':
						lml = -ls.g.sliderWidth();
						lmt = 0;
						break;
					case 'right':
						lml = ls.g.sliderWidth();
						lmt = 0;
						break;
					case 'top':
						lmt = -ls.g.sliderHeight();
						lml = 0;
						break;
					case 'bottom':
						lmt = ls.g.sliderHeight();
						lml = 0;
						break;
					case 'fade':
						lmt = 0;
						lml = 0;
						break;
				}

				var nextSubParMod = ls.g.nextLayer.data('parallaxin') ? parseInt(ls.g.nextLayer.data('parallaxin')) : ls.o.parallaxIn;
				var nextSubPar = parseInt( $(this).attr('class').split('ls-s')[1] ) * nextSubParMod;

				var nextSubDelay = $(this).data('delayin') ? parseInt($(this).data('delayin')) : ls.o.delayIn;
				var nextSubTime = $(this).data('durationin') ? parseInt($(this).data('durationin')) : ls.o.durationIn;
				var nextSubEasing = $(this).data('easingin') ? $(this).data('easingin') : ls.o.easingIn;

				// NEW FEATURE v1.6 added fading feature to sublayers

				if( nextSubSlideDir == 'fade' ){
					
					$(this).css({
						display: 'none',
						marginLeft : 0,
						marginTop : 0
					}).delay( curDelay + nextSubDelay ).fadeIn(nextSubTime, nextSubEasing);
				}else{

					// BUGFIX v1.7 added display : block to sublayers that don't fade

					$(this).css({
						display : 'block',
						marginLeft : lml * nextSubPar,
						marginTop : lmt * nextSubPar
					}).stop().delay( curDelay + nextSubDelay ).animate({
						marginLeft : 0,
						marginTop : 0
					}, nextSubTime, nextSubEasing);
				}				
			});
		}

		// initializing
		ls.init();
	};

	layerSlider.options = {
		
		// user settings (can be modified)
		
		autoStart			: true,						// If true, slideshow will automatically start after loading the page.
		firstLayer			: 1,						// LayerSlider will begin with this layer.
		twoWaySlideshow		: false,					// If true, slideshow will go backwards if you click the prev button.
		keybNav				: true,						// Keyboard navigation. You can navigate with the left and right arrow keys.
		imgPreload			: true,						// Image preload. Preloads all images and background-images of the next layer.
		navPrevNext			: true,						// If false, Prev and Next buttons will be invisible.
		navStartStop		: true,						// If false, Start and Stop buttons will be invisible.
		navButtons			: true,						// If false, slide buttons will be invisible.
		skin				: 'lightskin',				// You can change the skin of the Slider, use 'noskin' to hide skin and buttons.
		skinsPath			: '/layerslider/skins/',	// You can change the default path of the skins folder. Note, that you must use the slash at the end of the path.
		pauseOnHover		: true,						// SlideShow will pause when mouse pointer is over LayerSlider.

		// NEW FEATURE v1.6 optional global background color / image

		globalBGColor		: 'transparent',			// Background color of LayerSlider. You can use all CSS methods, like hexa colors, rgb(r,g,b) method, color names, etc. Note, that background sublayers are covering the background.
		globalBGImage		: false,					// Background image of LayerSlider. This will be a fixed background image of LayerSlider by default. Note, that background sublayers are covering the global background image.

		// NEW FEATURES v1.7 animateFirstLayer & yourLogo

		animateFirstLayer	: false,					// If true, first layer will animate (slide in) instead of fading
		yourLogo			: false,					// This is a fixed image that will be shown above of LayerSlider container. For example if you want to display your own logo, etc. You have to add the correct path to your image file.
		yourLogoStyle		: 'position: absolute; z-index: 1001; left: 10px; top: 10px;', // You can style your logo. You are allowed to use any CSS properties, for example add left and top properties to place the image inside the LayerSlider container anywhere you want.

		// NEW FEATURES v1.8 yourLogoLink & yourLogoTarget
		
		yourLogoLink		: false,					// You can add a link to your logo. Set false is you want to display only an image without a link.
		yourLogoTarget		: '_blank',					// If '_blank', the clicked url will open in a new window.

		// LayerSlider API callback functions

		// NEW FEATURE v1.7 added cbInit function

		cbInit				: function(){},				// Calling when LayerSlider loads.
		cbStart				: function(){},				// Calling when you click the slideshow start button.
		cbStop				: function(){},				// Calling when click the slideshow stop / pause button.
		cbPause				: function(){},				// Calling when slideshow pauses (if pauseOnHover is true).
		cbAnimStart			: function(){},				// Calling when animation starts.
		cbAnimStop			: function(){},				// Calling when the animation of current layer ends, but the sublayers of this layer still may be animating.
		cbPrev				: function(){},				// Calling when you click the previous button (or if you use keyboard or touch navigation).
		cbNext				: function(){},				// Calling when you click the next button (or if you use keyboard or touch navigation).

		// The following global settings can be override separately by each layers and / or sublayers local settings (see the documentation for more information).
		
		slideDirection		: 'right',					// Slide direction. New layers will sliding FROM(!) this direction.
		slideDelay			: 4000,						// Time before the next slide will be loading.
		parallaxIn			: .45,						// Modifies the parallax-effect of the slide-in animation.
		parallaxOut			: .45,						// Modifies the parallax-effect of the slide-out animation.
		durationIn			: 1500,						// Duration of the slide-in animation.
		durationOut			: 1500,						// Duration of the slide-out animation.
		easingIn			: 'easeInOutQuint',			// Easing (type of transition) of the slide-in animation.
		easingOut			: 'easeInOutQuint',			// Easing (type of transition) of the slide-out animation.
		delayIn				: 0,						// Delay time of the slide-in animation.
		delayOut			: 0							// Delay time of the slide-out animation.
	};

	layerSlider.global = {
		
		// global parameters (Do not change these settings!)

		version				: '1.8',
		
		autoSlideshow		: false,
		isAnimating			: false,
		layersNum			: null,
		prevNext			: 'next',
		slideTimer			: null,
		sliderWidth			: null,
		sliderHeight		: null,
		slideDirections		: {
							prev : {
								left	: 'right',
								right	: 'left',
								top		: 'bottom',
								bottom	: 'top'
							},
							next : {
								left	: 'left',
								right	: 'right',
								top		: 'top',
								bottom	: 'bottom'
							}
		}
	};

})(jQuery);