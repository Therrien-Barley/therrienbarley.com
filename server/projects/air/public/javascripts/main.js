requirejs.config({
  paths: {
    "jquery": '../../components/jquery/jquery',
    "underscore": '../../components/underscore-amd/underscore',
    "backbone": '../../components/backbone-amd/backbone',
    "jquery-masonry": '../../components/jquery-masonry/jquery.masonry.min',
    "alchemy": "../../components/alchemy/alchemy"
  }
});

require([
    'jquery',
    'alchemy',
    'taxonomies',
    'init',
    'underscore',
    'backbone'
],

function($, Alchemy, TAXONOMIES, init, _, Backbone) {

    console.dir(_);
    console.dir(Backbone);
    init();

    var url_array = window.location.pathname.split('/');

                    


    switch(url_array[3]){
        case 'sources':

            break;
        case 'categories':
            switch(url_array[4]){
                case 'elements':
                    //render a single tumblr post into the #overlay div
                    $('.api-get-tumblrpost').click(function(event){
                        event.preventDefault();
                        var path_array = $(this).attr('href').split('/');
                        Alchemy.getTumblrPost(path_array[6]);
                    });
                break; 
                case 'fragments':
                    //set variables from url
                    var term_val = url_array.pop().replace(/%20/g," ");
                    var fragment_val = url_array.pop().replace(/%20/g," ");
                    url_array.pop();//remove 'fragments'
                    var taxonomy = url_array.pop().replace(/%20/g," ");

                    //populate dropdowns
                    for(var i = 0; i < TAXONOMIES[ taxonomy ].length; i++){
                        $('#sub-nav #terms-nav').append('<option class="menu-option" value="'+TAXONOMIES[ taxonomy ][i]+'">'+TAXONOMIES[ taxonomy ][i]+'</option>');
                    }

                    //set dropdown values based on current url
                    $('#sub-nav #terms-nav').val( term_val );
                    $('#sub-nav #fragments-nav').val( fragment_val );

                    //render out fragments
                    switch(fragment_val){
                        case 'quotes':
                            Alchemy.renderFragmentQuotes(term_val);
                            break;
                        case 'images':
                            Alchemy.renderFragmentImages(term_val);
                            break;
                        case 'titles':
                            Alchemy.renderFragmentTitles(term_val);
                            break;
                    }

                    //trigger re-render with Backbone on change event
                    $('#sub-nav #fragments-nav, #sub-nav #terms-nav').change(function() {
                        console.log('change event');

                        var fragment = $('#sub-nav #fragments-nav').val();
                        var tag = $('#sub-nav #terms-nav').val();

                        console.log('fragment: '+ fragment+ ' tag: '+ tag);

                        switch(fragment){
                            case 'quotes':
                                Alchemy.renderFragmentQuotes(tag);
                                break;
                            case 'images':
                                Alchemy.renderFragmentImages(tag);
                                break;
                            case 'titles':
                                Alchemy.renderFragmentTitles(tag);
                                break;
                        }
                    });
                    break;
            }
            break;
        case 'terms':
            switch(url_array[4]){
                case 'elements':
                    //render a single tumblr post into the #overlay div
                    $('.api-get-tumblrpost').click(function(event){
                        event.preventDefault();
                        var path_array = $(this).attr('href').split('/');
                        Alchemy.getTumblrPost(path_array[6]);
                    });
                break; 
                case 'fragments':
                    //set variables from url
                    var term_val = url_array.pop().replace(/%20/g," ");
                    var fragment_val = url_array.pop().replace(/%20/g," ");
                    url_array.pop();//remove 'fragments'
                    var taxonomy = url_array.pop().replace(/%20/g," ");

                    //populate dropdowns
                    for(var i = 0; i < TAXONOMIES[ taxonomy ].length; i++){
                        $('#sub-nav #terms-nav').append('<option class="menu-option" value="'+TAXONOMIES[ taxonomy ][i]+'">'+TAXONOMIES[ taxonomy ][i]+'</option>');
                    }

                    //set dropdown values based on current url
                    $('#sub-nav #terms-nav').val( term_val );
                    $('#sub-nav #fragments-nav').val( fragment_val );

                    //render out fragments
                    switch(fragment_val){
                        case 'quotes':
                            Alchemy.renderFragmentQuotes(term_val);
                            break;
                        case 'images':
                            Alchemy.renderFragmentImages(term_val);
                            break;
                        case 'titles':
                            Alchemy.renderFragmentTitles(term_val);
                            break;
                    }

                    //trigger re-render with Backbone on change event
                    $('#sub-nav #fragments-nav, #sub-nav #terms-nav').change(function() {
                        console.log('change event');

                        var fragment = $('#sub-nav #fragments-nav').val();
                        var tag = $('#sub-nav #terms-nav').val();

                        console.log('fragment: '+ fragment+ ' tag: '+ tag);

                        switch(fragment){
                            case 'quotes':
                                Alchemy.renderFragmentQuotes(tag);
                                break;
                            case 'images':
                                Alchemy.renderFragmentImages(tag);
                                break;
                            case 'titles':
                                Alchemy.renderFragmentTitles(tag);
                                break;
                        }
                    });
                    break;
            }
            break;
        case 'insights':

            break;
    }

    if($('#sub-nav').length > 0){

        
                    
    }
                            


});














