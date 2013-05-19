define([
	'underscore',
	'backbone',
	'text!../../../views/templates/insight.html',
	'models/fragment',
	'views/fragmentview',
	'collections/fragments',
	'views/fragmentsview',
	'models/insight',
	'jquery-ui'
],
function(_, Backbone, template, Fragment, FragmentView, Fragments, FragmentsView, Insight) {

	var InsightView = Backbone.View.extend({
	    className: 'insight',
	    tagName: 'div',
	    template: template,
	    _fragmentsView: null,
	    _fragments: null,

	    events: {
	    	'click .delete': 'delete',
	    	'click .cancel': 'cancel',
	    	'click .edit': 'edit',
	    	'click .save': 'save',
	    	'click .clone': 'clone'
	    },

	    initialize: function(vars){
	    	if(vars){
	    		if(vars._fragments){
	    			this._fragments = vars._fragments;
	    		}else{
	    			this._fragments = new Fragments();
	    		}
	    	}else{
	    		this._fragments = new Fragments();
	    	}
	    	
	    },

	    clone: function(){

	    	console.log('cloning');

	    	var that = this;

	    	var clone = new Insight({
	    		type: 'insight',
                title: this.model.get('title'),
                categories: this.model.get('categories'),
                description: this.model.get('description'),
                questions: this.model.get('questions'),
                fragments: this.model.get('fragments'),
                section: this.model.get('section')
	    	});

	    	clone.save({}, {
	    		success: function(model, response, options){

	    			console.log('success!!');
	    			console.dir(model);
	    			console.log('_id: '+ model.get('_id'));

		    		var frags = new Fragments();

		    		console.log('that._fragments');
		    		console.dir(that._fragments);

		            _.each(that._fragments, function(fragment, index){
		            	console.log('frag tags: '+fragment.get('tags'));
		    			console.dir(fragment.get('tags'));


		            	var frag = new Fragment({
		            		type: fragment.get('type'),
					        element: fragment.get('element'),
					        tags: fragment.get('tags'),
					        category: fragment.get('category'),
					        insight_id: ''+ model.get('_id'),
					        post_url: fragment.get('post_url'),
					        content: fragment.get('content'),
					        caption: fragment.get('caption'),
					        order: fragment.get('order'),
					        featured: fragment.get('featured')
		            	});

		            	frag.save();

		            	frags.add(frag);
		            });

			        var insight_view = new InsightView({
		                model: model,
		                tagName: 'div',
		                el: '#new-insights-el',
		                _fragments: frags.models
		            });

		            //run render synchronously
		            if(typeof insight_view.render() != 'undefined' ){
		                $('#new-insights-el .insight-container').addClass('edit-mode');
		                $('#new-insights-el .insight-container .edit').removeClass('edit span2').addClass('save span1 pull-left').text('Save');
		                $('#new-insights-el .insight-container .editable').attr('contenteditable', 'true');

		                var $container = $('.masonry-wrapper');

			            $container.masonry({
			                itemSelector: '.fragment',
			                columnWidth: 250,
			                gutterWidth:17
			            });

						$container.imagesLoaded( function(){
						  	$container.masonry();
						});
		            }
		        }
	    	});


		    	
	    },

	    //@todo: delete the fragments too!
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
	    	$('.edit', this_selector).removeClass('edit offset7').addClass('save pull-left offset5').text('Save');
	    	$('.editable', this_selector).attr('contenteditable', 'true');

	    	$('.fragment', this_selector).each(function(){

	    	});

		    $('.sortable', this_selector).sortable();
	    	$('.sortable', this_selector).disableSelection();

	    },

	    cancel: function(){
	    	this.unrender();
	    	this.render();
	    },

	    save: function(){

	    	var newInsight = this.model.isNew();

	    	var this_selector = newInsight ? '#new-insights-el .insight-container' : '#insight-'+ this.model.get('_id');
            var title = $('.title', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,"");
            var description = $('.description', this_selector).text();

            var categories = $('.categories', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,"").split(',');

            var section = $('.section select', this_selector).val();

            $('.section .selected').text(section);

            this.model.set({
                'title': title, 
                'categories' : categories,
                'description': description,
                'section': section
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
            $('.save', this_selector).text('Edit').removeClass('save offset5 pull-left').addClass('edit offset7');
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
			console.log('RENDERING!!!!!!! with fragments: ');
			console.dir(fragments);


			if(fragments){
				console.log('setting this._fragments');
				this._fragments = fragments;
			}else{
				fragments = this._fragments;
				console.log('just set this._fragments with');
				console.dir(this._fragments);
			}
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