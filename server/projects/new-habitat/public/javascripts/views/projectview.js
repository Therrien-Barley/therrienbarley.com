define([
	'underscore',
	'backbone',
	'text!../../../views/templates/project.html'

],
function(_, Backbone, template) {

	var ProjectView = Backbone.View.extend({
	    className: 'project',
	    template: template,

		render: function(vars){
			//use Underscore template, pass it the attributes from this model
			var attributes = this.model.attributes;

			if(vars){
				_.extend(attributes, vars);
			}

			var attr = {
				data: attributes
			};

			console.log(this.el);
			console.dir(attr);
			console.log("^^^template");
			console.dir(this.template);

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

	return ProjectView;

});