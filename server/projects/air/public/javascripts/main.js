requirejs.config({
  paths: {
    "jquery": '../../components/jquery/jquery',
    "underscore": '../../components/underscore-amd/underscore',
    "backbone": '../../components/backbone-amd/backbone',
    "jquery-masonry": '../../components/jquery-masonry/jquery.masonry.min'
  }
});

require([
    'jquery',
    'jquery-masonry',
    'taxonomies',
    'init',
    'underscore',
    'backbone',
    'models/tumblrpost',
    'views/tumblrpostview',
    'collections/fragmentquotes',
    'views/fragmentquotesview'
],

function($, masonry, TAXONOMIES, init, _, Backbone, TumblrPost, TumblrPostView, FragmentQuotes, FragmentQuotesView) {

    console.dir(_);
    console.dir(Backbone);
    init();

    var data = {};//used to de-scope (to pass values between functions) and persist

    $('.api-get-tumblrpost').click(function(event){

        event.preventDefault();

        var path_array = $(this).attr('href').split('/');

        data.tumblr_post = new TumblrPost({ id: path_array[6] });
        data.tumblr_post.fetch({
            success: function(model, response, options){

                data.tumblr_post_view = new TumblrPostView({
                    model: model,
                    el: '#overlay'
                });

                if(data.tumblr_post_view.render()){
                    $('html, body').animate({
                        scrollTop: 0
                    }, 500);

                    if($('#overlay').length > 0){
                        $('#overlaybg').css('opacity', 0.7);
                        $('#overlay-close').bind('click', function(){
                            data.tumblr_post_view.unrender();
                            data.tumblr_post = null;
                            data.tumblr_post_view = null;
                            $('html, body').animate({
                                scrollTop: 0
                            }, 500);
                        });
                    }
                }
            }
        });
    });

    console.log('subnav???');
    if($('#sub-nav').length > 0){
        console.log('subnav');
        console.dir(TAXONOMIES['terms']);
        console.log('');console.log('');console.log('');console.log('');

        var pathname = window.location.pathname.split('/');
        var term_val = pathname.pop().replace(/%20/g," ");
        var fragment_val = pathname.pop().replace(/%20/g," ");
        pathname.pop();//remove 'fragments'
        var taxonomy = pathname.pop().replace(/%20/g," ");

        console.log('taxonomy: '+ taxonomy);

        //populate dropdowns
        for(var i = 0; i < TAXONOMIES[ taxonomy ].length; i++){
            $('#sub-nav #terms-nav').append('<option class="menu-option" value="'+TAXONOMIES[ taxonomy ][i]+'">'+TAXONOMIES[ taxonomy ][i]+'</option>');
        }

        //set dropdown values based on current url
        $('#sub-nav #terms-nav').val( term_val );
        $('#sub-nav #fragments-nav').val( fragment_val );

        //trigger Backbone on change event
        $('#sub-nav #fragments-nav, #sub-nav #terms-nav').change(function() {
            console.log('change event');

            var fragment = $('#sub-nav #fragments-nav').val();
            var tag = $('#sub-nav #terms-nav').val();

            console.log('fragment: '+ fragment+ ' tag: '+ tag);

            data.fragment_quotes = new FragmentQuotes({ tag: tag });
            data.fragment_quotes.fetch({
                success: function(collection, response, options){
                    console.log('success! fetched collection');
                    console.dir(collection);
                    
                    data.fragment_quotes_view = new FragmentQuotesView({
                        collection: collection,
                        el: '#fragments-el',
                        _quoteViewEl: '#fragmentquotes-el'
                    });

                    if(data.fragment_quotes_view.render({tag: tag})){
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

        });
    }
                            


});














