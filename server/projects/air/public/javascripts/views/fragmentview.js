define([
	'underscore',
	'backbone',
	'models/fragment',
	'text!../../../views/templates/fragment.html',
	'text!../../../views/templates/featuredfragment.html'
],
function(_, Backbone, Fragment, template, featuredTemplate) {

	var FragmentView = Backbone.View.extend({
	    className: 'fragment',
	    template: template,
	    _insightView: null,//link to the related insight view
	    events: {
	    	'mouseenter .insight-menu-icon': 'showInsightsMenu',
	    	'click .fragment-delete': 'delete',
	    	'click .fragment-feature': 'feature'
	    },

	    initialize: function(opts){
	    	if(opts.template){
	    		this.template = opts.template;
	    	}
	    	if(opts.tagName){
	    		this.tagName = opts.tagName;
	    	}
	    	if(opts._insightView){
	    		this._insightView = opts._insightView;
	    	}

	    	_.bind(this, 'save');
	    },

	    save: function(){
	    	console.log('featured model saved');

	    	var selector = '#insight-' + this._insightView.model.get('_id');
	    	console.log('selector: '+ selector);

	    	var caption = $('.caption', selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,"");
	    	
	    	this.model.save({
				featured: true,
				caption: caption
	    	}, {
	    		success: function(){
	    			console.log('featured model saved');
	    		},
	    		error: function(){
	    			console.log('ERROR: featured model NOT saved');
	    		}
	    	});
	    },

	    feature: function(event){

	    	console.log('this._insightView:');
	    	console.dir(this._insightView);

	    	var id = $(event.target).closest('.insight-container').attr('id');

	    	var new_fragment = this.model.clone();

	    	var new_view = new FragmentView({
	    		model: new_fragment,
	    		template: featuredTemplate,
	    		tagName: 'li',
                el: '#'+id+' .featured',
                _insightView: this._insightView
	    	});

	    	console.log('*******new_fragment');
	    	console.dir(new_fragment);
	    	console.dir(new_view);

	    	//call append instead of render so it adds, rather than replaces
	    	new_view.append();
	    	console.log('should have rendered!!!!!!!');

	    	this._insightView.addFeatured(new_view);

	    	this.unrender();

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

	    //same as render, but doesn't wipe out the el, just appends to it
	    //used for adding featured fragments
	    append: function(vars){
			//use Underscore template, pass it the attributes from this model
			var attributes = this.model.attributes;

			if(vars){
				_.extend(attributes, vars);
			}

			_.extend(attributes, { 'new': 'true' });

			var attr = {
				data: attributes
			};

			var content = _.template(this.template, attr);

			$(this.el).append(content);

			$('.caption').attr('contenteditable', 'true');
			
			// return ```this``` so calls can be chained.
			return this;
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