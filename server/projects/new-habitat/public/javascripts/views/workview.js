define([
	'underscore',
	'backbone',
	'text!../../../views/templates/work.html',
	'models/work',

],
function(_, Backbone, template, Work) {

	var WorkView = Backbone.View.extend({
	    className: 'work',
	    template: template,

		initialize: function(vars){
			if(vars.template){
				this.template = vars.template;
			}
		},

		render: function(vars){
			//use Underscore template, pass it the attributes from this model
			var attributes = this.model.toJSON();

			if(vars){
				_.extend(attributes, vars);
			}
		
			var content = _.template(this.template, attributes, {variable: 'data'});
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

	return WorkView;

});