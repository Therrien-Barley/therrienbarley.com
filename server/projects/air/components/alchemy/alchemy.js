define([
	'jquery',
	'underscore',
	'backbone',
	'jquery-masonry',
    'collections/fragments',
    'views/fragmentsview',
    'models/tumblrpost',
    'views/tumblrpostview',
    'models/insight',
    'views/insightview',
    'collections/insights',
    'views/insightsview'
],
function($, _, Backbone, masonry, Fragments, FragmentsView, TumblrPost, TumblrPostView, Insight, InsightView, Insights, InsightsView) {

	
	var Alchemy = {

		data: {},//used to de-scope (to pass values between functions) and persist

        init: function(){
            console.log('alchemy.js::init()');
            var that = this;

            //@todo: later, do this with the insights collection (fetch at site load) and a new InsightsMenuView
            $.ajax({
                url: 'http://therrienbarley.com/insights/air/api/insight',
                type: 'GET',
                success:function(data){
                    console.log('alchmey init returned');

                    var $menu = $('<div id="insights-menu" class="insights-menu"><h6>Add to insight</h6></div>');
                    $menu.append('<div class="new-insight"></div>');
                    $menu.append('<ul class="insights-options"></ul>');

                    _.each(data, function(insight, index){
                        var insight_title = (insight.title.length > 30) ? insight.title.substr(0, 30) + '...' : insight.title;
                        console.log('insight title number: '+ index+' is '+insight_title);

                        $menu.find('.insights-options').append('<li id="insight-'+insight._id+'" class="insights-option">'+insight_title+'</li>');
                    });

                    $('body').append($menu);
                }
            })

        },

        showInsightsMenu: function(event){
            console.log('showInsightsMenu()');
            console.dir(this);

        },

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
                $('#new-insights-el .insight-container .edit').removeClass('edit span2').addClass('save span1 pull-left').text('Save');
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

                    _this.data.fragments_view = new FragmentsView({
                        collection: collection,
                        el: '.fragments-el',
                        _fragmentViewEl: '.fragment-el'
                    });

                    if(_this.data.fragments_view.render({ tag: tag})){
                        $('html, body').animate({
                            scrollTop: 0
                        }, 500);

                        var $container = $('.masonry-wrapper');

                        $container.masonry({
                            itemSelector: '.fragment',
                            columnWidth: 250,
                            gutterWidth:17
                        });

						$container.imagesLoaded( function(){
						  	$container.masonry();
						});
                    }
	                	
                }
            });
        },


    };//end Alchemy

    return Alchemy;

});