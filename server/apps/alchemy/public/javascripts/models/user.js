define(
[
	'backbone'
], function(Backbone){

	var User = Backbone.Model.extend({
		urlRoot: "/insights/api/user",
		idAttribute: 'id',
		initialize: function(vars){
			if(vars){
				this.set(vars);
			}
		},
	});

	return User;

});