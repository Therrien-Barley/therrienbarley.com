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
    'init',
    'underscore',
    'backbone'
],

function($, init, _, Backbone) {

    console.dir(_);
    console.dir(Backbone);
    init();

    var url_array = window.location.pathname.split('/');

                            


});














