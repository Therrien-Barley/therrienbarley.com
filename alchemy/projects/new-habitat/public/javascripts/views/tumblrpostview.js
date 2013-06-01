define([
	'backbone',
	'text!../../../views/templates/tumblrpost.html'
],
function(Backbone, template) {

	var TumblrPostView = Backbone.View.extend({
	    className: 'tumblrpost',
		template: template,
		/*
		initialize: function(){
			_.bind(this.model, 'change', render);
		},
		*/

		render: function(){
			//use Underscore template, pass it the attributes from this model

			var attributes = this.model.attributes;

			var attr = {
				data: attributes
			};

			var content = _.template(this.template, attr);
			$(this.el).html(content);

			// return ```this``` so calls can be chained.
			return true;
	    },
	    unrender: function(){
			//use Underscore template, pass it the attributes from this model
			$(this.el).html('');

			// return ```this``` so calls can be chained.
			return true;
	    },
	});

	return TumblrPostView;

});