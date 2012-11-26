$(document).ready(function(){

	$('#unoslider').unoslider({
		width: 940,
		height: 378,
        preloader: 'spinner',
        slideshow: {
            speed: 3,
            timer: false,
            hoverPause: true,
        },
        indicator:{
            autohide: true
        },
        1: { // for slide no. 1
            block: { 
                horizontal: 10,
                vertical: 1, 
            },
             animation: { 
                transition: 'fade',
                pattern: 'horizontal',
                direction: 'top'  
            } 
        },
        2: { // for slide no. 2
            animation: { 
                speed: 500, 
                delay: 50, 
                transition: 'fade',
                pattern: 'random' // set only pattern  
            } 
        },
        3: { // for slide no. 3 
            animation: { 
                speed: 500, 
                delay: 100, 
                transition: 'flash', 
                color: '#ffffff', // set flash color 
                pattern: 'diagonal', 
                direction: 'topleft' // one of the above list of directions   
            } 
        },
        4: { // for slide no. 4
            block: {
                horizontal: 5, 
            }, 
            animation: {
                speed: 500, 
                delay: 50, 
                transition: 'shrink',
                pattern: 'diagonal', 
                direction: 'bottomright' // one of the above list of directions   
            } 
        },
        5: { // for slide no. 5
            block: {
                horizontal: 1,
                vertical: 20  
            }, 
            animation: { 
                speed: 500, 
                delay: 50, 
                transition: 'swap',
                variation: 'top',
            } 
        },
        6: { // for slide no. 6 
            animation: { 
                speed: 500, 
                delay: 100, 
                transition: 'fade',
                pattern: 'implode',
                direction: 'center' // one of the above list of directions   
            } 
        },
        8: { // for slide no. 0
            block: {
                horizontal: 1,
                vertical: 20  
            }, 
            animation: { 
                speed: 500, 
                delay: 50,
                transition: 'slide_in',
                variation: 'top',
                pattern: 'vertical',
                direction: 'left' // one of the above list of directions  
            } 
        },
        9: { // for slide no. 9 
            animation: { 
                speed: 500, 
                delay: 50, 
                transition: 'flash', 
                color: '#ffffff', // set flash color 
                pattern: 'explode',
                direction: 'center' // one of the above list of directions   
            } 
        },
	});

});