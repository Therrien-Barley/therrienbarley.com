define([
	'underscore',
	'backbone',
	'jquery-masonry',
	'models/fragment',
	'text!../../../views/templates/fragment.html',
	'text!../../../views/templates/featuredfragment.html'
],
function(_, Backbone, masonry, Fragment, template, featuredTemplate) {

	var FragmentView = Backbone.View.extend({
	    className: 'fragment',
	    template: template,
	    _fragmentsView: null,
	    events: {
	    	'mouseenter .insight-menu-icon': 'showInsightsMenu',
	    	'click .fragment-delete': 'delete',
	    	'click .fragment-feature': 'feature',
	    	'click .fragment-unfeature': 'unfeature'
	    },

	    initialize: function(opts){
	    	if(opts.template){
	    		this.template = opts.template;
	    	}
	    	if(opts.tagName){
	    		this.tagName = opts.tagName;
	    	}
	    	if(opts._fragmentsView){
	    		this._fragmentsView = opts._fragmentsView;
	    	}

	    	_.bind(this, 'save');
	    },

	    saveFeatured: function(order){
	    	console.log('saveFeatured() with order: '+order);

	    	var selector = '#featured-' + this.model.get('_id');
	    	var caption = $('.caption', selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,"");
	    	
	    	this.model.save({
				caption: caption,
				order: order
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
	    	console.log('this._fragmentsView:');
	    	console.dir(this._fragmentsView);

	    	var id = $(event.target).closest('.insight-container').attr('id');

	    	var new_fragment = this.model.clone();
	    	new_fragment.set({
	    		featured: true,
	    		order: 9999
	    	});//add it to the end

	    	var new_view = new FragmentView({
	    		model: new_fragment,
	    		template: featuredTemplate,
	    		tagName: 'li',
                el: '#'+id+' .featured',
                _fragmentsView: this._fragmentsView
	    	});

	    	//call append instead of render so it adds, rather than replaces
	    	new_view.append();

	    	var async = this._fragmentsView.addFeatured(new_view);
	    	this.unrender();
	    	$('#'+id+' .sortable').sortable();
	    	$('#'+id+' .sortable').disableSelection();
	    },

	    unfeature: function(event){
	    	var that = this;
	    	var id = $(event.target).closest('.insight-container').attr('id');

	    	//save the model with featured = false, and then render it to the 
	    	//fragments masonry attachment, then unrender the featured view
	    	this.model.set({
	    		featured: false,
	    		caption: '',
	    		order: -1
	    	});
	    	/*
			
			console.log('success! saved unfeatured');
			
			var new_fragment = that.model.clone();

	    	var new_view = new FragmentView({
	    		model: new_fragment,
                el: '#'+id+' .fragment-el',
                _fragmentsView: that._fragmentsView
	    	});
	    	var async = new_view.append({},'fragment');
	    	//$(that.el).append(new_view.render().el);
	    	*/
	    	that.unrender();
	    	/*
	    	console.log('calling masonry on : '+ '#'+id+' .masonry-wrapper');
	    	var $container = $('#'+id+' .masonry-wrapper');

	    	setTimeout(function(){
	    		$container.masonry({
	                itemSelector: '.fragment',
	                columnWidth: 250,
	                gutterWidth:17
	            });
	    	}, 100);
			*/     

	    		
	    		
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
	    append: function(vars, wrapperClass){
	    	var wrapperClass = wrapperClass || null;
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

			//for some reason it doesn't wrap fragments rendered through the feature() and unfeature()
			//functions in the className tag, so I have to do it explicitly
			if(wrapperClass != null){
				content = '<div class="'+ wrapperClass+'">'+content+'</div>';
			}

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