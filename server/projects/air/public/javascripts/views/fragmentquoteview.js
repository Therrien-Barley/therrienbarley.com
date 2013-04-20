define([
	'underscore',
	'backbone',
	'text!../../../views/templates/fragmentquote.html'
],
function(_, Backbone, template) {

	var FragmentQuoteView = Backbone.View.extend({
	    className: 'fragmentquote',
		template: template,
		/*
		initialize: function(){
			_.bind(this.model, 'change', render);
		},
		*/

		render: function(vars){
			//use Underscore template, pass it the attributes from this model

			console.log('render!!');

			var attributes = this.model.attributes;

			if(vars){
				_.extend(attributes, vars);
			}

			var attr = {
				data: attributes
			};

			console.log(this.el);
			console.dir(attr);

			var content = _.template(this.template, attr);
			$(this.el).html(content);

			// return ```this``` so calls can be chained.
			return this;
	    },
	    unrender: function(){
			//use Underscore template, pass it the attributes from this model
			$(this.el).html('');

			// return ```this``` so calls can be chained.
			return true;
	    },
	});

	return FragmentQuoteView;

});