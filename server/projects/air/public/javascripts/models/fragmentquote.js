define(
[
	'backbone'
], function(Backbone){

	var FragmentQuote = Backbone.Model.extend({
		urlRoot: "/insights/air/api/get/fragments/quotes"
	});

	return FragmentQuote;

});