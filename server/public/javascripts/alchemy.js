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
		$('#overlaybg').css('opacity', 0.7);
		$('#overlay-close').bind('click', function(){
			$('#overlay').hide();
		});
	}

});