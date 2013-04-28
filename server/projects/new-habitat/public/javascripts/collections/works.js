define([
	'backbone',
	'models/work'
],
function(Backbone, Work) {

  var Works = Backbone.Collection.extend({
	model: Work
  });

  return Works;
});

