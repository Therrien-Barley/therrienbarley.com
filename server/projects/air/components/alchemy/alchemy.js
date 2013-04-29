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
    'views/insightview',
    'collections/insights',
    'views/insightsview'
],
function($, _, Backbone, masonry, Fragments, FragmentsView, fragmentQuoteTemplate, fragmentImageTemplate, fragmentTitleTemplate, TumblrPost, TumblrPostView, Insight, InsightView, Insights, InsightsView) {

	
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
                tags: [
                    "tag"
                ],
                description: "Description"
            });

            var insight_view = new InsightView({
                model: insight,
                el: '#new-insights-el'
            });

            //run render synchronously
            if(typeof insight_view.render() != 'undefined' ){
                $('#new-insights-el .insight-container').addClass('edit-mode');
                $('#new-insights-el .insight-container .edit').removeClass('edit').addClass('save').text('Save');
                $('#new-insights-el .insight-container .editable').attr('contenteditable', 'true');
            }
        },

        renderInsights: function(){
            console.log('Alchemy.js::renderInsights()');
            var insights = new Insights();
            insights.fetch({
                success: function(collection, response, options){
                    var insights_view = new InsightsView({
                        collection: collection,
                        el: '#insights-el',
                        _insightViewEl: '.insights-list-el'
                    });

                    insights_view.render();
                }
            });

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