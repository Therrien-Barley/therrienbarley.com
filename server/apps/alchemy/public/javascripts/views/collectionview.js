define([
	'backbone',
	'text!../../../views/templates/collection.html',
	'taxonomies',
	'models/collection'
],
function(Backbone, template, TAXONOMIES, Collection) {

	var CollectionView = Backbone.View.extend({
	    className: 'collection row-fluid',
	    tagName: 'li',
		template: template,
		events: {
	    	'click .edit': 'edit',
	    	'click .save': 'save'
	    },

	    save: function(){
	    	console.log('save collection');

	    	this.model.save({
	    		success: function(model){
	    			console.log('saved! with _id');
	    			console.log(model.get('_id'));
	    		}
	    	});
	    },

		edit: function(event){
	    	console.log('edit collection');
	    },

		render: function(){
			//use Underscore template, pass it the attributes from this model

			var attributes = this.model.attributes;

			var attr = {
				data: attributes
			};

			var content = _.template(this.template, attr);
			$(this.el).html(content);

			// return ```this``` so calls can be chained.
			return this;
	    },
	    unrender: function(){
			//use Underscore template, pass it the attributes from this model
			$(this.el).html('');

			// return ```this``` so calls can be chained.
			return this;
	    },
	});

	return CollectionView;

});