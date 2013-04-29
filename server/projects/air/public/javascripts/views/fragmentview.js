define([
	'underscore',
	'backbone'
],
function(_, Backbone) {

	var FragmentView = Backbone.View.extend({
	    className: 'fragment',

	    events: {
	    	'mouseenter .insight-menu-icon': 'showInsightsMenu'
	    },

	    showInsightsMenu: function(){
	    	console.log('insightview.js::showInsightsMenu()--');
	    	console.dir(this);
	    	var $menu = $('#insights-menu').clone();
	    	$menu.attr('id', 'insights-menu-live').show();
	    	$(this.el).append($menu);

	    	$menu.bind('mouseleave', function(){
	    		$(this).remove();
	    	});

	    },
		
		initialize: function(vars){
			//_.bind(this.model, 'change', render);
			this.template = vars.template;
		},

		render: function(vars){
			//use Underscore template, pass it the attributes from this model
			var attributes = this.model.attributes;

			if(vars){
				_.extend(attributes, vars);
			}

			var attr = {
				data: attributes
			};

			var content = _.template(this.template, attr);
			$(this.el).html(content);

			// return ```this``` so calls can be chained.
			return this;
	    },
	    unrender: function(){
			//use Underscore template, pass it the attributes from this model
			$(this.el).html('');

			// return ```this``` so calls can be chained.
			return true;
	    },
	});

	return FragmentView;

});