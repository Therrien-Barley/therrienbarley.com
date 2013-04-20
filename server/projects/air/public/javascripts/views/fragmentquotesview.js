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
		    console.log('setting the el of a fragmentQuoteView to '+this._quoteViewEl);

		    _.each(this.collection.models, function(model, index){
                that._fragmentQuoteViews.push( new FragmentQuoteView({
                    model: model,
                    tagName: 'div'
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
		    		console.log('*******the el for a fqv is: ');
		    		console.dir(that.el);
		    		$(that._quoteViewEl).append(fragmentQuoteView.render({tag: vars.tag}).el);
		    	}
		    });

		    return true;
		}
	});

	return FragmentsQuoteView;

});