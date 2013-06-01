define(
[
	'backbone'
], function(Backbone){

	var Fragment = Backbone.Model.extend({
		urlRoot: "/insights/air/api/fragment",
		idAttribute: '_id',
	});

	return Fragment;

});