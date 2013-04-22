define([
	'jquery',
	'underscore',
	'backbone',
	'jquery-masonry',
    'collections/fragments',
    'views/fragmentsview',
    'text!../../views/templates/fragmentquote.html',
    'text!../../views/templates/fragmentimage.html',
    'text!../../views/templates/fragmenttitle.html',
    'models/tumblrpost',
    'views/tumblrpostview',
    'models/insight',
    'views/insightview'
],
function($, _, Backbone, masonry, Fragments, FragmentsView, fragmentQuoteTemplate, fragmentImageTemplate, fragmentTitleTemplate, TumblrPost, TumblrPostView, Insight, InsightView) {

	
	var Alchemy = {

		data: {},//used to de-scope (to pass values between functions) and persist

		//renders a single tumblr post into the #overlay div
		getTumblrPost: function(id){
			var _this = this;
			_this.data.tumblr_post = new TumblrPost({ id: id });
            _this.data.tumblr_post.fetch({
                success: function(model, response, options){

                    _this.data.tumblr_post_view = new TumblrPostView({
                        model: model,
                        el: '#overlay'
                    });

                    if(_this.data.tumblr_post_view.render()){
                        $('html, body').animate({
                            scrollTop: 0
                        }, 500);

                        if($('#overlay').length > 0){
                            $('#overlaybg').css('opacity', 0.7);
                            $('#overlay-close').bind('click', function(){
                                _this.data.tumblr_post_view.unrender();
                                _this.data.tumblr_post = null;
                                _this.data.tumblr_post_view = null;
                                $('html, body').animate({
                                    scrollTop: 0
                                }, 500);
                            });
                        }
                    }
                }
            });

		},

        createInsight: function(){
            var insight = new Insight({
                title: "Insight title",
                tags: [{
                    tag: "tag"
                }],
                description: "Description"
            });

            var insight_view = new InsightView({
                model: insight,
                el: '#insights-el'
            });

            if(typeof insight_view.render() != 'undefined' ){
                $('.insight-container .save').click(function(){
                    console.log('clicked save');

                    var $insightContainer = $(this).closest('.insight-container');
                    var title = $insightContainer.find('.title').html();
                    var description = $insightContainer.find('.description').html();

                    insight.set({
                        'title': title, 
                        'description': description
                    });

                    console.log('new model: ');
                    console.dir(insight);

                    //@todo: implement the save function - need to deal with BB sync I think,
                    //and add an api put call
                    //insight.save();
                    
                });
            }



        },

		renderFragments: function(fragmentType, tag){
			var _this = this;
			_this.data.fragments = new Fragments({ fragment: fragmentType, tag: tag });
            _this.data.fragments.fetch({
                success: function(collection, response, options){
                	
                	var tmplt;
                	switch(fragmentType){
                		case 'quotes':
                			tmplt = fragmentQuoteTemplate;
                			break;
                		case 'images':
                			tmplt = fragmentImageTemplate;
                			break;
                		case 'titles':
                			tmplt = fragmentTitleTemplate;
                			break;
                	}

                    _this.data.fragments_view = new FragmentsView({
                        collection: collection,
                        el: '#fragments-el',
                        _fragmentViewEl: '#fragment-el',
                        _fragmentTemplate: tmplt
                    });

                    if(_this.data.fragments_view.render({ tag: tag})){
                        $('html, body').animate({
                            scrollTop: 0
                        }, 500);

                        var $container = $('.masonry-wrapper');

						$container.imagesLoaded( function(){
						  	$container.masonry({
						    	itemSelector: '.fragment',
                            	columnWidth: 250,
                            	gutterWidth:17
							});
						});
                    }
	

                	

	                	
                }
            });
        },


    };//end Alchemy

    return Alchemy;

});