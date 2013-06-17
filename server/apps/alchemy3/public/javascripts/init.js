
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



		switch(path_array[1]){
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
			case 'login':
				$('#user-nav').addClass('active-trail').find('li.user-login a').addClass('active');
				break;
			case 'insights':
				switch(path_array[2]){
					case 'collections':
						$('#user-nav').addClass('active-trail').find('li.user-collections a').addClass('active');
						break;
					case 'collection':
						switch(path_array[4]){
							case 'content':
								$('#collection-nav').addClass('active-trail').find('li.collection-content a').addClass('active');
								break;
						}
						break;
					case 'user':
						$('#user-nav').addClass('active-trail').find('li.user-account a').addClass('active');
						break;
					case 'users':
						$('#user-nav').addClass('active-trail').find('li.user-users a').addClass('active');
						break;
					case 'admin':
						$('#user-nav').addClass('active-trail').find('li.user-admin a').addClass('active');
						break;
					/*
					case 'topten':
						$('#insights-nav').addClass('active-trail').find('li.insights-topten a').addClass('active');
						break;
					case 'toptwenty':
						$('#insights-nav').addClass('active-trail').find('li.insights-toptwenty a').addClass('active');
						break;
					case 'other':
						$('#insights-nav').addClass('active-trail').find('li.insights-other a').addClass('active');
						break;
					case 'insights':
						$('#insights-nav').addClass('active-trail').find('li.insights-insights a').addClass('active');
						break;
						*/
				}
				break;
			default:
				break;
		}

		function verticallyCenter(selector){
			console.log('verticallyCenter('+selector+')')
			if($(selector).length > 0){
				var it_height = $(selector).height();

				if(window.innerHeight > it_height){
					var vertical_padding = (window.innerHeight - parseInt($('#main').css('marginTop')) - it_height) / 2 - parseInt($('#nav').height());
					$(selector).css('paddingTop', vertical_padding);
				}
				$(selector).css('opacity', 1);
			}
		}

		function verticallyCenterNav(){
			console.log('verticallyCenterNav()');
			var nav_height = 0;

			$('#nav .menu').each(function(i){
				nav_height += $(this).height() + parseInt($(this).css('paddingTop')) + parseInt($(this).css('paddingBottom'));
				if(i > 0){
					nav_height += parseInt($(this).css('marginBottom'));
				}
			});

			if(window.innerHeight > nav_height){
				var vertical_padding = (window.innerHeight - nav_height) / 2;
				$('#nav').css('paddingTop', vertical_padding);
			}

			console.log('nav_height: '+ nav_height);
			console.log('vertical_padding: '+ vertical_padding);
			$('#nav').css('opacity', 1);
		}

		function resizeFunc(){
			verticallyCenter('#intro-text');
			verticallyCenter('#login-form');
			//verticallyCenterNav();
		}

		resizeFunc();



		console.log('blah');

		$('#nav .login').click(function(){
			location.pathname = 'login';
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
			$('#overlaybg').css('opacity', 0.95);
			$('#overlay-close').bind('click', function(){
				$('#overlay').hide();
			});
		}

		$('#mechanics .image').bind('click', function(){
			$(this).toggleClass('open');
			$('#mechanics .menu').toggle();
		});


		$(window).resize(resizeFunc);


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