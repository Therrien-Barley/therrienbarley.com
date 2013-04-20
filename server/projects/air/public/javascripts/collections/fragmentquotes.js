define([
	'backbone',
	'models/fragmentquote'
],
function(Backbone, FragmentQuote) {

  var FragmentQuotes = Backbone.Collection.extend({
	model: FragmentQuote,
	initialize: function(vars){
		if(vars.tag){
			this.url = "/insights/air/api/get/fragments/quotes/" + vars.tag;
		}
	}
  });

  return FragmentQuotes;
});