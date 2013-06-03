define([
	'backbone',
	'views/collectionview',
	'text!../../../views/templates/collections.html',
	'collections/collections'
],
function(Backbone, CollectionView, template, Collections) {

	var CollectionsView = Backbone.View.extend({
		tagName: 'div',
	    className: 'collections',
		_collectionViews: null,
		_collectionViewEl: null,
		collection: null,
		template: template,

	    initialize: function(vars) {
		    var that = this;
		    this._collectionViews = [];

		    if(vars._collectionViewEl){
		    	this._collectionViewEl = vars._collectionViewEl;
		    }else{
		    	this._collectionViewEl = '.collections-list-el';
		    }

		    _.each(this.collection.models, function(model, index){
                that._collectionViews.push(new CollectionView({
                    model: model,
                    tagName: 'div',
                    _collectionView: that
                }));
            });

            this.collection.on('reset', this.render, this);
		},
		 
		render: function(vars) {
			var that = this;
		    // Clear out this element.
		    $(this.el).empty();

		    var content = _.template(this.template);
			$(this.el).html(content);

			
			_.each(that._collectionViews, function(collectionView) {
		    	$(that._collectionViewEl).append(collectionView.render().el);
		    });
		 
		    return true;
		}
	});

	return CollectionsView;

});