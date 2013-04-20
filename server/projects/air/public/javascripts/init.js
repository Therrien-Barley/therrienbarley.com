
define([
	'jquery'
],
function($) {

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
					case 'all':
						$('#terms-nav').addClass('active-trail').find('li.terms-all a').addClass('active');
						break;
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
					case 'examples':
						$('#insights-nav').addClass('active-trail').find('li.insights-examples a').addClass('active');
						break;
					case 'research':
						$('#insights-nav').addClass('active-trail').find('li.insights-research a').addClass('active');
					break;
					case 'trends':
						$('#insights-nav').addClass('active-trail').find('li.insights-trends a').addClass('active');
					break;
				}
				break;
			default:
				break;
		}

		var TAXONOMIES = [];
		TAXONOMIES[ 'terms' ] = [
			'art',
		    '3d printing',
		    'crowdsourcing',
		    'patterns',
		    'collaboration',
		    '4d printing',
		    'youth',
		    'aging',
		    '1990s',
		    'transgenerational',
		    'quantified self',
		    'context awareness',
		    'ubiquitous computing',
		    'realtime',
		    'social media',
		    'peer to peer',
		    'prosumer',
		    'ownership',
		    'identity',
		    'big data',
		    'analytics',
		    'cultural memory',
		    'nostalgia',
		    'emotion',
		    'new americana',
		    'authenticity',
		    'new aesthetic',
		    'digital dualism',
		    'augmented reality',
		    'maker culture',
		    'street culture',
		    'network culture',
		    'filter failure',
		    'content production',
		    'storytelling',
		    'communication',
		    'advertising',
		    'gamification',
		    'behavior',
		    'collaborative consumption',
		    'share economy',
		    'semantic web',
		    'anticipatory computing',
		    'indieweb',
		    'hypermaterial',
		    'reflectivity',
		    'material lifespan',
		    'wood',
		    'glass',
		    'invisible design',
		    'wearables',
		    'embedded devices',
		    'motivational objects',
		    'performance',
		    'sportswear',
		    'byod',
		    'alternative energy',
		    'mobile workforce',
		    'object oriented ontology',
		    'androgeny',
		    'feminism',
		    'women in tech',
		    'celebrity',
		    'gender roles',
		    'thought leader',
		    'hardware',
		    'socialtech',
		    '1990s',
		    'interface',
		    'sharing',
		    'cultures',
		    'opensource',
		    'postdigital'
		];

		if($('#sub-nav').length > 0){
			for(var i = 0; i < TAXONOMIES['terms'].length; i++){
				console.log(TAXONOMIES['terms'][i]);
				$('#sub-nav #terms-nav').append('<option class="menu-option" value="'+TAXONOMIES['terms'][i]+'">'+TAXONOMIES['terms'][i]+'</option>');
			}

			var pathname = window.location.pathname.split('/');
			$('#sub-nav #terms-nav').val( pathname.pop().replace(/%20/g," ") );
			$('#sub-nav #fragments-nav').val( pathname.pop() );

			$('#sub-nav #fragments-nav').change(function() {
			    var path = $(this).val();
			    var pathname = window.location.pathname.split('/');
			    var term = pathname.pop();
			    pathname.pop();
			    pathname = pathname.join('/') + '/' + path + '/' + term;
			    console.log('pathname: '+ pathname);
			    window.location.pathname = pathname;
			});

			$('#sub-nav #terms-nav').change(function() {
				var term = $(this).val();
			    var pathname = window.location.pathname.split('/');
			    pathname.pop();
			    pathname = pathname.join('/') + '/' + term;
			    console.log('pathname: '+ pathname);
			    window.location.pathname = pathname;
			});
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