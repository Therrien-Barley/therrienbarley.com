requirejs.config({
  paths: {
    "jquery": '../../components/jquery/jquery',
    "underscore": '../../components/underscore-amd/underscore',
    "backbone": '../../components/backbone-amd/backbone'
  }
});

require([
    'jquery',
    'init',
    'underscore',
    'backbone',
    'models/tumblrpost',
    'views/tumblrpostview'
],

function($, init, _, Backbone, TumblrPost, TumblrPostView) {

    console.dir(_);
    console.dir(Backbone);
    init();

    var data = {};

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


                            


});














