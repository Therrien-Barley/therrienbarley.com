define([
	'underscore',
	'backbone',
	'text!../../../views/templates/homeproject.html',
	'text!../../../views/templates/project.html'

],
function(_, Backbone, homeTemplate, projectTemplate) {

	var ProjectView = Backbone.View.extend({
	    className: 'project',
	    template: homeTemplate,

	    events: {
		    "click .view": "open",
		    "click .add_gallery": "addGallery"
		},

		initialize: function(vars){
			if(vars.template){
				this.template = vars.template;
			}
		},

		addGallery: function(){
			console.log('addGallery!');
			$('body').append('<div id="input-form"></div>');

		},

		open: function(){
			console.log('open!');
			console.dir(this.model);

			this.unrender();

			$('#main').empty();
			$('#main').append('<div id="project-el"></div>');

			var pv = new ProjectView({
				model: this.model,
				el: '#project-el',
				template: projectTemplate
			});

			pv.render();
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

	return ProjectView;

});