define([
	'underscore',
	'backbone',
	'text!../../../views/templates/fragment.html'
],
function(_, Backbone, template) {

	var FragmentView = Backbone.View.extend({
	    className: 'fragment',
	    template: template,
	    events: {
	    	'mouseenter .insight-menu-icon': 'showInsightsMenu',
	    	'click .fragment-delete': 'delete'
	    },

	    delete: function(){
	    	var conf = confirm("This will remove the fragment from this insight, this cannot be undone. Are you sure you would like to remove this fragment?");
			if (conf==true){
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
	    			type: that.model.get('type'),
	    			content: that.model.get('content'),
	    			element: that.model.get('post_id'),
	    			tags: that.model.get('tags'),
	    			category: that.model.get('category'),
	    			insight_id: $(this).attr('id').substr(8),
	    			post_url: that.model.get('post_url'),
	    			caption: ''
	    		}, {
	    			success: function(model, response){
	    			}
	    		});
	    	});
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

			console.log('*** length');
			console.log('this.el: '+ this.el);
			console.dir(this.el);
			console.log($(this.el).length);

			var content = _.template(this.template, attr);

			console.log(content);
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