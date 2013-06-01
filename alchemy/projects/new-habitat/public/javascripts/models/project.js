define(
[
	'backbone'
], function(Backbone){

	var Project = Backbone.Model.extend({
		urlRoot: '/api/project',
		idAttribute: '_id',
		_works: null,
		initialize: function(vars){
			//initialize the model if vars passed in
			if(vars){
				this.set(vars);
			}
		},
	});

	return Project;

});