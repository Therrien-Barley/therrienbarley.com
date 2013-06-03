define(
[
	'backbone'
], function(Backbone){

	var User = Backbone.Model.extend({
		urlRoot: "/insights/api/user",
		idAttribute: 'id',
		isSelf: false,
		initialize: function(vars){
			console.log('vars!!!!!!!');
			console.dir(vars);
			if(vars){
				this.set(vars);
				if(vars.isSelf == true){
					console.log('*** SELF********');
					this.urlRoot = "/insights/api/user/self";
				}
			}
				
		},
	});

	return User;

});