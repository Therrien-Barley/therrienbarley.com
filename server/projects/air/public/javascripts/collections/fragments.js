define([
	'backbone',
	'models/fragment'
],
function(Backbone, Fragment) {

  var Fragments = Backbone.Collection.extend({
	model: Fragment,
	url: '/insights/air/api/fragment',
	initialize: function(vars){
		if(vars){
			if(vars.tag){
				this.url = "/insights/air/api/fragment/"+ vars.fragment +"/" + vars.tag;
			}
		}
	}
  });

  return Fragments;
});

