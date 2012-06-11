    $(document).ready(function($){
        $(".navi ul ul").each(function(){
            $(this).not(".navi ul ul ul").find("li:first").prepend('<div class="navi-element"></div>');
        }); 
    });
    $(document).ready(function($){
        // Fluid navi
    	if ($(".navi").length) {
    		$('.navi li').click(function(){
    			var url = $(this).find('a').attr('href');
    			document.location.href = url;
    		});
            $('.navi a span').each(function(){
                var buttonWidth = $(this).outerWidth();
                $(this).prev('.hover').css({'width': buttonWidth});
            });
    		$('.navi li a').hover(function(){
    			$(this).find('.hover').stop(true,true).slideDown();
    		},
    		function(){
    			$(this).find('.hover').stop(true,true).slideUp();
    		});
   	 }
    });
    $(document).ready(function($){
       	//##########################################
    	// Create Combo Navi
    	//##########################################	
    		
    	// Create the dropdown base
    	$("<select class='mobileNavi' />").appendTo(".mobileNavi_wrap");
    	
    	// Create default option "Go to..."
    	$("<option />", {
    	   "selected": "selected",
    	   "value"   : "",
    	   "text"    : "Navigation"
    	}).appendTo(".mobileNavi_wrap select");
    	
    	// Populate dropdown with menu items
    	$(".navi li").each(function() {
    	   
          var level = '';
          var len = $(this).parents('ul').length;
          for(i=1;i<len;i++){level += '&mdash;&nbsp;';}
          
          var link = $(this).find('a').attr('href');
          var text = level + $(this).clone().children('ul').remove().end().text();

          var options = '<option value="'+link+'">'+text+'</option>';

    	 $(options).appendTo(".mobileNavi_wrap select");
    	});
    
    	
    	//##########################################
    	// Combo Navigation action
    	//##########################################
    	
    	$(".mobileNavi").change(function() {
    	  location = this.options[this.selectedIndex].value;
    	});
    });