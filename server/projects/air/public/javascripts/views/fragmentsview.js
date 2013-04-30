define([
	'backbone',
	'views/fragmentview',
	'text!../../../views/templates/fragments.html'
],
function(Backbone, FragmentView, template) {
	console.dir(_);

	var FragmentsView = Backbone.View.extend({
		tagName: 'div',
	    className: 'fragment',
		_fragmentViews: null,
		collection: null,
		template: template,

	    initialize : function(vars) {
		    var that = this;
		    this._fragmentViews = [];
		    if(vars._fragmentViewEl){
		    	this._fragmentViewEl = vars._fragmentViewEl;
		    }

		    if(vars._fragmentTemplate){
		    	this._fragmentTemplate = vars._fragmentTemplate;
		    }

		    _.each(this.collection.models, function(model, index){
                that._fragmentViews.push( new FragmentView({
                    model: model,
                    tagName: 'div',
                    template: vars._fragmentTemplate,
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

			console.log('fragmentsview.js::render() with attr:');
			console.dir(attr);

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

		    return true;
		}
	});

	return FragmentsView;

});