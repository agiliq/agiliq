jQuery(document).ready(function() {
    carouFredSel();
    carouFredSelSitemap();
    sidebarCarouFredSel();
    footerCarouFredSel();
	carouFredSelFilter();
	
});

function carouFredSel() {

    if(screen.width < 500 || 
    navigator.userAgent.match(/Android/i) || 
    navigator.userAgent.match(/webOS/i) || 
    navigator.userAgent.match(/iPhone/i) || 
    navigator.userAgent.match(/iPod/i)){
        var iTems = 1;
    }else{
        var iTems = 3;
    }
	$('.list_items').carouFredSel({
        width   : "100%",
        align : 'left',
        //height   : "auto",
		circular: false,
		infinite: false,
		auto : false,
		pagination  : {
			container : '.pager',
			items : iTems
		}
	});
}
function carouFredSelSitemap() {
    if(screen.width < 500 || 
    navigator.userAgent.match(/Android/i) || 
    navigator.userAgent.match(/webOS/i) || 
    navigator.userAgent.match(/iPhone/i) || 
    navigator.userAgent.match(/iPod/i)){
        var iTems = 1;
    }else{
        var iTems = 3;
    }
	$('.list_items-sitemap').carouFredSel({
        width   : "100%",
        align : 'left',
        //height   : "auto",
		circular: false,
		infinite: false,
		auto : false,
		pagination  : {
			container : '.pager-sitemap',
			items : iTems
		}
	});
}
function sidebarCarouFredSel() {
	$('.sidebar .sidebar_list_items').carouFredSel({
        width   : "100%",
        align : 'left',
        //height   : "auto",
		circular: false,
		infinite: false,
		auto : false,
		pagination  : {
			container : '.sidebar .pager',
			items : 1
		}
	});
}
function footerCarouFredSel() {
	$('#footer .sidebar_list_items').carouFredSel({
        width   : "100%",
        align : 'left',
        //height   : "auto",
		circular: false,
		infinite: false,
		auto : false,
		pagination  : {
			container : '#footer .pager',
			items : 1
		}
	});
}	
function carouFredSelFilter() {
	
	$('.list_carousel').append('<ul class="list_archive" />');
	$('.list_archive').hide();
	
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
			
            $('.list_items').fadeOut(300, function() {
    			$('.item[rel="categ"]').appendTo('.list_items');
    			$('.item[rel="archive"]').appendTo('.list_archive');
            $('.list_items').fadeIn(300);
            if($('.list_items')) carouFredSel();
            });
    		
	});
    
	$('.filter_navi li a').eq(0).click();	
	
}