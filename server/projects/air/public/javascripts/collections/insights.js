define([
	'backbone',
	'models/insight'
],
function(Backbone, Insight) {

  var Insights = Backbone.Collection.extend({
	model: Insight,
	url:'/insights/air/api/insight'
  });

  return Insights;
});

