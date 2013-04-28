define(
[
	'backbone'
], function(Backbone){

	var Work = Backbone.Model.extend({

		initialize: function(vars){
			//initialize the model if vars passed in
			if(vars){
				this.set(vars);
			}
		}
	});

	return Work;

});