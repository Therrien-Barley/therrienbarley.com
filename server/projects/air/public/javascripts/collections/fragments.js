define([
	'backbone',
	'models/fragment'
],
function(Backbone, Fragment) {

  var Fragments = Backbone.Collection.extend({
	model: Fragment,
	url: '/insights/air/api/fragments',
	initialize: function(vars){
		if(vars){
			if(vars.tag){
				this.url = "/insights/air/api/fragments/"+ vars.fragment +"/" + vars.tag;
			}
			if(vars.segment){
				this.url = '/insights/air/api/fragments/' + vars.segment;
			}
		}
	}
  });

  return Fragments;
});

