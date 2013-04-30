define([
	'underscore',
	'backbone'
],
function(_, Backbone) {

	var FragmentView = Backbone.View.extend({
	    className: 'fragment',

	    events: {
	    	'mouseenter .insight-menu-icon': 'showInsightsMenu',
	    	'click .fragment-delete': 'delete'
	    },

	    delete: function(){
	    	var conf = confirm("This will remove the fragment from this insight, this cannot be undone. Are you sure you would like to remove this fragment?");
			if (conf==true){
				console.dir(this.model);
				this.unrender();
  				this.model.destroy({
		    		success: function(model, response, options){
		    			//alert('The fragment has been removed from the insight');
		    		}
		    	});
  			}

	    },

	    showInsightsMenu: function(){
	    	var that = this;
	    	var $menu = $('#insights-menu').clone();
	    	$menu.attr('id', 'insights-menu-live').show();
	    	$(this.el).append($menu);

	    	$menu.bind('mouseleave', function(){
	    		$(this).remove();
	    	});

	    	$menu.find('li').bind('click', function(){

	    		that.model.save({
	    			type: 'image',
	    			image: that.model.get('image'),
	    			element: that.model.get('post_id'),
	    			tags: that.model.get('tags'),
	    			category: that.model.get('category'),
	    			insight_id: $(this).attr('id').substr(8),
	    			post_url: that.model.get('post_url')
	    		}, {
	    			success: function(model, response){
	    				console.log('saved! new model');
	    				console.dir(model);
	    			}
	    		});
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