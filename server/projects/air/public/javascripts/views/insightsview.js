define([
	'backbone',
	'views/insightview',
	'text!../../../views/templates/insights.html',
	'collections/fragments'
],
function(Backbone, InsightView, template, Fragments) {

	var InsightsView = Backbone.View.extend({
		tagName: 'div',
	    className: 'insights',
		_insightViews: null,
		_insightViewEl: null,
		collection: null,
		template: template,

	    initialize: function(vars) {
		    var that = this;
		    this._insightViews = [];

		    if(vars._insightViewEl){
		    	this._insightViewEl = vars._insightViewEl;
		    }else{
		    	_insightViewEl = '.insights-list-el';
		    }

		    _.each(this.collection.models, function(model, index){
                that._insightViews.push(new InsightView({
                    model: model,
                    tagName: 'div',
                    el: this._insightViewEl
                }));
            });
		},
		 
		render: function(vars) {
			var that = this;
		    // Clear out this element.
		    $(this.el).empty();

		    var content = _.template(this.template);
			$(this.el).html(content);

	    	var fragments = new Fragments();

	    	fragments.fetch({
	    		success: function(collection, response, options){
			    	var frags;

			    	// Render each sub-view and append it to the parent view's element.
				    _.each(that._insightViews, function(insightView) {
				    	frags = collection.where({ insight_id : insightView.model.get('_id') });

				    	$(that._insightViewEl).append(insightView.render(null, frags).el);
				    });
	    		}
	    	});
		 
		    return true;
		}
	});

	return InsightsView;

});