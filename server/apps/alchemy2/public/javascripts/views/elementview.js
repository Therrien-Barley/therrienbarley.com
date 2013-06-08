define([
	'backbone',
	'text!../../../views/templates/element.html',
	'taxonomies',
	'models/element',
	'text!../../../views/templates/elementtumblr.html',
	'jquery-ui'
],
function(Backbone, template, TAXONOMIES, Element, templateTumblr) {

	var ElementView = Backbone.View.extend({
	    className: 'element',
	    tagName: 'li',
		template: template,
		events: {
	    	'click .editbutton': 'edit',
	    	'click .save': 'save',
	    	'click .cancel': 'cancel',
	    	'click .delete': 'delete'
	    },

	   	initDraggable: function(){
	   		console.log('initDraggable()');
	   		var this_selector = '#element-'+this.model.get('_id');
	   		console.log('this_selector: '+ this_selector);
	   		console.log('selector works: '+ $(this_selector).length);

	   		$('img', this_selector).each(function(i){
	   			console.log('draggable image: '+ i + ' with src: '+ $(this).attr('src'));
	   			$(this).draggable();
	   		});

	   		$('.annotations', this_selector).droppable({
	   			drop: function( event, ui ) {
	   				console.log('');console.log('');
	   				console.log('dropped!');
	   				console.log('event');
	   				console.dir(event);
	   				console.log('ui');
	   				console.dir(ui);
					$( this )
						.addClass( "ui-state-highlight" )
						.text( "Dropped!" );
					}
	   		});
	   	},

	    delete: function(){
	    	if(this.model.isNew()){
	    		this.model = null;
		    	this.remove();
	    	}else{
	    		this.model.destroy();
	    		this.remove();
	    	}
	    },

	    cancel: function(){
	    	console.log('cancel collection');
	    	if(this.model.isNew()){
	    		this.model = null;
	    		this.undelegateEvents();
		    	this.unrender();
		    	//remove disabling from Add Collection button
	    		$('#main .add').removeClass('disabled');
	    	}else{
	    		this.model.set( this.model.previousAttributes() );
	    		this.render();
	    	}

	    },

	    save: function(){
	    	console.log('save collection');
	    	var this_selector;
	    	if(this.model.isNew()){
	    		this_selector = '#collection-new';
	    	}else{
	    		this_selector = '#collection-'+this.model.get('_id');
	    	}

	    	var sources = [];
	    	$('.source-container', this_selector).each(function(i){
	    		var new_source = {
		    		type: $('.source-type-menu .selected', this).attr('type'),
		    		source: $('.source-source', this).text(),
		    		tags: $('.source-tags', this).text().split(',')
		    	};
		    	sources.push(new_source);
	    	});


	    	this.model.set({
	    		title: $('.title', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,""),
	    		description: $('.description', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,""),
	    		sources: sources

	    	});

	    	var that = this;

	    	this.model.save({},{
	    		success: function(model){
	    			console.log('saved! with _id');
	    			console.log(model.get('_id'));
	    			console.log('this_selector: '+ this_selector);

	    			$(this_selector).removeClass('edit-mode');
	    			$('.editable', this_selector).attr('contenteditable', 'false');

	    			if(this_selector == '#collection-new'){

	    				that.unrender();
	    				var new_view = new CollectionView({
	    					model: model,
		                    tagName: 'div'
		                });

		                $('.collections-list-el').prepend(new_view.render().el);

		                that = null;

	    				//remove disabling from Add Collection button
	    				$('#main .add').removeClass('disabled');
	    			}
	    		},
	    		error: function(){
	    			alert('Error attempting to save. Please retry.');
	    		}
	    	});
	    },

		edit: function(event){
	    	console.log('edit collection');
	    	var this_selector;
	    	if(this.model.isNew()){
	    		this_selector = '#collection-new';
	    	}else{
	    		this_selector = '#collection-'+this.model.get('_id');
	    	}

	    	$(this_selector).addClass('edit-mode');
	    	$('.editable', this_selector).attr('contenteditable', 'true');

	    },

		render: function(){
			//use Underscore template, pass it the attributes from this model
			/*
			switch(this.model.get('input_type')){
				case 'tumblr':
					this.template = templateTumblr;
					break;
				default:
					this.template = templateTumblr;
					break;
			}*/
			this.template = templateTumblr;

			var attributes = this.model.attributes;

			var attr = {
				data: attributes.data,
				_id: {
					value: attributes._id
				}
			};

			var content = _.template(this.template, attr);
			$(this.el).html(content);

			var that = this;
			setTimeout(function(){
				that.initDraggable();
			}, 100);

			

			// return ```this``` so calls can be chained.
			return this;
	    },

	    unrender: function(){
			//use Underscore template, pass it the attributes from this model
			$(this.el).html('');

			// return ```this``` so calls can be chained.
			return this;
	    },
	});

	return ElementView;

});