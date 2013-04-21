define([
	'backbone',
	'models/fragment'
],
function(Backbone, Fragment) {

  var Fragments = Backbone.Collection.extend({
	model: Fragment,
	initialize: function(vars){
		if(vars.tag){
			this.url = "/insights/air/api/get/fragments/"+ vars.fragment +"/" + vars.tag;
		}
	}
  });

  return Fragments;
});

