define([
	'underscore',
	'backbone',
	'text!../../../views/templates/insight.html',
	'collections/fragments',
	'views/fragmentsview'
],
function(_, Backbone, template, Fragments, FragmentsView) {

	var InsightView = Backbone.View.extend({
	    className: 'insight',
	    tagName: 'div',
	    template: template,
	    _fragmentsView: null,

	    events: {
	    	'click .delete': 'delete',
	    	'click .edit': 'edit',
	    	'click .save': 'save'
	    },

	    delete: function(){
	    	var conf = confirm("This will delete the insight from the database, this cannot be undone. Are you sure you would like to delete this insight?");
			if (conf==true){
				this.unrender();
  				this.model.destroy({
		    		success: function(model, response, options){
		    			alert('The Insight has been deleted from the database');
		    		}
		    	});
  			}
		    
	    },

	    edit: function(){
	    	var this_selector = '#insight-'+ this.model.get('_id');

	    	$(this_selector).addClass('edit-mode');
	    	$('.edit', this_selector).removeClass('edit span2').addClass('save span1 pull-left').text('Save');
	    	$('.editable', this_selector).attr('contenteditable', 'true');

	    	$('.fragment', this_selector).each(function(){

	    	});

	    },

	    save: function(){

	    	var newInsight = this.model.isNew();

	    	var this_selector = newInsight ? '#new-insights-el .insight-container' : '#insight-'+ this.model.get('_id');
            var title = $('.title', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,"");
            var description = $('.description', this_selector).text();

            var categories = $('.categories', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,"").split(',');

            this.model.set({
                'title': title, 
                'categories' : categories,
                'description': description
            });

            this.model.save({}, {
            	success:function(model, response, options){
            		console.log('insightview.js::model saved! with newInsight = '+newInsight);
            		if(newInsight == true){
            			console.log('was a new insight, cleaning up with this.model id: '+ response[0]._id);

	            		$(this_selector).attr('id', '#insight-'+ response[0]._id);
	            		var $this = $(this_selector).detach();
	            		var $that = $('<div class="insight"></div>').append($this);
	            		$('#insights-el .insights-list-el').prepend($that);
	            	}

	            	$('.featured.new').each(function(){

	            	});
            	}
            });

            $(this_selector).removeClass('edit-mode');
            $('.save', this_selector).text('Edit').removeClass('save span1 pull-left').addClass('edit span2');
            $('.editable', this_selector).attr('contenteditable', 'false');

            var $container = $('.masonry-wrapper');

            $container.masonry({
                itemSelector: '.fragment',
                columnWidth: 250,
                gutterWidth:17
            });

			$container.imagesLoaded( function(){
			  	$container.masonry();
			});

			//save each of the featured fragments
			//_.each(this._featuredViews, function(featuredView, index){
			//	featuredView.saveFeatured();
			//});
			this._fragmentsView.saveFeatured();
	    },

	    renderFragments: function(frags){
	    	var that = this;

			var fragments_view_el = '#insight-'+ this.model.get('_id') +' .fragments-el';
	    	var fragmentViewEl = '#insight-'+ this.model.get('_id') +' .fragment-el';
	    	var featuredViewEl = '#insight-'+ this.model.get('_id') +' .featured';

			//quote fragments
	    	var fragments = new Fragments();
	    	fragments.add(frags);

	    	this._fragmentsView = null;


        	this._fragmentsView = new FragmentsView({
	    		collection: fragments,
	    		el: fragments_view_el, 
	    		_fragmentViewEl: fragmentViewEl,
	    		_featuredViewEl: featuredViewEl,
	    		_insightView: that
	    	});

	    	this._fragmentsView.render();
		},


		render: function(vars, fragments){
			var that = this;
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
			

			setTimeout(function(){
				that.renderFragments(fragments);
			}, 10);

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

	return InsightView;

});