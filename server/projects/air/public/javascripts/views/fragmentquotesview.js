define([
	'backbone',
	'views/fragmentquoteview',
	'text!../../../views/templates/fragmentquotes.html'
],
function(Backbone, FragmentQuoteView, template) {
	console.dir(_);

	var FragmentsQuoteView = Backbone.View.extend({
		tagName: 'div',
	    className: 'fragmentquote',
		_fragmentQuoteViews: null,
		collection: null,
		template: template,

	    initialize : function(vars) {
		    var that = this;
		    this._fragmentQuoteViews = [];
		    if(vars._quoteViewEl){
		    	this._quoteViewEl = vars._quoteViewEl;
		    }

		    _.each(this.collection.models, function(model, index){
                that._fragmentQuoteViews.push( new FragmentQuoteView({
                    model: model,
                    tagName: 'div', 
                    el: this._quoteViewEl
                }));
            });
		},
		 
		render : function(vars) {
			var that = this;
		    // Clear out this element.
		    $(this.el).empty();

		    var attr = { data: {
		    		tag: vars.tag,
		    		total_quotes: this._fragmentQuoteViews.length
			    }
			};

		    var content = _.template(this.template, attr);
			$(this.el).html(content);
		 
		    // Render each sub-view and append it to the parent view's element.
		    _.each(this._fragmentQuoteViews, function(fragmentQuoteView) {
		    	if(vars.tag){
		    		console.dir('about to render a model!');
		    		console.dir(fragmentQuoteView);
		    		console.log(that.el);
		    		$(that.el).append(fragmentQuoteView.render({tag: vars.tag}).el);
		    	}
		    });

		    return true;
		}
	});

	return FragmentsQuoteView;

});