
define([
	'jquery',
	'taxonomies'
],
function($, TAXONOMIES) {

	var init = function(){

		$('#nav .active-trail').removeClass('active-trail');
		$('#nav .active').removeClass('active');
		var pathname = window.location.pathname;
		var path_array = pathname.split('/');
		switch(path_array[3]){
			case 'sources':
				switch(path_array[4]){
					case 'blogs':
						$('#sources-nav').addClass('active-trail').find('li.sources-blogs a').addClass('active');
						break;
					case 'magazines':
						$('#sources-nav').addClass('active-trail').find('li.sources-magazines a').addClass('active');
					break;
				}
				break;
			case 'categories':
				switch(path_array[4]){
					case 'distribution':
						$('#categories-nav').addClass('active-trail').find('li.categories-distribution a').addClass('active');
						break;
					case 'elements':
						$('#categories-nav').addClass('active-trail').find('li.categories-elements a').addClass('active');
					break;
					case 'fragments':
						$('#categories-nav').addClass('active-trail').find('li.categories-fragments a').addClass('active');
						break;
				}
				break;
			case 'terms':
				switch(path_array[4]){
					case 'distribution':
						$('#terms-nav').addClass('active-trail').find('li.terms-distribution a').addClass('active');
						break;
					case 'elements':
						$('#terms-nav').addClass('active-trail').find('li.terms-elements a').addClass('active');
					break;
					case 'fragments':
						$('#terms-nav').addClass('active-trail').find('li.terms-fragments a').addClass('active');
						break;
					case 'glossary':
						$('#terms-nav').addClass('active-trail').find('li.terms-glossary a').addClass('active');
						break;
				}
				break;
			case 'insights':
				switch(path_array[4]){
					case 'insights':
						$('#insights-nav').addClass('active-trail').find('li.insights-insights a').addClass('active');
						break;
				}
				break;
			default:
				break;
		}

		

		


			








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

		$('.tag-elements-icon i').hover(function(){
			var $img = $(this).closest('.tag-elements-icon').find('img');
			$img.show();
			console.log('$img.height() '+ $img.attr('width'));
			$img.height( $img.attr('height') );
			$img.css( 'maxHeight', $img.attr('height') );
			$img.width( $img.attr('width') );
			$img.css( 'maxWidth', $img.attr('width') );
		}, function(){
			$(this).closest('.tag-elements-icon').find('img').hide();
		});

		if($('#overlay').length > 0){
			$('#overlaybg').css('opacity', 0.7);
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
	}

	return init;


});