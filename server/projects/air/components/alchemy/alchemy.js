define([
	'jquery',
	'underscore',
	'backbone',
	'jquery-masonry',
    'collections/fragmentquotes',
    'views/fragmentquotesview',
    'models/tumblrpost',
    'views/tumblrpostview'
],
function($, _, Backbone, masonry, FragmentQuotes, FragmentQuotesView, TumblrPost, TumblrPostView) {

	
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

		renderFragmentQuotes: function(tag){
			var _this = this;
			_this.data.fragment_quotes = new FragmentQuotes({ tag: tag });
            _this.data.fragment_quotes.fetch({
                success: function(collection, response, options){
                    
                    _this.data.fragment_quotes_view = new FragmentQuotesView({
                        collection: collection,
                        el: '#fragments-el',
                        _quoteViewEl: '#fragmentquotes-el'
                    });

                    if(_this.data.fragment_quotes_view.render({tag: tag})){
                        $('html, body').animate({
                            scrollTop: 0
                        }, 500);

                        $('.masonry-wrapper').each(function(){
                            $(this).masonry({
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