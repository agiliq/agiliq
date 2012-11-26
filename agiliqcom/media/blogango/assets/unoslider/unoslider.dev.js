/*
 * Programmer: Unodor
 * CodeCanyon: http://codecanyon.net/user/Unodor
 *
 * Version: 1.3
 *
 * DO NOT use this file in production. Use packed version instead
 */

;(function($){

	// console.log wrapper
	function log(data){
		console.log(data);
	}

	// UID generator
	var uniqueID = (function() {
		var id = 0;
		return function() { return id++; };
	})();

	$.UnoSlider = function(options, base){
		var $ = jQuery;
		var $this = base;
		
		var defaults = {
			slidesTag: 'li',
			scale: true,
			preloader: 'progress',
			tooltip: true,
			preset: false,
			width: false,
			height: false,
			order: 'inorder',
			touch: true,
			mobile: true,
			responsive: true,
			indicator: { 
				autohide: false,
				position: ''
			},
			navigation: {
				autohide: ['play', 'pause'],
				next: 'Next',
				prev: 'Previous',
				play: 'Play',
				stop: 'Pause'
			},
			slideshow: {
				speed: 1,
				timer: true,
				hoverPause: true,
				infinite: true,
				autostart: true,
				continuous: true
			},
			block: {
				vertical: 9,
				horizontal: 3
			},
			animation: {
				speed: 500,
				delay: 50,
				color: '#fff',
				transition: 'grow',
				variation: 'topleft',
				pattern: 'diagonal',
				direction: 'topleft'
			}
		};
		
		var preset = {
			animation: {
				speed: 500,
				delay: 50,
				color: '#fff',
				transition: 'grow',
				variation: 'topleft',
				pattern: 'diagonal',
				direction: 'topleft'
			},
			block: {
				vertical: 9,
				horizontal: 3
			}
		};
		
		var defaults_cfg = $.extend(true, defaults, $.UnoSlider.defaults);
		var preset_base_cfg = $.extend({}, defaults, $.UnoSlider.defaults);
		var cfg = $.extend(true, defaults_cfg, options);
		
		var slides = $this.find(cfg.slidesTag);
		var activeSlideNum = 0;
		var interval = new Array;
		var controls = '';
		var running = false;
		var stoped = false;
		var force = false;
		var lastSlideNum = 0;
		
		var intervalStartTime;
		var intervalStopTime;
		var timebarStartTime;
		var timebarStopTime;
		var layerTimer;

		var layerAnimation = [];

		var block = {};

		var columns;
		var rows;

		var uid = uniqueID();

		var lists = $this.find(cfg.slidesTag).css({
			opacity: 0,
			display: "none"
		});

		var loaded = 0;
		
		if(typeof cfg.width !== 'undefined' && cfg.width !== null && cfg.width){
			$this.css({width: cfg.width});
		}
		
		if(typeof cfg.height !== 'undefined' && cfg.height !== null && cfg.height){
			$this.css({height: cfg.height});
		}

		$this.main = {

			// slider initialize
			init: function(){
				slides.filter(":first").css({
					'z-index': 1,
					display: "block"
				}).addClass('unoslider_active');
				
				// show preloader
				$this.preloader.init($this.main.start);
			},
			
			// start slider
			start: function(){
				var layerDelay = 0;
				
				// more than one slide
				if(slides.length > 1){
					stoped = !cfg.slideshow.autostart ? true : false;
					if(cfg.indicator) $this.navigation.indicator();
					$this.navigation.generate();
					if(cfg.slideshow.timer) $this.timebar.set();
					if(cfg.slideshow.hoverPause) $this.slideshow.pauseOnHover();
				}
				
				if(cfg.touch && $this.main.is_mobile()) $this.touch.init();

				$this.layer.generate();

				if(cfg.responsive) $this.main.responsive();
				
				$this.main.scaleSlides();
					
				$this.tooltip.generate();
				
				var firstSlide = $this.children('li:first');
				
				// show captions and layers on first slide
				setTimeout(function(){
					layerDelay = $this.layer.show(firstSlide);

					if(cfg.tooltip) $this.tooltip.show(firstSlide);
					
					if(slides.length > 1){
						if(cfg.slideshow.autostart){
							layerTimer = setTimeout(function(){
								 $this.slideshow.start();
							}, layerDelay);
						}
					}
					
				}, 500);
			},
			
			// scale images to fit the slider dimensions
			scaleSlides: function(){
				var img = slides.find('img').not('.unoslider_layers img, .unoslider_caption img, div > img');
				var div = $('<div class="unoslider_slider_area"></div>').css({overflow: 'hidden', width: $this.width(), height: $this.height(), position: 'absolute'});

				// wrap into the div because an overflow
				img.each(function(){
					$(this).wrap(div);
				});

				// per-slide settings
				var scale = cfg.scale;
				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].scale != 'undefined')){
					scale = cfg[activeSlideNum+1].scale;
				}
				
				if(scale){
					img.css({width: '100%', height: '100%' });
				}
			},
			
			// generate blocks curtain
			generateCurtain: function(content){
				var generateBlocks = true;
				var X = 0;
				var Y = 0;
				var i = 1;
				var content_cube;
				
				var vertical = cfg.block.vertical;
				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].block != 'undefined') && (typeof cfg[activeSlideNum+1].block.vertical != 'undefined')){
					vertical = cfg[activeSlideNum+1].block.vertical;
				}
				
				var horizontal = cfg.block.horizontal;
				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].block != 'undefined') && (typeof cfg[activeSlideNum+1].block.horizontal != 'undefined')){
					horizontal = cfg[activeSlideNum+1].block.horizontal;
				}
				
				columns = vertical;
				rows = horizontal;
				
				// count dimensions
				block = {
					width: Math.ceil($this.width() / vertical),
					height: Math.ceil($this.height() / horizontal)
				};					
				
				var blocks_area = $('<div class="unoslider_blocks_area"></div>').css({overflow: 'hidden', width: $this.width(), height: $this.height(), position: 'absolute', top: '0px', left: '0px', 'z-index': 3}).appendTo($this[0]);
				var blocks = $('<div class="unoslider_blocks"></div>').css({width: $this.width(), height: $this.height(), position: 'relative'}).appendTo(blocks_area);
				
				// generate
				while (generateBlocks) {
					content_cube = $('<div class="unoslider_cube_content"></div>').css({
						position: 'absolute',
						left: -X,
						top: -Y,
						width: $this.width(),
						height: $this.height()
					});
					
					$('<div id="block_' + i + '" class="unoslider_cube"></div>').appendTo(blocks).css({
						'z-index': 2,
						position: 'absolute',
						display: 'none',
						top: Y,
						left: X,
						width: block.width,
						height: block.height,
						overflow: 'hidden'
					}).append(content_cube);

					i++;

					X += block.width;

					if (X >= $this.width()) {
						X = 0;
						Y += block.height;
					}

					if (Y >= $this.height()) generateBlocks = false;
				}

				// add data (image, custom html...)
				$this.find('.unoslider_cube_content').html(content);
				
				// disable clicks when the blocks move
				$('.unoslider_cube').click(function(){
					return false;
				});
			},
			
			// prepare the slider for the upcoming transition
			prepare: function(slideData){
				running = true;
				$this.main.generateCurtain(slideData.html());
				
				return $this.main.setDirection();
			},
			
			// execute animation
			execute: function(direction, duration, currentSlide, nextSlide, handChange, delayedChange){
				if(cfg.tooltip) $this.tooltip.hide();

				if(delayedChange === false){
					setTimeout(function(){
						$this.slideshow.switchSlides(currentSlide, nextSlide);
					}, 10);
				} 

				var delay = direction['celkem'] + duration;

				currentSlide.delay(delay).animate({
					opacity: 0
				}, 1, function(){
					if(delayedChange === true) $this.slideshow.switchSlides(currentSlide, nextSlide);
					
					nextSlide.animate({}, 1, function () {
						$this.children(".unoslider_blocks_area").remove();
						$this.children(".unoslider_cube").remove();
						
						var layerDelay = $this.layer.show(nextSlide);

						if((handChange === true && (cfg.slideshow.continuous === true || !cfg.slideshow)) || handChange === false){
							running = false;
							layerTimer = setTimeout(function(){								
								if(stoped === false) $this.slideshow.restart();
							}, layerDelay);
						}

						if(cfg.tooltip) $this.tooltip.show(nextSlide);
					});
				});
			},

			counter: 0,
			
			// preset animations
			presets: function(){
				
				// presets object is provided
				if(typeof cfg === 'object' && typeof cfg.preset === 'object'){
					var index = cfg.order === 'random' ? Math.floor(Math.random() * cfg.preset.length) : this.counter;
				
					if(typeof cfg.preset[index] == 'string'){
						if(cfg.preset[index] in $this.preset){
							$this.preset[cfg.preset[index]]();
						}else{
							alert('There is no preset named "'+cfg.preset[index]+'"');
						}
					}else{
						cfg.animation = $.extend({}, preset.animation, cfg.preset[index].animation);
						cfg.block = $.extend({}, preset.block, cfg.preset[index].block);
					}
					
					if((this.counter+1) < cfg.preset.length){
						this.counter++;
					}else{
						this.counter = 0;
					}
				
				}else{
					if(cfg.preset) $this.preset.init();
				}
			},
			
			// mobile devices checker
			is_mobile: function(){
				var mobile = navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android)/);
				return mobile;
			},
			
			// mobile optimized presets
			mobilePresets: function(){
				cfg.block = { vertical: 1, horizontal: 1 };

				if($this.touch.reverse){
					cfg.animation = { speed: 300, delay: 0, transition: 'slide_in', variation: 'left', pattern: 'horizontal' };
				}else{
					cfg.animation = { speed: 300, delay: 0, transition: 'slide_in', variation: 'right', pattern: 'horizontal' };
				}
				
				$this.touch.reverse = false;
			},
			
			// responsive design enabled
			responsive: function(){
				var base_width = $this.width();
				var base_height = $this.height();
				var ratio = (base_width / base_height);

				// fit to width
				function fit(){
					if($this.parent().width() < (base_width)){
						$this.width('100%');
						$this.find('.unoslider_slider_area').width('100%');
					}else{
						$this.css({width: base_width, height: base_height });
						$this.find('.unoslider_slider_area').css({width: base_width, height: base_height });
					}
					
					var cropHeight = Math.floor((($this.width()/ratio)/1))*1;
					$this.height(cropHeight);
					$this.find('.unoslider_slider_area').height(cropHeight);
				}

				$(window).resize(function(){
					fit();
				});
				
				// responsive fit on load
				fit();
			},
			
			// set right transition
			setTransition: function(currentSlide, nextSlide, handChange){
				
				if(cfg.mobile && $this.main.is_mobile()){
					this.mobilePresets();
				}else{
					this.presets();
				}

				var transition = cfg.animation.transition;
				if((typeof cfg[activeSlideNum + 1] != 'undefined') && (typeof cfg[activeSlideNum + 1].animation != 'undefined') && (typeof cfg[activeSlideNum + 1].animation.transition != 'undefined')){
					transition = cfg[activeSlideNum + 1].animation.transition;
				}
				
				var variation = cfg.animation.variation;
				if((typeof cfg[activeSlideNum + 1] != 'undefined') && (typeof cfg[activeSlideNum + 1].animation != 'undefined') && (typeof cfg[activeSlideNum + 1].animation.variation != 'undefined')){
					variation = cfg[activeSlideNum + 1].animation.variation;
				}
				
				// all possible transitions
				var transitions = {
					swap: ['top', 'right', 'bottom', 'left'],
					stretch: ['center', 'vertical', 'horizontal', 'alternate'],
					squeeze: ['center', 'vertical', 'horizontal', 'alternate'],
					shrink: ['topleft', 'topright', 'bottomleft', 'bottomright'],
					grow: ['topleft', 'topright', 'bottomleft', 'bottomright'],
					slide_in: ['top', 'right', 'bottom', 'left', 'alternate_vertical', 'alternate_horizontal'],
					slide_out: ['top', 'right', 'bottom', 'left', 'alternate_vertical', 'alternate_horizontal'],
					drop: ['topleft', 'topright', 'bottomleft', 'bottomright', 'top', 'right', 'bottom', 'left', 'alternate_vertical', 'alternate_horizontal'],
					appear: ['topleft', 'topright', 'bottomleft', 'bottomright', 'top', 'right', 'bottom', 'left', 'alternate_vertical', 'alternate_horizontal'],
					flash: [],
					fade: []
				};
				
				function in_array(a){
				  var o = {};
				  for(var i = 0; i < a.length; i++){
				    o[a[i]] = '';
				  }
				  return o;
				}
				
				var final_transition = transition;
				
				// build
				if(transitions[transition].length > 0){
					if(variation in in_array(transitions[transition])){
						final_transition = transition+'_'+variation;
					}else{
						final_transition = transition+'_'+transitions[transition][0];
					}
				}
				
				$this.transition[final_transition](currentSlide, nextSlide, handChange);

			},
			
			// set right direction
			setDirection: function(){
				var direction = cfg.animation.direction;
				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].animation != 'undefined') && (typeof cfg[activeSlideNum+1].animation.direction != 'undefined')){
					direction = cfg[activeSlideNum+1].animation.direction;
				}
				
				var type = cfg.animation.pattern;
				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].animation != 'undefined') && (typeof cfg[activeSlideNum+1].animation.pattern != 'undefined')){
					type = cfg[activeSlideNum+1].animation.pattern;
				}
				
				// all possible patterns
				var directions = {
					horizontal: ['top', 'bottom', 'topleft', 'topright', 'bottomleft', 'bottomright'],
					vertical: ['left', 'right', 'topleft', 'topright', 'bottomleft', 'bottomright'],
					diagonal: ['topleft', 'topright', 'bottomleft', 'bottomright'],
					random: [],
					spiral: ['topleft', 'topright', 'bottomleft', 'bottomright'],
					horizontal_zigzag: ['topleft', 'topright', 'bottomleft', 'bottomright'],
					vertical_zigzag: ['topleft', 'topright', 'bottomleft', 'bottomright'],
					chess: [],
					explode: ['center', 'top', 'right', 'bottom', 'left'],
					implode: ['center', 'top', 'right', 'bottom', 'left'],
					example: []
				};
				
				function in_array(a){
				  var o = {};
				  for(var i=0;i<a.length;i++){
				    o[a[i]]='';
				  }
				  return o;
				}
				
				var final_direction = type;
				
				// build
				if(directions[type].length > 0){
					if(direction in in_array(directions[type])){
						final_direction = type+'_'+direction;
					}else{
						final_direction = type+'_'+directions[type][0];
					}
				}
				
				return $this.direction[final_direction]();
			}

		};
		
		$this.touch = {
			
			moving: false,
			startX: null,
			reverse: false,
			
			// initialize touch interface
			init: function(){
				
				// touch enabled device?
				if ('ontouchstart' in document.documentElement) {
					
					// remove prev and next when touch is enabled
					$this.find('.unoslider_left').remove();
					$this.find('.unoslider_right').remove();
					
					$this[0].addEventListener('touchstart', $this.touch.start, false);
				}
			},
			
			// touch started
			start: function(event){
				if (event.touches.length == 1) {
					this.startX = event.touches[0].pageX;
					this.moving = true;
					$this[0].addEventListener('touchmove', $this.touch.move, false);
				}
			},
			
			// touch move
			move: function(event){
				if(this.moving) {
					var x = event.touches[0].pageX;
					var dx = this.startX - x;
				
					if(Math.abs(dx) >= 50) {
						$this.touch.end();
						if(dx > 0) {
							$this.touch.left();
						} else {
							$this.touch.right();
						}
					}
				}
			},
			
			// touch end
			end: function(){
				$this[0].removeEventListener('touchmove', $this.touch.move);
				this.startX = null;
				this.moving = false;
			},
			
			// left wipe
			left: function(){
				if(running === false){
					$this.touch.reverse = false;
					$this.slideshow.next();
				}
			},
			
			// right wipe
			right: function(){
				if(running === false){
					$this.touch.reverse = true;
					$this.slideshow.prev();
				}
			}
			
		};
		
		$this.layer = {
			
			// generate layers
			generate: function(){
				$this.find('.unoslider_layers').css({
					width: '100%',
					height: '100%',
					position: 'absolute',
					'z-index': 4
				}).children().hide();
			},
			
			// start animation
			show: function(slide){
				$this.find('.unoslider_layers').children().hide();
				
				var layers = $(slide).find('.unoslider_layers').children().length;
				var delays = [];
				var delay = 250;
				var duration = 300;
				var i;
				var animation;
				
				i = 1;
				$(slide).find('.unoslider_layers').children().each(function(){
					delays.push(delay * i);
					i++;
				});
				
				i = 0;
				$(slide).find('.unoslider_layers').children().each(function(){
					var $self = $(this);

					var tridy = ['slide_top', 'slide_right', 'slide_bottom', 'slide_left', 'fade'];
					
					for(x in tridy){
						if($self.hasClass(tridy[x])){
							animation =  $this.layer[tridy[x]]();
							break;
						}
					}

					$self.css(animation['css']);
					layerAnimation[i] = $self.delay(delays[i]).animate(animation['animate'], {duration: duration});
				
					i++;
				});

				return layers === 0 ? 0 : delays[layers - 1] + (duration * layers);
			},
			
			slide_top: function(){
				var animate = { top: "-=20px", opacity: 1 };
				var css = { top: "+=20px", display: 'block', opacity: 0 };
				
				return {css: css, animate: animate};
			},
			
			slide_right: function(){
				var animate = { left: "+=20px", opacity: 1 };
				var css = { left: "-=20px", display: 'block', opacity: 0 };
				
				return {css: css, animate: animate};
			},
			
			slide_bottom: function(){
				var animate = { top: "+=20px", opacity: 1 };
				var css = { top: "-=20px", display: 'block', opacity: 0 };
				
				return {css: css, animate: animate};
			},
			
			slide_left: function(){
				var animate = { left: "-=20px", opacity: 1 };
				var css = { left: "+=20px", display: 'block', opacity: 0 };
				
				return {css: css, animate: animate};
			},
			
			fade: function(){
				var animate = { opacity: 1 };
				var css = { display: 'block', opacity: 0 };
				
				return {css: css, animate: animate};
			}
			
		};

		$this.timebar = {
			
			pause: function(){
				
				var timebar = $this.find('.unoslider_timer');
				
				$(timebar).stop();
				timebarStopTime = new Date;
			},
			
			resume: function(){
				var timer = $this.find('.unoslider_timer');
				
				var now;
				if(typeof timebarStopTime !== 'undefined')
					now = timebarStopTime.getTime();
				
				var before;
				if(typeof timebarStartTime !== 'undefined')
					before = timebarStartTime.getTime();
				
				var baseTimeout = ($this.timer.speed() * 1000);
				
				var remaining = baseTimeout - (now - before);

				if(remaining <= baseTimeout)
					this.start(remaining);
			},
			
			// create timebar
			set: function(){
				return $('<div class="unoslider_timer"></div>').css({'z-index': 1}).width('0%').appendTo($this[0]);
			},
			
			start: function(delay){	
				var remaining = delay || $this.timer.speed() * 1000;
				var timer = $this.find('.unoslider_timer');
				
				timebarStartTime = new Date();
				
				if(typeof delay === 'undefined')
					timer.show();
					
				timer.animate({
					width: '100%'
				}, remaining, null, function(){
					$this.timebar.hide();
				});
			},
			
			stop: function(){
				var timebar = $this.find('.unoslider_timer');
				$(timebar).stop().width('0%').hide();
			},
			
			hide: function(){
				$this.find('.unoslider_timer').width('0%').hide();
			}
			
		};

		$this.timer = {
			
			// slides change interval
			speed: function(){
				
				var time = cfg.slideshow.speed;

				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].slideshow != 'undefined') && (typeof cfg[activeSlideNum+1].slideshow.speed != 'undefined')){
					time = cfg[activeSlideNum+1].slideshow.speed;
				}
				
				return time;
			},
			
			start: function(delay){

				var remaining = delay || this.speed() * 1000;

				intervalStartTime = new Date();

				interval[uid] = setTimeout(function(){
					activeSlideNum++;

					if (activeSlideNum == slides.length)
						activeSlideNum = 0;

					$this.slideshow.changeTo(activeSlideNum, false);
					
				}, remaining);
			},
			
			pause: function(){
				clearInterval(interval[uid]);
				intervalStopTime = new Date;
			},
			
			resume: function(){
				var now;
				if(typeof intervalStopTime !== 'undefined')
					now = intervalStopTime.getTime();
				
				var before;
				if(typeof intervalStartTime !== 'undefined')
					before = intervalStartTime.getTime();
					
				var baseTimeout = (this.speed() * 1000);
				var remaining = baseTimeout - (now - before);

				if(remaining <= baseTimeout)
					this.start(remaining);
			}
		};

		$this.navigation = {
			
			// create navigation
			generate: function(){
				var self = this;

				if(cfg.navigation){
					var container = $('<div class="unoslider_navigation_container"></div>').css({'z-index': 4}).appendTo($this[0]);

					if(cfg.slideshow){
						var play = $('<a title="'+cfg.navigation.play+'" class="unoslider_play unoslider_navigation">'+cfg.navigation.play+'</a>').appendTo(container);
						var stop = $('<a title="'+cfg.navigation.stop+'" class="unoslider_pause unoslider_navigation">'+cfg.navigation.stop+'</a>').appendTo(container);

						if(stoped){
							stop.addClass("unoslider_hide").hide();
						}else{
							play.addClass("unoslider_hide").hide();
						}
					}

					$('<a title="'+cfg.navigation.prev+'" class="unoslider_left unoslider_navigation">'+cfg.navigation.prev+'</a>').appendTo(container);
					$('<a title="'+cfg.navigation.next+'" class="unoslider_right unoslider_navigation">'+cfg.navigation.next+'</a>').appendTo(container);

					$this.find('.unoslider_right').click(function(){
						if(running === false){
							$this.slideshow.next();
						}
					});

					$this.find('.unoslider_left').click(function(){
						if(running === false){
							$this.slideshow.prev();
						}
					});

					$this.find('.unoslider_pause').click(function(){
						if(!stoped){
							stoped = true;
							self.changeState('stop');
							$this.slideshow.stop();
						}
					});

					$this.find('.unoslider_play').click(function(){
						if(stoped){
							self.changeState('play');
							stoped = false;
							force = true;
							$this.slideshow.start();
						}
					});
					
					$(".unoslider_navigation").css({
						'z-index': 5,
						position: 'absolute'
					});
				}
				
				self.autohide();
			},

			// navigation autohide
			autohide: function(){
				var selector = '';
				
				if(cfg.indicator.autohide){
					selector += '.unoslider_indicator,';
				}

				if(cfg.navigation.autohide){
					var timer;
					
					if(cfg.navigation.autohide !== true){
						var items = cfg.navigation.autohide;
						
						for(var i = 0; i < items.length; i++){
							selector += ('.unoslider_' + items[i] + ',');
						}

					}else{
						selector += '.unoslider_navigation';
					}
				}
				
				var container = $this.find(selector);

				container.each(function(){
					$(this).hide();
				});

				$this.hover(function() {
					if(timer) {
						clearTimeout(timer);
						timer = null;
					}
					
					timer = setTimeout(function() {
						container.not('.unoslider_hide').fadeIn();
					}, 200);
					
				}, function(){
					if(timer) {
						clearTimeout(timer);
						timer = null;
					}
					
					timer = setTimeout(function() {
						container.not('.unoslider_hide').fadeOut();
					}, 200);
				});
			},

			// switch between pause and play button
			changeState: function(state){
				if(state == 'stop'){
					$this.find('.unoslider_play').removeClass('unoslider_hide').show();
					$this.find('.unoslider_pause').addClass("unoslider_hide").hide();
				}else if(state == 'play'){
					$this.find('.unoslider_play').addClass("unoslider_hide").hide();
					$this.find('.unoslider_pause').removeClass('unoslider_hide').show();
				}
			},

			// create bullet indicator
			indicator: function(){
				var appendTo = cfg.indicator.position || $this[0];
				var activeClass = 'unoslider_indicator_active';
				
				controls = $('<div class="unoslider_indicator"></div>').css({'z-index': 6});

				!cfg.indicator.position ? controls.appendTo(appendTo) : controls.insertAfter(appendTo);

				slides.each(function(slide) {
					$('<a title="' + (slide + 1) + '" class="'+activeClass+'">' + (slide + 1) + '</a>').appendTo(controls).bind("click", function(){
						if(running === false) $this.slideshow.changeTo(slide, true);
					});

					activeClass = "";
				});
			}
			
		};

		$this.slideshow = {
			
			// stop slideshow on mouseover
			pauseOnHover: function(){
				var timebar = $this.find('.unoslider_timer');

				$this.hover(function(){
					if(running === false && !stoped){
						$this.timebar.pause();
						$this.timer.pause();
					}
				}, function(){
					if(running === false && !stoped){
						$this.timebar.resume();
						$this.timer.resume();
					}
				});
			},

			start: function(){
				$('.unoslider_preloader').remove();
				
				stoped = false;
				
				if(cfg.slideshow){
					if(!cfg.slideshow.infinite && !force && activeSlideNum == (slides.length - 1)){ // stop slideshow on last slide
						$this.slideshow.stop();
						$this.navigation.changeState('stop');
					}else{ // continue slideshow
						$this.timebar.start();
						$this.timer.start(null);
						force = false;
					}
				}
			},

			stop: function(){
				stoped = true;

				clearTimeout(interval[uid]);
				$this.timebar.stop();
			},
			
			// clear timeout and start slideshow
			restart: function(){
				clearTimeout(interval[uid]);
				this.start();
			},

			// slides change
			changeTo: function(changeTo, handChange){
				clearTimeout(layerTimer);

				$.each(layerAnimation, function(i){
					this.stop(false, true);
					$(this).hide();
				});

				layerAnimation = [];

				// last slide
				if(changeTo != activeSlideNum){
					activeSlideNum = changeTo;
				}

				if(handChange === true){
					if(lastSlideNum === activeSlideNum){
						return false;
					}

					var tmp = stoped ? stoped = true : stoped = false;
					$this.slideshow.stop();
					stoped = tmp ? true : false;
					
					if(!cfg.slideshow.continuous){
						stoped = true;
						$this.navigation.changeState('stop');
					}
				}

				var currentSlide = slides.filter(".unoslider_active");
				var nextSlide = slides.filter(":eq("+ activeSlideNum +")");

				$this.main.setTransition(currentSlide, nextSlide, handChange);
				
				if (cfg.indicator !== false) {
					controls.find(".unoslider_indicator_active").removeClass("unoslider_indicator_active");
					controls.find("a:eq("+ activeSlideNum +")").addClass("unoslider_indicator_active");
				}

				lastSlideNum = activeSlideNum;
			},

			next: function(){
				var next = (activeSlideNum+1 == slides.length) ? 0 : activeSlideNum + 1;

				this.changeTo(next, true);
			},

			prev: function(){
				var prev = (activeSlideNum === 0) ? slides.length-1 : activeSlideNum - 1;
				this.changeTo(prev, true);
			},

			switchSlides: function(currentSlide, nextSlide){				
				currentSlide.css({
					display: 'none',
					'z-index': 0,
					position: 'relative',
					opacity: 0
				}).removeClass('unoslider_active');
				
				nextSlide.css({
					display: 'block',
					opacity: 1,
					position: 'relative',
					'z-index': 1
				}).addClass('unoslider_active');
			}
      
		};

		$this.tooltip = {

			height: 0,
			
			generate: function(){
				if(cfg.tooltip){
					var caption;
					var img;
					
					$this.find('.unoslider_caption').removeClass('unoslider_caption').addClass('unoslider_caption_data').hide();
				
					slides.each(function(){
						img = $(this).find('img');
	
						if(img.length >= 1){
							caption = img.attr('title');
							if(typeof caption !== 'undefined'){
								img.removeAttr('title');
								$('<div class="unoslider_caption_data">'+caption+'</div>').appendTo(this).hide();
							}
						}
					});
					
					$('<div class="unoslider_caption"></div>').hide().css({'z-index': 5}).appendTo($this);
				}else{
					$this.find('.unoslider_caption').remove();
				}
				
				this.height = $this.find('.unoslider_caption').height();
			},
			
			show: function(slide){
				var html = $(slide).find('.unoslider_caption_data').html();
				if(html) $this.find('.unoslider_caption').html(html).fadeIn();
			},
			
			hide: function(){
				$this.find('.unoslider_caption').fadeOut();
			}
		};

		$this.preset = {
			
			init: function(){
				if(cfg.preset in $this.preset){
					$this.preset[cfg.preset]();
				}else{
					alert('There is no preset named "'+cfg.preset+'"');
				}
			},
			
			// calculate number of blocks
			autosize: function(){
				var ratio = $this.width() / $this.height();
				var vertical = Math.round(ratio * ratio * (ratio / 2));
				var horizontal = Math.round(ratio * (ratio / 2));

				vertical = (typeof options === 'object' && typeof options.block !== 'undefined' && typeof options.block['vertical'] !== 'undefined') ? options.block['vertical'] : preset_base_cfg.block['vertical'];
				horizontal = (typeof options === 'object' && typeof options.block !== 'undefined' && typeof options.block['horizontal'] !== 'undefined') ? options.block['horizontal'] : preset_base_cfg.block['horizontal'];

				var ret = {};
				ret['vertical'] = vertical;
				ret['horizontal'] = horizontal;

				return ret;
			},

			chess: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 300, delay: 300, transition: 'swap', variation: 'bottom', pattern: 'chess' };
			},
			flash: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 500, delay: 30, transition: 'flash', pattern: 'random' };
			},
			spiral_reversed: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 350, delay: 30, transition: 'shrink', variation: 'bottomright', pattern: 'spiral', direction: 'bottomright' };
			},
			spiral: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 350, delay: 30, transition: 'shrink', variation: 'topleft', pattern: 'spiral', direction: 'topleft' };
			},
			sq_appear: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 500, delay: 50, transition: 'appear', variation: 'topleft', pattern: 'diagonal', direction: 'topleft' };
			},
			sq_flyoff: function(){
				var block = this.autosize(); 
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] }; 
				cfg.animation = { speed: 400, delay: 100, transition: 'drop', variation: 'bottomright', pattern: 'diagonal', direction: 'topleft' };
			},
			sq_drop: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 600, delay: 150, transition: 'drop', variation: 'topleft', pattern: 'diagonal', direction: 'topleft' };
			},
			explode: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 500, delay: 50, transition: 'stretch', variation: 'center', pattern: 'explode', direction: 'center' };
			},
			implode: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 500, delay: 50, transition: 'squeeze', variation: 'center', pattern: 'implode', direction: 'center' };
			},
			sq_squeeze: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 600, delay: 100, transition: 'squeeze', variation: 'center', pattern: 'horizontal', direction: 'top' };
			},
			sq_random: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 500, delay: 20, transition: 'grow', variation: 'topleft', pattern: 'random' };
			},
			sq_diagonal_rev: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 500, delay: 50, transition: 'grow', variation: 'bottomright', pattern: 'diagonal', direction: 'bottomright' };
			},
			sq_diagonal: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 500, delay: 50, transition: 'grow', variation: 'topleft', pattern: 'diagonal', direction: 'topleft' };
			},
			sq_fade_random: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 600, delay: 20, transition: 'fade', pattern: 'random' };
			},
			sq_fade_diagonal_rev: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 600, delay: 100, transition: 'fade', pattern: 'diagonal', direction: 'bottomright' };
			},
			sq_fade_diagonal: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: block['horizontal'] };
				cfg.animation = { speed: 600, delay: 100, transition: 'fade', pattern: 'diagonal', direction: 'topleft' };
			},
			fountain: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 100, transition: 'slide_in', variation: 'bottom', pattern: 'explode', direction: 'center' };
			},
			blind_bottom: function(){
				var block = this.autosize();
				cfg.block = { vertical: 1, horizontal: block['horizontal'] };
				cfg.animation = { speed: 800, delay: 80, transition: 'swap', variation: 'top', pattern: 'horizontal', direction: 'bottom' };
			},
			blind_top: function(){
				var block = this.autosize();
				cfg.block = { vertical: 1, horizontal: block['horizontal'] };
				cfg.animation = { speed: 800, delay: 80, transition: 'swap', variation: 'bottom', pattern: 'horizontal', direction: 'top' };
			},
			blind_right: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 800, delay: 80, transition: 'swap', variation: 'right', pattern: 'horizontal', direction: 'topright' };
			},
			blind_left: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 800, delay: 80, transition: 'swap', variation: 'right', pattern: 'horizontal', direction: 'topleft' };
			},
			shot_right: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 50, transition: 'stretch', variation: 'horizontal', pattern: 'horizontal', direction: 'topright' };
			},
			shot_left: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 50, transition: 'stretch', variation: 'horizontal', pattern: 'horizontal', direction: 'topleft' };
			},
			alternate_vertical: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 800, delay: 0, transition: 'slide_in', variation: 'alternate_vertical', pattern: 'vertical', direction: 'topleft' };
			},
			alternate_horizontal: function(){
				var block = this.autosize();
				cfg.block = { vertical: 1, horizontal: block['horizontal'] };
				cfg.animation = { speed: 800, delay: 0, transition: 'slide_in', variation: 'alternate_horizontal', pattern: 'horizontal', direction: 'topleft' };
			},
			zipper_right: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 80, transition: 'slide_in', variation: 'alternate_vertical', pattern: 'horizontal', direction: 'topright' };
			},
			zipper_left: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 80, transition: 'slide_in', variation: 'alternate_vertical', pattern: 'horizontal', direction: 'topleft' };
			},
			bar_slide_random: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 70, transition: 'slide_in', pattern: 'random' };
			},
			bar_slide_bottomright: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 70, transition: 'slide_in', variation: 'bottom', pattern: 'horizontal', direction: 'bottomright' };
			},
			bar_slide_bottomleft: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 70, transition: 'slide_in', variation: 'bottom', pattern: 'horizontal', direction: 'bottomleft' };
			},
			bar_slide_topright: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 70, transition: 'slide_in', variation: 'top', pattern: 'horizontal', direction: 'topright' };
			},
			bar_slide_topleft: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 70, transition: 'slide_in', variation: 'top', pattern: 'horizontal', direction: 'topleft' };
			},
			bar_fade_bottom: function(){
				var block = this.autosize();
				cfg.block = { vertical: 1, horizontal: block['horizontal'] };
				cfg.animation = { speed: 500, delay: 100, transition: 'fade', pattern: 'horizontal', direction: 'bottom' };
			},
			bar_fade_top: function(){
				var block = this.autosize();
				cfg.block = { vertical: 1, horizontal: block['horizontal'] };
				cfg.animation = { speed: 500, delay: 100, transition: 'fade', pattern: 'horizontal', direction: 'top' };
			},
			bar_fade_right: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 50, transition: 'fade', pattern: 'horizontal', direction: 'topright' };
			},
			bar_fade_left: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 50, transition: 'fade', pattern: 'horizontal', direction: 'topleft' };
			},
			bar_fade_random: function(){
				var block = this.autosize();
				cfg.block = { vertical: block['vertical'], horizontal: 1 };
				cfg.animation = { speed: 500, delay: 50, transition: 'fade', pattern: 'random' };
			},
			v_slide_top: function(){
				cfg.block = { vertical: 1, horizontal: 1 };
				cfg.animation = { speed: 500, delay: 0, transition: 'slide_in', variation: 'top', pattern: 'horizontal', direction: 'topleft' };
			},
			h_slide_right: function(){
				cfg.block = { vertical: 1, horizontal: 1 };
				cfg.animation = { speed: 500, delay: 0, transition: 'slide_in', variation: 'right', pattern: 'horizontal', direction: 'topleft' };
			},
			v_slide_bottom: function(){
				cfg.block = { vertical: 1, horizontal: 1 };
				cfg.animation = { speed: 500, delay: 0, transition: 'slide_in', variation: 'bottom', pattern: 'horizontal', direction: 'topleft' };
			},
			h_slide_left: function(){
				cfg.block = { vertical: 1, horizontal: 1 };
				cfg.animation = { speed: 500, delay: 0, transition: 'slide_in', variation: 'left', pattern: 'horizontal', direction: 'topleft' };
			},
			stretch: function(){
				cfg.block = { vertical: 1, horizontal: 1 };
				cfg.animation = { speed: 800, delay: 0, transition: 'stretch', variation: 'horizontal', pattern: 'horizontal', direction: 'topleft' };
			},
			squeez: function(){
				cfg.block = { vertical: 1, horizontal: 1 };
				cfg.animation = { speed: 800, delay: 0, transition: 'squeeze', variation: 'horizontal', pattern: 'horizontal', direction: 'topleft' };
			},
			fade: function(){
				cfg.block = { vertical: 1, horizontal: 1 };
				cfg.animation = { speed: 700, delay: 0, transition: 'fade', pattern: 'horizontal', direction: 'topleft' };
			},
			none: function(){
				cfg.block = { vertical: 1, horizontal: 1 };
				cfg.animation = { speed: 0, delay: 0, transition: 'fade', pattern: 'horizontal', direction: 'topleft' };
			}
		};

		$this.transition = {
			
			speed: function(){
				var speed = cfg.animation.speed;

				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].animation != 'undefined') && (typeof cfg[activeSlideNum+1].animation.speed != 'undefined')){
					speed = cfg[activeSlideNum+1].animation.speed;
				}
				
				return speed;
			},

			animation: function(direction, animate, duration){
				var row = 1;
				var col = 1;
				var item = 0;
				
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));

						$this.find("#block_" + item).delay(direction['zpozdeni'][item]).animate(animate, {duration: duration});
						col++;
					}
					row++; col = 1;
				}
			},

			base_animation: function(css, animate, delayed, direction, currentSlide, nextSlide, handChange){
				var duration = this.speed();
				
				$this.find('.unoslider_cube').css(css);
				
				this.animation(direction, animate, duration);
				
				$this.main.execute(direction, duration, currentSlide, nextSlide, handChange, delayed);
			},
			move_animation: function(css, animate, direction, opacity, currentSlide, nextSlide, handChange){
				var duration = this.speed();
				
				$this.find('.unoslider_cube').css({
					display: 'block',
					opacity: opacity
				});
				
				$this.find('.unoslider_blocks').css(css);
				
				this.animation(direction, animate, duration);

				$this.main.execute(direction, duration, currentSlide, nextSlide, handChange, true);
			},
			drop_animation: function(animate, direction, currentSlide, nextSlide, handChange){
				var duration = this.speed();
				
				$this.find('.unoslider_cube').css({
					display: 'block',
					opacity: 1
				});
				
				this.animation(direction, animate, duration);

				$this.main.execute(direction, duration, currentSlide, nextSlide, handChange, false);
			},

			alternate_animation: function(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, delayed){
				var duration = this.speed();
				var row = 1;
				var col = 1;
				var item = 0;
				
				$this.find('.unoslider_cube:even').css(css_even);
			
				$this.find('.unoslider_cube:odd').css(css_odd);

				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));

						$this.find("#block_" + item).delay(direction['zpozdeni'][item]).animate(item % 2 == 1 ? animate_even : animate_odd, { duration: duration });

						col++;
					}
					row++; col = 1;
				}

				$this.main.execute(direction, duration, currentSlide, nextSlide, handChange, delayed);
			},

			fade: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var css = {
					display: 'block',
					width: block.width,
					height: block.height
				};
				
				var animate = {
					opacity: 0
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			},
			
			flash: function(currentSlide, nextSlide, handChange){
				var duration = this.speed();
				var row = 1;
				var col = 1;
				var item = 0;
				var selector;

				var direction = $this.main.prepare(currentSlide);
				
				var color = 'white';
				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].animation != 'undefined') && (typeof cfg[activeSlideNum+1].animation.color != 'undefined')){
					color = cfg[activeSlideNum+1].animation.color;
				}else if((typeof cfg != 'undefined') && (typeof cfg.animation != 'undefined') && (typeof cfg.animation.color != 'undefined')){
					color = cfg.animation.color;
				}
				
				$this.find('.unoslider_cube').css({
					display: 'block',
					backgroundColor: color
				});

				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));

						selector = "#block_" + item;

						$this.find(selector).delay(direction['zpozdeni'][item]).animate({
							opacity: 0
						}, {
							duration: duration
						});
						
						$this.find(selector).children().delay(direction['zpozdeni'][item]).animate({
							opacity: 0
						}, {
							duration: 0
						});

						col++;
					}
					row++;
					col = 1;
				}

				$this.main.execute(direction, duration, currentSlide, nextSlide, handChange, false);
			}, 
			
			appear_topleft: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css = {
					top: ''+(block.height * 2)+'px',
					left: ''+(block.height * 2)+'px'
				};
				
				var animate = {
					top: '-='+(block.height*2)+'px',
					left: '-='+(block.height*2)+'px',
					opacity: 1
				};
				
				this.move_animation(css, animate, direction, 0, currentSlide, nextSlide, handChange);
			},
			appear_topright: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					top: ''+(block.height * 2)+'px',
					left: '-'+(block.height * 2)+'px'
				};
				
				var animate = {
					top: '-='+(block.height*2)+'px',
					left: '+='+(block.height*2)+'px',
					opacity: 1
				};
				
				this.move_animation(css, animate, direction, 0, currentSlide, nextSlide, handChange);
			},
			appear_bottomleft: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					top: '-'+(block.height * 2)+'px',
					left: ''+(block.height * 2)+'px'
				};
				
				var animate = {
					top: '+='+(block.height*2)+'px',
					left: '-='+(block.height*2)+'px',
					opacity: 1
				};
				
				this.move_animation(css, animate, direction, 0, currentSlide, nextSlide, handChange);
			},
			appear_bottomright: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					top: '-'+(block.height * 2)+'px',
					left: '-'+(block.height * 2)+'px'
				};
				
				var animate = {
					top: '+='+(block.height*2)+'px',
					left: '+='+(block.height*2)+'px',
					opacity: 1
				};
				
				this.move_animation(css, animate, direction, 0, currentSlide, nextSlide, handChange);
			},
			appear_top: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					top: '-'+(block.height * 2)+'px'
				};
				
				var animate = {
					top: '+='+(block.height*2)+'px',
					opacity: 1
				};
				
				this.move_animation(css, animate, direction, 0, currentSlide, nextSlide, handChange);
			},
			appear_right: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					left: '+'+(block.width / 2)+'px'
				};
				
				var animate = {
					left: '-='+(block.width / 2)+'px',
					opacity: 1
				};
				
				this.move_animation(css, animate, direction, 0, currentSlide, nextSlide, handChange);
			},
			appear_bottom: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					top: '+'+(block.height * 2)+'px'
				};
				
				var animate = {
					top: '-='+(block.height*2)+'px',
					opacity: 1
				};
				
				this.move_animation(css, animate, direction, 0, currentSlide, nextSlide, handChange);
			},
			appear_left: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					left: '-'+(block.width / 2)+'px'
				};
				
				var animate = {
					left: '+='+(block.width / 2)+'px',
					opacity: 1
				};
				
				this.move_animation(css, animate, direction, 0, currentSlide, nextSlide, handChange);
			},
			appear_alternate_vertical: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var animate_odd = {
					top: '-='+(block.height*2)+'px',
					opacity: 1
				};
				
				var animate_even = {
					top: '+='+(block.height*2)+'px',
					opacity: 1
				};
					
				var css_even = {
					display: 'block',
					top: '-='+(block.height * 2)+'px',
					opacity: 0
				};
			
				var css_odd = {
					display: 'block',
					top: '+='+(block.height * 2)+'px',
					opacity: 0
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, true);
			},
			appear_alternate_horizontal: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var animate_odd = {
					left: '+='+(block.width*2)+'px',
					opacity: 1
				};
				
				var animate_even = {
					left: '-='+(block.width*2)+'px',
					opacity: 1
				};
					
				var css_even = {
					display: 'block',
					left: '+='+(block.width * 2)+'px',
					opacity: 0
				};
			
				var css_odd = {
					display: 'block',
					left: '-='+(block.width * 2)+'px',
					opacity: 0
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, true);
			},

			drop_topleft: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var animate = {
					top: '+='+(block.height*2)+'px',
					left: '+='+(block.height*2)+'px',
					opacity: 0
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			drop_topright: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var row = 1;
				var col = 1;
				var item = 0;
				
				var t = 1;
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));
				
						selector = "#block_" + item;
				
						$this.find(selector).css({
							'z-index': (t*columns*rows)-col
						});
				
						col++;
					}
					t++; row++; col = 1;
				}

				var animate = {
					top: '+='+(block.height*2)+'px',
					left: '-='+(block.height*2)+'px',
					opacity: 0
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			drop_bottomleft: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var row = 1;
				var col = 1;
				var item = 0;

				var t = columns*rows;
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));

						selector = "#block_" + item;

						$this.find(selector).css({
							'z-index': (t*columns*rows)+col
						});

						col++;
					}
					t--; row++; col = 1;
				}

				var animate = {
					top: '-='+(block.height*2)+'px',
					left: '+='+(block.height*2)+'px',
					opacity: 0
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			drop_bottomright: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var row = 1;
				var col = 1;
				var item = 0;

				var t = columns*rows;
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));

						selector = "#block_" + item;

						$this.find(selector).css({
							'z-index': (t+columns)-col
						});

						col++;
					}
					t--; row++; col = 1;
				}

				var animate = {
					top: '-='+(block.height*2)+'px',
					left: '-='+(block.height*2)+'px',
					opacity: 0
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			drop_top: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var animate = {
					top: '+='+(block.height*2)+'px',
					opacity: 0
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			drop_right: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var row = 1;
				var col = 1;
				var item = 0;
				
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));
				
						selector = "#block_" + item;
				
						$this.find(selector).css({
							'z-index': (columns*rows)-col
						});
				
						col++;
					}
					row++; col = 1;
				}

				var animate = {
					left: '-='+(block.height*2)+'px',
					opacity: 0
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			drop_bottom: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var row = 1;
				var col = 1;
				var item = 0;
				
				var t = columns*rows;
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));

						selector = "#block_" + item;

						$this.find(selector).css({
							'z-index': (t*columns*rows)+col
						});

						col++;
					}
					t--; row++; col = 1;
				}
				
				var animate = {
					top: '-='+(block.height*2)+'px',
					opacity: 0
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			drop_left: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var animate = {
					left: '+='+(block.height*2)+'px',
					opacity: 0
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			drop_alternate_vertical: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var animate_odd = {
					top: '+='+(block.height*2)+'px',
					opacity: 0
				};
					
				var css_even = {
					display: 'block'
				};
			
				var css_odd = {
					display: 'block'
				};
				
				var row = 1;
				var col = 1;
				var item = 0;
				
				var t = columns*rows;
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));
				
						selector = "#block_" + item;
				
						$this.find(selector).css({
							'z-index': (t*columns*rows)+col
						});
				
						col++;
					}
					t--; row++; col = 1;
				}
				
				var animate_even = {
					top: '-='+(block.height*2)+'px',
					opacity: 0
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, false);
			},
			drop_alternate_horizontal: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var animate_odd = {
					left: '+='+(block.width*2)+'px',
					opacity: 0
				};
					
				var css_even = {
					display: 'block',
					opacity: 1
				};
			
				var css_odd = {
					display: 'block',
					opacity: 1
				};
				
				var row = 1;
				var col = 1;
				var item = 0;
				
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));
				
						selector = "#block_" + item;
				
						$this.find(selector).css({
							'z-index': (columns*rows)-col
						});
				
						col++;
					}
					row++; col = 1;
				}

				var animate_even = {
					left: '-='+(block.width*2)+'px',
					opacity: 0
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, false);
			},
			
			slide_in_bottom: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					top: '+'+(block.height * rows)+'px'
				};
				
				var animate = {
					top: '-='+(block.height * rows)+'px'
				};
				
				this.move_animation(css, animate, direction, 1, currentSlide, nextSlide, handChange);
			},
			slide_in_right: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					left: '+'+(block.width * columns)+'px'
				};
				
				var animate = {
					left: '-='+(block.width * columns)+'px'
				};
				
				this.move_animation(css, animate, direction, 1, currentSlide, nextSlide, handChange);
			},
			slide_in_top: function(currentSlide, nextSlide, handChange, type){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					top: '-'+(block.height * rows)+'px'
				};
				
				var animate = {
					top: '+='+(block.height * rows)+'px'
				};
				
				this.move_animation(css, animate, direction, 1, currentSlide, nextSlide, handChange);
			},
			slide_in_left: function(currentSlide, nextSlide, handChange, type){
				var direction = $this.main.prepare(nextSlide);

				var css = {
					left: '-'+(block.width * columns)+'px'
				};
				
				var animate = {
					left: '+='+(block.width * columns)+'px'
				};
				
				this.move_animation(css, animate, direction, 1, currentSlide, nextSlide, handChange);
			},
			slide_in_alternate_vertical: function(currentSlide, nextSlide, handChange, type){
				var direction = $this.main.prepare(nextSlide);
				
				var animate_odd = {
					top: '+='+(block.height * rows)+'px'
				};
				
				var animate_even = {
					top: '-='+(block.height * rows)+'px'
				};
					
				var css_even = {
					display: 'block',
					top: '+='+(block.height * rows)+'px'
				};
			
				var css_odd = {
					display: 'block',
					top: '-='+(block.height * rows)+'px'
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, true);
			},
			slide_in_alternate_horizontal: function(currentSlide, nextSlide, handChange, type){
				var direction = $this.main.prepare(nextSlide);
				
				var animate_odd = {
					left: '+='+(block.width * columns)+'px'
				};
				
				var animate_even = {
					left: '-='+(block.width * columns)+'px'
				};
					
				var css_even = {
					display: 'block',
					left: '+='+(block.width * columns)+'px'
				};
			
				var css_odd = {
					display: 'block',
					left: '-='+(block.width * columns)+'px'
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, true);
			},
			
			slide_out_top: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var animate = {
					top: '+='+(block.height*rows)+'px'
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			slide_out_right: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var row = 1;
				var col = 1;
				var item = 0;
				
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));
				
						selector = "#block_" + item;
				
						$this.find(selector).css({
							'z-index': (columns*rows)-col
						});
				
						col++;
					}
					row++; col = 1;
				}

				var animate = {
					left: '-='+(block.width*columns)+'px'
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			slide_out_bottom: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var row = 1;
				var col = 1;
				var item = 0;
				
				var t = columns*rows;
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));

						selector = "#block_" + item;

						$this.find(selector).css({
							'z-index': (t*columns*rows)+col
						});

						col++;
					}
					t--; row++; col = 1;
				}
				
				var animate = {
					top: '-='+(block.height*rows)+'px'
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			slide_out_left: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var animate = {
					left: '+='+(block.width*columns)+'px'
				};
				
				this.drop_animation(animate, direction, currentSlide, nextSlide, handChange);
			},
			slide_out_alternate_vertical: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var animate_odd = {
					top: '+='+(block.height*rows)+'px'
				};
					
				var css_even = {
					display: 'block'
				};
			
				var css_odd = {
					display: 'block'
				};
				
				var row = 1;
				var col = 1;
				var item = 0;
				
				var t = columns*rows;
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));
				
						selector = "#block_" + item;
				
						$this.find(selector).css({
							'z-index': (t*columns*rows)+col
						});
				
						col++;
					}
					t--; row++; col = 1;
				}
				
				var animate_even = {
					top: '-='+(block.height*rows)+'px'
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, false);
			},
			slide_out_alternate_horizontal: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var animate_odd = {
					left: '+='+(block.width*columns)+'px'
				};
					
				var css_even = {
					display: 'block'
				};
			
				var css_odd = {
					display: 'block'
				};
				
				var row = 1;
				var col = 1;
				var item = 0;
				
				while (row <= rows) {
					while (col <= columns) {
						item = (columns * row - (columns - col));
				
						selector = "#block_" + item;
				
						$this.find(selector).css({
							'z-index': (columns*rows)-col
						});
				
						col++;
					}
					row++; col = 1;
				}

				var animate_even = {
					left: '-='+(block.width*columns)+'px'
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, false);
			},
			
			grow_topleft: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css = {
					display: 'block',
					width: 0,
					height: 0
				};
				
				var animate = {
					width: block.width,
					height: block.height
				};
				
				this.base_animation(css, animate, true, direction, currentSlide, nextSlide, handChange);
			},
			grow_topright: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css = {
					display: 'block',
					width: 0,
					height: 0,
					left: '+='+(block.width)+'px'
				};
				
				var animate = {
					width: block.width,
					height: block.height,
					left: '-='+(block.width)+'px'
				};
				
				this.base_animation(css, animate, true, direction, currentSlide, nextSlide, handChange);
			},
			grow_bottomleft: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css = {
					display: 'block',
					width: 0,
					height: 0,
					top: '+='+(block.height)+'px'
				};
				
				var animate = {
					width: block.width,
					height: block.height,
					top: '-='+(block.height)+'px'
				};
				
				this.base_animation(css, animate, true, direction, currentSlide, nextSlide, handChange);
			},
			grow_bottomright: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css = {
					display: 'block',
					width: 0,
					height: 0,
					top: '+='+(block.height)+'px',
					left: '+='+(block.width)+'px'
				};
				
				var animate = {
					width: block.width,
					height: block.height,
					top: '-='+(block.height)+'px',
					left: '-='+(block.width)+'px'
				};
				
				this.base_animation(css, animate, true, direction, currentSlide, nextSlide, handChange);
			},

			shrink_topleft: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var css = {
					display: 'block'
				};
				
				var animate = {
					height: 0,
					width: 0
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			},
			shrink_topright: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var css = {
					display: 'block'
				};
				
				var animate = {
					height: 0,
					width: 0,
					left: '+='+(block.width)+'px'
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			},
			shrink_bottomleft: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var css = {
					display: 'block'
				};
				
				var animate = {
					height: 0,
					width: 0,
					top: '+='+(block.height)+'px'
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			},
			shrink_bottomright: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var css = {
					display: 'block'
				};
				
				var animate = {
					height: 0,
					width: 0,
					top: '+='+(block.height)+'px',
					left: '+='+(block.width)+'px'
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			},

			squeeze_center: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var css = {
					display: 'block'
				};
				
				var animate = {
					height: 0,
					width: 0,
					top: '+='+(block.height / 2)+'px',
					left: '+='+(block.width / 2)+'px'
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			},
			squeeze_vertical: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var css = {
					display: 'block'
				};
				
				var animate = {
					width: 0,
					left: '+='+(block.width / 2)+'px'
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			},
			squeeze_horizontal: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);

				var css = {
					display: 'block'
				};
				
				var animate = {
					height: 0,
					top: '+='+(block.height / 2)+'px'
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			},
			squeeze_alternate: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var css_odd = {
					display: 'block'
				};
				
				var animate_odd = {
					width: 0,
					left: '+='+(block.width / 2)+'px'
				};
				
				var css_even = {
					display: 'block'
				};
				
				var animate_even = {
					height: 0,
					top: '+='+(block.height / 2)+'px'
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, false);
			},
			
			stretch_vertical: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css = {
					display: 'block',
					width: 0,
					left: '+='+(block.width / 2)+'px'
				};
				
				var animate = {
					width: block.width,
					left: '-='+(block.width / 2)+'px'
				};
				
				this.base_animation(css, animate, true, direction, currentSlide, nextSlide, handChange);
			},
			stretch_horizontal: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css = {
					display: 'block',
					height: 0,
					top: '+='+(block.height / 2)+'px'
				};
				
				var animate = {
					height: block.height,
					top: '-='+(block.height / 2)+'px'
				};
				
				this.base_animation(css, animate, true, direction, currentSlide, nextSlide, handChange);
			},
			stretch_center: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
	
				var css = {
					display: 'block',
					height: 0,
					width: 0,
					top: '+='+(block.height / 2)+'px',
					left: '+='+(block.width / 2)+'px'
				};
				
				var animate = {
					height: block.height,
					width: block.width,
					top: '-='+(block.height / 2)+'px',
					left: '-='+(block.width / 2)+'px'
				};
				
				this.base_animation(css, animate, true, direction, currentSlide, nextSlide, handChange);
			},
			stretch_alternate: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css_odd = {
					display: 'block',
					height: 0,
					top: '+='+(block.height / 2)+'px'
				};
				
				var animate_odd = {
					height: block.height,
					top: '-='+(block.height / 2)+'px'
				};
				
				var css_even = {
					display: 'block',
					width: 0,
					left: '+='+(block.width / 2)+'px'
				};
				
				var animate_even = {
					width: block.width,
					left: '-='+(block.width / 2)+'px'
				};
				
				this.alternate_animation(css_even, css_odd, animate_even, animate_odd, direction, currentSlide, nextSlide, handChange, true);
			},

			swap_bottom: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css = {
					display: 'block',
					height: 0
				};
				
				var animate = {
					height: block.height
				};
				
				this.base_animation(css, animate, true, direction, currentSlide, nextSlide, handChange);
			}, 
			swap_top: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var css = {
					display: 'block'
				};
				
				var animate = {
					height: 0
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			}, 
			swap_right: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(nextSlide);
				
				var css = {
					display: 'block',
					width: 0
				};
				
				var animate = {
					width: block.width
				};
				
				this.base_animation(css, animate, true, direction, currentSlide, nextSlide, handChange);
			}, 
			swap_left: function(currentSlide, nextSlide, handChange){
				var direction = $this.main.prepare(currentSlide);
				
				var css = {
					display: 'block'
				};
				
				var animate = {
					width: 0
				};
				
				this.base_animation(css, animate, false, direction, currentSlide, nextSlide, handChange);
			}

		};

		$this.direction = {
			
			delay: function(){
				var delay = cfg.animation.delay;

				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].animation != 'undefined') && (typeof cfg[activeSlideNum+1].animation.delay != 'undefined')){
					delay = cfg[activeSlideNum+1].animation.delay;
				}

				return delay;
			},
			
			direction: function(){
				var direction = cfg.animation.direction;

				if((typeof cfg[activeSlideNum+1] != 'undefined') && (typeof cfg[activeSlideNum+1].animation != 'undefined') && (typeof cfg[activeSlideNum+1].animation.direction != 'undefined')){
					direction = cfg[activeSlideNum+1].animation.direction;
				}

				return direction;
			},

			horizontal_top: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				while(row <= rows){
					while(column <= columns){
						item = (columns * row - (columns - column));
						delay = blockDelay * row;
						delays[item] = delay;

						column++;
					}
					row++;
					column = 1;
				}

				result['celkem'] = delay;
				result['zpozdeni'] = delays;

				return result;
			},
			horizontal_bottom: function(){
				var top = $this.direction.horizontal_top();

				top['zpozdeni'][top['zpozdeni'].length] = 0;
				top['zpozdeni'].reverse();

				return top;
			},
			horizontal_topleft: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				while(row <= rows){
					while(column <= columns){
						item = (columns * row - (columns - column));
						delay = blockDelay * item;
						delays[item] = delay;

						column++;
						}
						row++;
						column = 1;
				}

				result['celkem'] = delay;
				result['zpozdeni'] = delays;

				return result;
			},
			horizontal_topright: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				var t = 0;

				while(row <= rows){
					while(column <= columns){
						item = (columns * row - (columns - column));
						t = column-1;
						delay = blockDelay * columns * row - (t*blockDelay);
						delays[item] = delay;

						column++;
					}
					row++;
					column = 1;
				}

				var max = item * blockDelay;

				result['celkem'] = max;
				result['zpozdeni'] = delays;

				return result;
			},
			horizontal_bottomleft: function(){
				var topRight = $this.direction.horizontal_topright();

				topRight['zpozdeni'][topRight['zpozdeni'].length] = 0;
				topRight['zpozdeni'].reverse();

				return topRight;
			},
			horizontal_bottomright: function(){
				var topLeft = $this.direction.horizontal_topleft();

				topLeft['zpozdeni'][topLeft['zpozdeni'].length] = 0;
				topLeft['zpozdeni'].reverse();

				return topLeft;
			},

			vertical_left: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				while(row <= rows){
					while(column <= columns){

						delay = (blockDelay * column);
						item = (columns * row - (columns - column));
						delays[item] = delay;

						column++;
					}
					row++;
					column = 1;
				}

				result['celkem'] = delay;
				result['zpozdeni'] = delays;

				return result;
			},
			vertical_right: function(){
				var left = $this.direction.vertical_left();

				left['zpozdeni'][left['zpozdeni'].length] = 0;
				left['zpozdeni'].reverse();

				return left;
			},
			vertical_topleft: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				while(row <= rows){
					delay = (blockDelay * row);
					while(column <= columns){
						item = (columns * row - (columns - column));
						delays[item] = delay;
						delay += rows * blockDelay;

						column++;
					}
					row++;
					column = 1;
				}

				var max = item * blockDelay;

				result['celkem'] = max;
				result['zpozdeni'] = delays;

				return result;
			},
			vertical_topright: function(){
				var bottomLeft = $this.direction.vertical_bottomleft();

				bottomLeft['zpozdeni'][bottomLeft['zpozdeni'].length] = 0;
				bottomLeft['zpozdeni'].reverse();

				return bottomLeft;
			},
			vertical_bottomleft: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				var t = 0;

				while(row <= rows){
					while(column <= columns){
						item = (columns * row - (columns - column));
						t = row-1;
						delay = blockDelay * rows * column - (t*blockDelay);
						delays[item] = delay;

						column++;
					}
					row++;
					column = 1;
				}

				var max = item * blockDelay;

				result['celkem'] = max;
				result['zpozdeni'] = delays;

				return result;
			},
			vertical_bottomright: function(){
				var topLeft = $this.direction.vertical_topleft();

				topLeft['zpozdeni'][topLeft['zpozdeni'].length] = 0;
				topLeft['zpozdeni'].reverse();

				return topLeft;
			},

			diagonal_topleft: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				while(row <= rows){
					var x = row;
					while(column <= columns){
						item = (columns * row - (columns - column));
						delay = blockDelay * x;
						delays[item] = delay;

						column++;
						x++;
					}
					row++;
					column = 1;
				}

				result['celkem'] = delay;
				result['zpozdeni'] = delays;

				return result;
			},
			diagonal_topright: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];
				var max = 0;

				while(row <= rows){
					var x = columns + (row-1);
					while(column <= columns){
						item = (columns * row - (columns - column));
						delay = blockDelay * x;
						delays[item] = delay;

						if(delay > max){
								max = delay;
						}

						column++;
						x--;
					}
					row++;
					column = 1;
				}

				result['celkem'] = max;
				result['zpozdeni'] = delays;

				return result;
			},
			diagonal_bottomright: function(){
				var topLeft = $this.direction.diagonal_topleft();

				topLeft['zpozdeni'][topLeft['zpozdeni'].length] = 0;
				topLeft['zpozdeni'].reverse();

				return topLeft;
			},
			diagonal_bottomleft: function(){
				var topRight = $this.direction.diagonal_topright();

				topRight['zpozdeni'][topRight['zpozdeni'].length] = 0;
				topRight['zpozdeni'].reverse();

				return topRight;
			},

			random: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];
				var tmp;
				var random = 0;

				while(row <= rows){
					while(column <= columns){
						item = (columns * row - (columns - column));

						delay = blockDelay * item;
						delays[item] = delay;

						column++;
					}
					row++;
					column = 1;
				}

				if(item) { 
					while(--item) {
						random = Math.floor(Math.random() * (item + 1));
						tmp = delays[random];
						delays[random] = delays[item];
						delays[item] = tmp;
					}
				}

				result['celkem'] = delay;
				result['zpozdeni'] = delays;

				return result;
			},

			spiral_topleft: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				var i,j,c,r;
				var l = 0;

				while(row <= rows){
					while(column <= columns){
						item = (columns * row - (columns - column));

						delay = blockDelay * item;
						delays[item] = delay;

						column++;
					}
					row++;
					column = 1;
				}

				var output_array = [rows.length];

				for(i = 0; i < rows; i++){
					output_array[i] = [columns.length];
					for(j = 0; j < columns; j++){
						output_array[i][j] = j;
					}
				}

				for(i = 0, c = columns - 1, r = rows - 1; c >= 0 && r >= 0; i++, c--, r--){
					for(j = i; j <= c; j++){ // Traversing Forward
						if(l == rows * columns) break;
						output_array[i][j] = delays[l++];
					}
					
					for(j = i + 1; j <= r; j++){ // Traversing Downward
						if(l == rows * columns) break;
						output_array[j][c] = delays[l++];
					}
					
					for(j = c - 1; j >= i; j--){ // Traversing Backward
						if(l == rows * columns) break;
						output_array[r][j] = delays[l++];
					}
					
					for(j = r - 1; j > i; j--){ // Traversing Upward
						if(l == rows * columns) break;
						output_array[j][i] = delays[l++];
					}
				}

				for(i = 0; i < rows; i++){
					for(j = 0; j < columns; j++){
						item = (columns * (i+1) - (columns - (j+1)));
						delays[item] = output_array[i][j];
					}
				}

				result['celkem'] = delay;
				result['zpozdeni'] = delays;

				return result;
			},
			spiral_topright: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				var i,j,c,r;
				var l = 0;

				while(row <= rows){
					while(column <= columns){
						item = (columns * row - (columns - column));

						delay = blockDelay * item;
						delays[item] = delay;

						column++;
					}
					row++;
					column = 1;
				}

				var output_array = [rows.length];

				for(i = 0; i < rows; i++){
					output_array[i] = [columns.length];
					for(j = 0; j < columns; j++){
						output_array[i][j] = j;
					}
				}

				for(i = 0, c = columns - 1, r = rows - 1; c >= 0 && r >= 0; i++, c--, r--){
					for(j = i ; j <= c; j++){ // Traversing Forward
						if(l == rows * columns) break;
						output_array[i][j] = delays[l++];
					}
						
					for(j = i + 1; j <= r; j++){ // Traversing Downward
						if(l == rows * columns) break;
						output_array[j][c] = delays[l++];
					}
						
					for(j = c - 1; j >= i; j--){ // Traversing Backward
						if(l == rows * columns) break;
						output_array[r][j] = delays[l++];
					}
						
					for(j = r - 1; j > i; j--){ // Traversing Upward
						if(l == rows * columns) break;
						output_array[j][i] = delays[l++];
					}
				}

				for(i = 0; i < output_array.length; i++){
					output_array[i].reverse();
				}

				for(i = 0; i < rows; i++){
					for(j = 0; j < columns; j++){
						item = (columns * (i+1) - (columns - (j+1)));
						delays[item] = output_array[i][j];
					}
				}

				result['celkem'] = delay;
				result['zpozdeni'] = delays;

				return result;
			},
			spiral_bottomleft: function(){
				var topRight = $this.direction.spiral_topright();

				topRight['zpozdeni'][topRight['zpozdeni'].length] = 0;
				topRight['zpozdeni'].reverse();

				return topRight;
			},
			spiral_bottomright: function(){
				var topLeft = $this.direction.spiral_topleft();

				topLeft['zpozdeni'][topLeft['zpozdeni'].length] = 0;
				topLeft['zpozdeni'].reverse();

				return topLeft;
			},

			horizontal_zigzag_topleft: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];
				var multiplier = 0;
				var max = 0;
				var i = 1;

				while(row <= rows){
					while(column <= columns){
						item = (columns * row - (columns - column));

						if(i % 2 === 0){
							multiplier = (columns * row - column) + 1;
						}else{
							multiplier = item;
						}

						delay = blockDelay * multiplier;

						if(delay > max){
							max = delay;
						}

						delays[item] = delay;
						column++;
					}
					i++; row++; column = 1;
				}

				result['celkem'] = max;
				result['zpozdeni'] = delays;

				return result;
			},
			horizontal_zigzag_topright: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];
				var multiplier = 0;
				var max = 0;
				var i = 1;
				var tmp = [];

				while(row <= rows){
					delays = [];
					
					while(column <= columns){
						item = (columns * row - (columns - column));

						if(i % 2 === 0){
							multiplier = (columns * row - column) + 1;
						}else{
							multiplier = item;
						}

						delay = blockDelay * multiplier;
						if(delay > max) max = delay;
						
						delays[column] = delay;
						column++;
					}

					tmp[row] = delays.reverse();
					i++; row++; column = 1;
				}

				var ret = [];
				var x = 1;
				
				for(i = 1; i <= rows; i++) {
					for(var j = 0; j < columns; j++) {
						ret[x] = tmp[i][j];
						x++;
					}
				}

				result['celkem'] = max;
				result['zpozdeni'] = ret;

				return result;
			},
			horizontal_zigzag_bottomright: function(){
				var topLeft = $this.direction.horizontal_zigzag_topleft();

				topLeft['zpozdeni'][topLeft['zpozdeni'].length] = 0;
				topLeft['zpozdeni'].reverse();

				return topLeft;
			},
			horizontal_zigzag_bottomleft: function(){
				var topRight = $this.direction.horizontal_zigzag_topright();

				topRight['zpozdeni'][topRight['zpozdeni'].length] = 0;
				topRight['zpozdeni'].reverse();

				return topRight;
			},

			vertical_zigzag_topleft: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				while(row <= rows){
					delay = (blockDelay * row);

					while(column <= columns){
						item = (columns * row - (columns - column));

						delays[item] = delay;

						if(column % 2 === 0){
							delay += (row+(row-1)) * blockDelay;
						}else{
							delay += (rows-(row-1) + rows-(row)) * blockDelay;
						}

						column++;
					}
					row++; column = 1;
				}

				var max = item * blockDelay;

				result['celkem'] = max;
				result['zpozdeni'] = delays;
				
				return result;
			},
			vertical_zigzag_topright: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];
				var tmp = [];

				while(row <= rows){
					delay = (blockDelay * row);
					delays = [];
					
					while(column <= columns){
						item = (columns * row - (columns - column));

						delays[column] = delay;

						if(column % 2 === 0){
							delay += (row+(row-1)) * blockDelay;
						}else{
							delay += (rows-(row-1) + rows-(row)) * blockDelay;
						}

						column++;
					}

					tmp[row] = delays.reverse();

					row++; column = 1;
				}

				var ret = [];
				var x = 1;
				
				for(i = 1; i <= rows; i++){
					for(var j = 0; j < columns; j++){
						ret[x] = tmp[i][j];
						x++;
					}
				}

				var max = item * blockDelay;

				result['celkem'] = max;
				result['zpozdeni'] = ret;

				return result;
			},
			vertical_zigzag_bottomright: function(){
				var topLeft = $this.direction.vertical_zigzag_topleft();

				topLeft['zpozdeni'][topLeft['zpozdeni'].length] = 0;
				topLeft['zpozdeni'].reverse();

				return topLeft;
			},
			vertical_zigzag_bottomleft: function(){
				var topRight = $this.direction.vertical_zigzag_topright();

				topRight['zpozdeni'][topRight['zpozdeni'].length] = 0;
				topRight['zpozdeni'].reverse();

				return topRight;
			},

			chess: function(){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [0];
				var result = [];
				
				var mutator = 0;
				
				while(row <= rows){
					while(column <= columns){
						item = (columns * row - (columns - column));
				
						if(columns % 2 ==1){
							if(item % 2 == 1) delay = blockDelay;
							else              delay = blockDelay * 2;
						}else{
							if(((item + mutator) % 2) == 1) delay = blockDelay;
							else                            delay = blockDelay * 2;
						}
				
						delays[item] = delay;
				
						column++;
					}
					mutator++; row++; column = 1;
				}
				
				result['celkem'] = blockDelay*2;
				result['zpozdeni'] = delays;

				return result;
			},

			explode: function(center_column, center_row, index){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				while(row <= rows){
					while(column <= columns){

						item = (columns * row - (columns - column));
						
						if(row <= center_row){
							if(column <= center_column) delay = blockDelay * (((center_column - column) + 1) + (center_row - row));
							else                        delay = blockDelay * (((column - center_column) + 1) + (center_row - row));
						}else{
							if(column <= center_column) delay = blockDelay * (((center_column - column) + 1) + (row - center_row));
							else                        delay = blockDelay * (((column - center_column) + 1) + (row - center_row));
						}

						delays[item] = delay;
						column++;
					}
					row++; column = 1;
				}

				result['celkem'] = (typeof index !== 'undefined') ? delays[index] : delay;
				result['zpozdeni'] = delays;

				return result;
			},
			explode_center: function(){
				var center_column = Math.round(columns / 2);
				var center_row = Math.round(rows / 2);
				
				return this.explode(center_column, center_row);
			},
			explode_left: function(){
				var center_column = 1;
				var center_row = Math.round(rows / 2);
				
				return this.explode(center_column, center_row);
			},
			explode_right: function(){
				var center_column = columns;
				var center_row = Math.round(rows / 2);
				
				return this.explode(center_column, center_row, 1);
			},
			explode_top: function(){
				var center_column = Math.round(columns / 2);
				var center_row = 1;
				
				return this.explode(center_column, center_row);
			},
			explode_bottom: function(){
				var center_column = Math.round(columns / 2);
				var center_row = rows;
				
				return this.explode(center_column, center_row, 1);
			},

			implode: function(center_column, center_row){
				var blockDelay = this.delay();
				var row = 1;
				var column = 1;
				var item = 0;
				var delay = 0;
				var delays = [];
				var result = [];

				while(row <= rows){
					while(column <= columns){

						item = (columns * row - (columns - column));
						
						if(center_row != 1 && row <= center_row){
							if(center_column != 1 && column <= center_column) delay = blockDelay * ((row + column) - 1);
							else                       delay = blockDelay * ((row + (columns - column)));
						}else{
							if(center_column != 1 && column <= center_column) delay = blockDelay * ((((rows - row) + 1) + column) - 1);
							else                       delay = blockDelay * ((((rows - row) + 1) + (columns - column)));
						}

						delays[item] = delay;
						column++;
					}
					row++; column = 1;
				}
				
				result['zpozdeni'] = delays;
				
				delays.splice (0,1);
				result['celkem'] = Math.max.apply(Math, delays);
				delays.unshift(undefined);
				
				return result;
			},
			implode_center: function(){
				var center_column = Math.round(columns / 2);
				var center_row = Math.round(rows / 2);

				return this.implode(center_column, center_row);
			},
			implode_left: function(){
				var center_column = columns;
				var center_row = Math.round(rows / 2);
				
				return this.implode(center_column, center_row);
			},
			implode_right: function(){
				var center_column = 1;
				var center_row = Math.round(rows / 2);
				
				return this.implode(center_column, center_row);
			},
			implode_top: function(){
				var center_column = Math.round(columns / 2);
				var center_row = rows;

				return this.implode(center_column, center_row);
			},
			implode_bottom: function(){
				var center_column = Math.round(columns / 2);
				var center_row = 1;
				
				return this.implode(center_column, center_row);
			}
		};

		$this.preloader = {
			
			// initialize preloader
			init: function(callback){
				var images = $this.find('img');
				var imagesCount = images.length;
				
				slides.children().each(function(){
					var bg = $(this).css("background-image");
					if(bg !== 'none'){
						var bgImage = new Image;
						bgImage.src = bg.replace(/"/g,"").replace(/url\(|\)$/ig, "");
						images.push(bgImage);
					}
				});
				
				if(images.length > 0){
					$('<div class="unoslider_preloader"></div>').css({
						position: 'absolute',
						textAlign: 'center',
						width: '100%'
					}).prependTo($this);
				
					images.each(function(){
						var img = new Image;
						var $thisImg = $(this);

						img.src = this.src;

						if (!img.complete) {
							$(img).bind("load error", function(){
								$this.preloader.show($thisImg, callback, imagesCount);
							});
						} else {
							$this.preloader.show($thisImg, callback, imagesCount);
						}
					});
				}else{
					$(lists[0]).css("display", "block").animate({
						opacity: 1
					}, 500);
					
					if($.isFunction(callback)){
						callback.call();
					}
				}
			},
			
			// update progress and show the slider
			show: function(img, callback, imagesCount){
				loaded++;

				var loader = $this.find('.unoslider_preloader');

				if(loaded == imagesCount){
					$(lists[0]).css("display", "block").animate({
						opacity: 1
					}, 500, function () {
						loader.remove();
					});
				
					if($.isFunction(callback)){
						callback.call();
					}
				}
				
				switch(cfg.preloader){
					case 'spinner':
						$(loader).empty();
						$('<div class="unoslider_spinner"></div>').css({width: '100%', height: '100%'}).appendTo(loader);
						break;
					default:
						$(loader).empty();
						var progress = $('<span></span>').css({width: (loaded / imagesCount * 100).toFixed(0)+'%'});
						$(loader).css({'padding-top': $this.height() / 2 +'px', height: '50%'});
						$('<div class="unoslider_progress"></div>').appendTo(loader).append(progress);
						break;
				}
			}
		};
		
		// start slider
		$this.main.init();
		
		// public methods
		this.stop = function(){
			stoped = true;
			$this.navigation.changeState('stop');
			$this.slideshow.stop();
		};
		this.play = function(){
			if(stoped){
				$this.navigation.changeState('play');
				$this.slideshow.start();
				stoped = false;
			}
		};
		this.next = function(){
			if(running === false) $this.slideshow.next();
		};
		this.prev = function(){
			if(running === false) $this.slideshow.prev();
		};
		this.goto = function(num){
			if(running === false){ 
				if(num > slides.size()){
					alert("You can't go to slide number "+num+", slider contains only "+slides.size()+" slides");
				}else{
					$this.slideshow.changeTo(num-1, true);
				}
			}
		};
		this.cfg = function(config){
			$.extend(true, cfg, config);
		};
		
	};

	$.fn.unoslider = function(options){
		return (new $.UnoSlider(options, $(this)));
	};

	$.UnoSlider.defaults = {};

})(jQuery);