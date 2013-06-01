define(
[
	'backbone'
], function(Backbone){

	var TumblrPost = Backbone.Model.extend({
		urlRoot: "/research/topten/api/get/tumblrpost"
	});

	return TumblrPost;

});