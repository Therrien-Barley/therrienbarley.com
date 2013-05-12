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
		    	var iV = vars._insightView;
		    }else{
		    	var iV = null;
		    }

		    var that = this;

		    _.each(this.collection.models, function(model, index){
		    	var featured = model.get('featured');

		    	if(typeof(featured) != 'undefined'){
		    		if(featured == true){
		    			console.log('found a featured! vars');
		    			console.log('that._featuredViewEl: '+ that._featuredViewEl);

		    			that._featuredViews.push( new FragmentView({
		                    model: model,
		                    tagName: 'li',
		                    el: that._featuredViewEl,
		                    _insightView: iV,
				    		template: featuredTemplate
		                }));
		    		}else{
		    			that._fragmentViews.push( new FragmentView({
		                    model: model,
		                    tagName: 'div',
		                    el: this._fragmentViewEl,
		                    _insightView: iV
		                }));
		    		}
		    	}else{
		    		that._fragmentViews.push( new FragmentView({
	                    model: model,
	                    tagName: 'div',
	                    el: this._fragmentViewEl,
	                    _insightView: iV
	                }));
		    	}
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
			    		console.log('rendering A, that._fragmentViewEl: ');
			    		console.log(that._fragmentViewEl);
			    		console.log('fragmentView');
			    		console.dir(fragmentView);

			    		$(that._fragmentViewEl).append(fragmentView.render({tag: vars.tag}).el);
			    	}
			    }else{
			    	console.log('rendering B, that._fragmentViewEl: ');
			    		console.log(that._fragmentViewEl);
			    		console.log('fragmentView');
			    		console.dir(fragmentView);
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