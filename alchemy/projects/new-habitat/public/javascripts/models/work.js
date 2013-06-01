define(
[
	'underscore',
	'backbone'
], function(_, Backbone){

	var Work = Backbone.Model.extend({
		_posts: [],

		initialize: function(posts){
			//initialize the model if vars passed in
			var that = this;
			if(posts){
				_.each(posts, function(post, index){
					console.log('adding post #'+ index + ' to Work model');
					that._posts.push(post);
				});
			}
			return true;
		}
	});

	return Work;

});