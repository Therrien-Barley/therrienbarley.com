define([
	'backbone',
	'views/projectview',
	'text!../../../views/templates/projects.html'
],
function(Backbone, ProjectView, template) {
	console.dir(_);

	var ProjectsView = Backbone.View.extend({
		tagName: 'div',
	    className: 'projects',
		_projectViews: null,
		_projectTemplate: null,
		collection: null,
		template: template,

	    initialize : function(vars) {
		    var that = this;
		    this._projectViews = [];
		    if(vars._projectViewEl){
		    	this._projectViewEl = vars._projectViewEl;
		    }

		    if(vars._projectTemplate){
		    	this._projectTemplate = vars._projectTemplate;
		    }


		    _.each(this.collection.models, function(model, index){
                that._projectViews.push( new ProjectView({
                    model: model,
                    tagName: 'div',
                    template: vars._projectTemplate
                }));
            });
		},
		 
		render : function(vars) {
			var that = this;
		    // Clear out this element.
		    $(this.el).empty();

		    var attr = { data: {
		    		total_projects: this._projectViews.length,
		    		project_view_el: this._projectViewEl
			    }
			};

		    var content = _.template(this.template, attr);
			$(this.el).html(content);
		 
		    // Render each sub-view and append it to the parent view's element.
		    _.each(this._projectViews, function(projectView) {
		    	$(that._projectViewEl).append(projectView.render().el);
		    });

		    return true;
		}
	});

	return ProjectsView;

});