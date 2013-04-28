define(
[
	'backbone'
], function(Backbone){

	var Project = Backbone.Model.extend({
		urlRoot: '/api/project',
		initialize: function(vars){
			//initialize the model if vars passed in
			if(vars){
				this.set(vars);
				if(typeof vars._id != 'undefined'){
					this.urlRoot = this.urlRoot + '/' + vars._id;
				}
			}
		},
	});

	return Project;

});