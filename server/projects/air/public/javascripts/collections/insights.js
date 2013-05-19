define([
	'backbone',
	'models/insight'
],
function(Backbone, Insight) {

  var Insights = Backbone.Collection.extend({
	model: Insight,
	url:'/insights/air/api/insight',
	initialize: function(vars){
		if(vars){
			if(vars.section){
				this.url = '/insights/air/api/insight/' + vars.section;
			}
		}
	}
  });



  return Insights;
});

