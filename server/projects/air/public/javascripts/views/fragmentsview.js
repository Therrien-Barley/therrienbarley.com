define([
	'backbone',
	'jquery-masonry',
	'views/fragmentview',
	'text!../../../views/templates/fragments.html'
],
function(Backbone, masonry, FragmentView, template) {
	var FragmentsView = Backbone.View.extend({
		tagName: 'div',
	    className: 'fragment',
		_fragmentViews: null,
		_fragmentViewEl: null,
		collection: null,
		template: template,

	    initialize : function(vars) {
		    var that = this;
		    this._fragmentViews = [];
		    if(vars._fragmentViewEl){
		    	console.log('init _fragmentViewEl with '+ vars._fragmentViewEl);
		    	this._fragmentViewEl = vars._fragmentViewEl;
		    }

		    _.each(this.collection.models, function(model, index){
                that._fragmentViews.push( new FragmentView({
                    model: model,
                    tagName: 'div',
                    el: this._fragmentViewEl
                }));
            });
		},
		 
		render : function(vars) {
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
			    	console.log('that._fragmentViewEl');
			    	console.dir(that._fragmentViewEl);
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

			    

		    return true;
		}
	});

	return FragmentsView;

});