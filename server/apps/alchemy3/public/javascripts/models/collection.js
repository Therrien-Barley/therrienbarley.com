define(
[
	'backbone'
], function(Backbone){

	var Collection = Backbone.Model.extend({
		urlRoot: "/insights/api/collection",
		idAttribute: '_id',
		initialize: function(vars){
			if(vars){
				this.set(vars);
			}
		},
	});

	return Collection;

});