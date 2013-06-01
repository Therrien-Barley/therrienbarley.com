define(
[
	'backbone'
], function(Backbone){

	var Fragment = Backbone.Model.extend({
		urlRoot: "/research/topten/api/fragment",
		idAttribute: '_id',
	});

	return Fragment;

});