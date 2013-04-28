define([
	'backbone',
	'views/workview',
	'text!../../../views/templates/works.html'
],
function(Backbone, WorkView, template) {
	console.dir(_);

	var WorksView = Backbone.View.extend({
		tagName: 'div',
	    className: 'works',
		collection: null,
		template: template,

	    initialize : function(vars) {
		    var that = this;
		    this._workViews = [];
		    if(vars._workViewEl){
		    	this._workViewEl = vars._workViewEl;
		    }

		    _.each(this.collection.models, function(model, index){
                that._workViews.push( new WorkView({
                    model: model,
                    tagName: 'div'
                }));
            });
		},

		renderThumbnails: function(){


		},

		renderSlideshows: function(){


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

	return WorksView;

});