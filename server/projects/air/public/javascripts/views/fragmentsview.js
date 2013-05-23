define([
	'backbone',
	'jquery-masonry',
	'views/fragmentview',
	'text!../../../views/templates/fragments.html',
	'text!../../../views/templates/featuredfragment.html'
],
function(Backbone, masonry, FragmentView, template, featuredTemplate) {
	var FragmentsView = Backbone.View.extend({
		tagName: 'div',
	    className: 'fragment',
	    _insightView: null,
		_fragmentViews: null,
		_fragmentViewEl: null,
		_featuredViews: null,
		_featuredViewEl: null,
		collection: null,
		template: template,

	    initialize : function(vars) {
		    var that = this;
		    this._fragmentViews = [];
		    this._featuredViews = [];
		    if(vars._fragmentViewEl){
		    	this._fragmentViewEl = vars._fragmentViewEl;
		    }

		    if(vars._featuredViewEl){
		    	this._featuredViewEl = vars._featuredViewEl;
		    }

		    if(vars._insightView){
		    	this._insightView = vars._insightView;
		    }

		    var that = this;

		    _.each(this.collection.models, function(model, index){
		    	var featured = model.get('featured');

		    	if(typeof(featured) != 'undefined'){
		    		if(featured == true){
		    			that._featuredViews.push( new FragmentView({
		                    model: model,
		                    tagName: 'li',
		                    el: this._featuredViewEl,
				    		template: featuredTemplate,
				    		_fragmentsView: that
		                }));
		    		}else{
		    			that._fragmentViews.push( new FragmentView({
		                    model: model,
		                    tagName: 'div',
		                    el: this._fragmentViewEl,
				    		_fragmentsView: that
		                }));
		    		}
		    	}else{
		    		that._fragmentViews.push( new FragmentView({
	                    model: model,
	                    tagName: 'div',
	                    el: this._fragmentViewEl,
				    	_fragmentsView: that
	                }));
		    	}
            });
	
		},

		addFeatured: function(featuredView){
	    	this._featuredViews.push(featuredView);
	    },

		saveFeatured: function(){
			var that = this;

			_.each(this._featuredViews, function(featuredView, index){
				var selector = '#insight-'+that._insightView.model.get('_id')+' #featured-'+featuredView.model.get('_id');
				var index = $(selector).parent().index();

				featuredView.saveFeatured( parseInt(index) );
			});
		},
		 
		render: function(vars) {
			var that = this;
		    // Clear out this element.
		    $(this.el).empty();

		    if(vars){
		    	var attr = { data: {
			    		tag: vars.tag,
			    		total_fragments: this._fragmentViews.length
				    }
				};
		    }else{
		    	var attr = { data: {
		    			total_fragments: this._fragmentViews.length
		    		}
				};
		    }


		    var content = _.template(this.template, attr);
			$(this.el).html(content);

	 		// Render each sub-view and append it to the parent view's element.
		    _.each(this._fragmentViews, function(fragmentView) {
		    	if(vars){
			    	if(vars.tag){
			    		$(that._fragmentViewEl).append(fragmentView.render({tag: vars.tag}).el);
			    	}
			    }else{
			    	$(that._fragmentViewEl).append(fragmentView.render().el);
			    }
		    });

		    var $container = $('.masonry-wrapper');

            $container.masonry({
                itemSelector: '.fragment',
                columnWidth: 250,
                gutterWidth:17
            });

			$container.imagesLoaded( function(){
			  	$container.masonry();
			});



			//render featured fragments
			_.each(this._featuredViews, function(featuredView) {
			    $(that._featuredViewEl).append(featuredView.render().el);
		    });		    

		    return true;
		}
	});

	return FragmentsView;

});