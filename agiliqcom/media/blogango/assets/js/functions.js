jQuery(document).ready(function() {	

    fluidResizeFrontVideo();
    fluidResizeCaruselSitemapVideo();
    portfolioGallery();
    fluidResizePortfolioImg();
    fluidResizeFullIframe();
    fluidResizeFullImg();
    postTagsHeight();
    fluidResizePostVideo();
    fluidResizeWorkVideo();
    homeOverlayItemWorkVideo();
    fluidResizePortfolioVideo1Column();
    fluidResizePortfolio1Column();
    fluidResizePortfolioVideo();
    portfolioOverlayItemWorkVideo();
    portfolioFilter(); 
	portfolioOverlayItemWork();
    fluidResizePortfolio();
    footerWidget();
    fluidResizeCaruselSitemap();
    fluidResizeCaruselWidget();
    fluidResizePostIframe();
    fluidResizePostImg();
    fluidResizeLayerSlider();
    sloganButton();
    fluidResizePost();
    homeOverlayItemWork();
    fluidResizeWork();
	hoverEffects();
	resizeVideos();
	
});
function resizeVideos() {
		$videos = $('iframe[src*="vimeo"],iframe[src*="youtube"]');
		$videos.each( function () {
		  var h = $(this).height();
		  var w = $(this).width();
		  
		  $(this).height(580/w*h);
		  $(this).width(580);
		});
}
function fluidResizeFrontVideo() {

	var $allImages = $("#slider iframe"),
	    $fluidEl = $("#slider");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizeFrontVideo() {

	var $allImages = $("#slider iframe"),
	    $fluidEl = $("#slider");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizeCaruselSitemapVideo() {

	var $allImages = $(".list_items-sitemap .item iframe"),
	    $fluidEl = $(".list_items-sitemap .item");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function portfolioGallery() {
    
    $(".portfolio-gallery li.three:nth-child(3n+1)").addClass('alpha');
    $(".portfolio-gallery li.three:nth-child(3n)").addClass('omega');

}
function fluidResizePortfolioImg() {

	var $allImages = $(".portfolio-gallery .three img"),
	    $fluidEl = $(".portfolio-gallery .three");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizeFullIframe() {

	var $allImages = $(".sixteen .frame iframe"),
	    $fluidEl = $(".sixteen .frame");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width()-8;
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizeFullImg() {

	var $allImages = $(".sixteen .frame img"),
	    $fluidEl = $(".sixteen");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width()-8;
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function postTagsHeight(){
    
    var height = $('.three.columns.tags').next('.nine.columns.omega').height()
    $('.three.columns.tags').css('height', height);
    
}
function fluidResizePostVideo() {

	var $allImages = $(".latest_news .post iframe"),
	    $fluidEl = $(".latest_news .post");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizeWorkVideo() {

	var $allImages = $(".work .item iframe"),
	    $fluidEl = $(".work .item");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function homeOverlayItemWorkVideo() {

  $(".work .vimeoOrYoutube").mouseenter(function() {
    $(this).next('.info').addClass('active');
  }).mouseleave(function(){
    $(this).next('.info').removeClass('active'); 
  });

}
function fluidResizePortfolioVideo1Column() {

	var $allImages = $(".function1 #portfolio .item .vimeoOrYoutube iframe"),
	    $fluidEl = $(".function1 #portfolio .img");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizePortfolio1Column() {

	var $allImages = $(".function1 #portfolio .item img"),
	    $fluidEl = $(".function1 #portfolio .img");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizePortfolioVideo() {

	var $allImages = $(".function #portfolio .item .vimeoOrYoutube iframe"),
	    $fluidEl = $(".function #portfolio .item");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function portfolioOverlayItemWorkVideo() {

  $("#portfolio .vimeoOrYoutube").mouseenter(function() {
    $(this).next('.info').addClass('active');
  }).mouseleave(function(){
    $(this).next('.info').removeClass('active'); 
  });

}
function portfolioFilter() {
	
	$('#portfolio').append('<ul class="portfolio-archive" />');
	$('.portfolio-archive').hide();
	
	$('.filter_navi li a').click(function() {
			
            
			var filter_navi = $(this).attr('rel');
			
            $('.filter_navi li').first().addClass('alpha');
            
			$('.filter_navi li a').removeClass('active');
			$(this).addClass('active');
			
			if($(this).attr('rel') == 'all') {
				$('.item').attr('rel', 'categ');
			}
			else {
				$('.item').each(function() {
					if($(this).hasClass(filter_navi)) {
						$(this).attr('rel', 'categ');
					}
					else {
						$(this).attr('rel', 'archive');
					}
				});
			}
			
            $('.portfolio-list').fadeOut(200, function() {
                $(".portfolio-list li").removeClass('alpha');
                $('.portfolio-list li').removeClass('omega');
    			$('.item[rel="categ"]').appendTo('.portfolio-list');
    			$('.item[rel="archive"]').appendTo('.portfolio-archive');
                $('.portfolio-list').fadeIn(500);
                $(".portfolio-2 .portfolio-list li:nth-child(2n+1)").addClass('alpha');
                $(".portfolio-2 .portfolio-list li:nth-child(2n)").addClass('omega');
                $(".portfolio-3 .portfolio-list li:nth-child(3n+1)").addClass('alpha');
                $(".portfolio-3 .portfolio-list li:nth-child(3n)").addClass('omega');
                $("._portfolio .portfolio-4 .portfolio-list li:nth-child(4n+1)").addClass('alpha');
                $("._portfolio .portfolio-4 .portfolio-list li:nth-child(4n)").addClass('omega');
                $("._portfolio-sidebar .portfolio-4 .portfolio-list li:nth-child(3n+1)").addClass('alpha');
                $("._portfolio-sidebar .portfolio-4 .portfolio-list li:nth-child(3n)").addClass('omega');
                
            });
    		
	});
    
	$('.filter_navi li a').eq(0).click();	
	
}
function portfolioOverlayItemWork() {

  $("#portfolio .img").mouseenter(function() {
    $(this).next('.info').addClass('active');
  }).mouseleave(function(){
    $(this).next('.info').removeClass('active'); 
  });

}
function fluidResizePortfolio() {

	var $allImages = $(".function #portfolio .item img"),
	    $fluidEl = $(".function #portfolio .item");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}

function footerWidget() {
   
$("#footer .four.columns").addClass(function(i) {
    return (i > 3 && 'widget-padding');
});
$('<div class="clear"></div>').insertAfter("#footer .four.columns:nth-child(4n)");

}
function fluidResizeCaruselSitemap() {

	var $allImages = $(".list_items-sitemap .item img"),
	    $fluidEl = $(".list_items-sitemap .item");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizeCaruselWidget() {

	var $allImages = $(".carousel-widget img"),
	    $fluidEl = $(".sidebar");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width()-8;
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizePostIframe() {

	var $allImages = $(".blog iframe"),
	    $fluidEl = $(".blog.twelve");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width()-8;
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizePostImg() {

	var $allImages = $(".blog .frame img"),
	    $fluidEl = $(".blog.twelve");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width()-8;
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizeLayerSlider() {

	var $allImages = $("#layerslider img"),
	    $fluidEl = $("#layerslider");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}

function sloganButton() {
    
    var moduleHeight = $('#bottomSlogan .four').prev('.twelve').height();
    var bnHeight = $('#bottomSlogan .four a').height();
    var Height = moduleHeight-bnHeight;
    
    $("#bottomSlogan .four").css('paddingTop', Height/2-9);

}
function fluidResizePost() {

	var $allImages = $(".latest_news .post img"),
	    $fluidEl = $(".latest_news .post");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function fluidResizeWork() {

	var $allImages = $(".work .item img"),
	    $fluidEl = $(".work .item");

	$allImages.each(function() {
		$(this)
			.data('aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');
	});

	$(window).resize(function() {
		var newWidth = $fluidEl.width();
		$allImages.each(function() {
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.data('aspectRatio'));
		});
	}).resize();

}
function homeOverlayItemWork() {

  $(".work .img").mouseenter(function() {
    $(this).next('.info').addClass('active');
  }).mouseleave(function(){
    $(this).next('.info').removeClass('active'); 
  });

}

function hoverEffects() {
    
jQuery("a.vimeo").hover(function() {
	jQuery(this).animate({ backgroundColor: "#44bbff" },{duration:200,queue:false}, 'easeInSine');
},function() {
	jQuery(this).animate({ backgroundColor: "#242424" },{duration:300,queue:false}, 'easeOutSine');
});
jQuery("a.twitter").hover(function() {
	jQuery(this).animate({ backgroundColor: "#1ec7ff" },{duration:200,queue:false}, 'easeInSine');
},function() {
	jQuery(this).animate({ backgroundColor: "#242424" },{duration:300,queue:false}, 'easeOutSine');
});
jQuery("a.facebook").hover(function() {
	jQuery(this).animate({ backgroundColor: "#3b5998" },{duration:200,queue:false}, 'easeInSine');
},function() {
	jQuery(this).animate({ backgroundColor: "#242424" },{duration:300,queue:false}, 'easeOutSine');
});
jQuery("a.youtube").hover(function() {
	jQuery(this).animate({ backgroundColor: "#c4302b" },{duration:200,queue:false}, 'easeInSine');
},function() {
	jQuery(this).animate({ backgroundColor: "#242424" },{duration:300,queue:false}, 'easeOutSine');
});
jQuery("a.google").hover(function() {
	jQuery(this).animate({ backgroundColor: "#d84937" },{duration:200,queue:false}, 'easeInSine');
},function() {
	jQuery(this).animate({ backgroundColor: "#242424" },{duration:300,queue:false}, 'easeOutSine');
});
jQuery("a.linkedin").hover(function() {
	jQuery(this).animate({ backgroundColor: "#006699" },{duration:200,queue:false}, 'easeInSine');
},function() {
	jQuery(this).animate({ backgroundColor: "#242424" },{duration:300,queue:false}, 'easeOutSine');
});
}
