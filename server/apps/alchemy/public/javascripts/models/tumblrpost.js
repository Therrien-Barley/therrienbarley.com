define(
[
	'backbone'
], function(Backbone){

	var TumblrPost = Backbone.Model.extend({
		urlRoot: "/insights/api/tumblrpost"
	});

	return TumblrPost;

});