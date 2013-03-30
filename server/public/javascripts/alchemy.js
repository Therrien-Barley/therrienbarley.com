$(document).ready(function() { 

	console.log('blah');

	$('#nav .menu').hover(function(){
		if(!$(this).hasClass('active-menu')){
			$(this).addClass('open');
		}
	}, function(){
		if(!$(this).hasClass('active-menu')){
			$(this).removeClass('open');
		}
	});

	$('.categories-icon i').hover(function(){
		var $img = $(this).closest('.categories-icon').find('img');
		$img.show();
		console.log('$img.height() '+ $img.attr('width'));
		$img.height( $img.attr('height') );
		$img.css( 'maxHeight', $img.attr('height') );
		$img.width( $img.attr('width') );
		$img.css( 'maxWidth', $img.attr('width') );
	}, function(){
		$(this).closest('.categories-icon').find('img').hide();
	});

	if($('#overlay').length > 0){
		$('#overlaybg').css('opacity', 0.87);
		$('#overlay-close').bind('click', function(){
			$('#overlay').hide();
		});
	}

	$('#mechanics .image').bind('click', function(){
		$(this).toggleClass('open');
		$('#mechanics .menu').toggle();
	});

/*
	$('#mechanics .menu a').click(function(event){
		console.log('clicked');
		event.preventDefault();
		degree = 360;

		$('i', this).animate({
            '-webkit-transform': 'rotate(' + degree + 'deg)',
            '-moz-transform': 'rotate(' + degree + 'deg)',
            '-ms-transform': 'rotate(' + degree + 'deg)',
            '-o-transform': 'rotate(' + degree + 'deg)',
            'transform': 'rotate(' + degree + 'deg)',
            'zoom': 1
        }, 500 );
	});
*/


});