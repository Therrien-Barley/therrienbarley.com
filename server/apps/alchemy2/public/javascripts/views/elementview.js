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

	   	initDraggableImages: function(){
	   		console.log('initDraggable()');
	   		var this_selector = '#element-'+this.model.get('_id');

	   		$('img', this_selector).each(function(i){
	   			$(this).attr('type', 'img').draggable({
	   				revert: true
	   			});
	   		});

	   	},

	   	initDraggableObjects: function(){
	   		console.log('initDraggableObjects()');
	   		var this_selector = '#element-'+this.model.get('_id');

	   		$('object', this_selector).each(function(i){
	   			$(this).attr('type', 'object').draggable({
	   				revert: true
	   			});
	   		});

	   	},

	   	initDraggableIframes: function(){
	   		console.log('initDraggableIframes()');
	   		var this_selector = '#element-'+this.model.get('_id');

	   		$('iframe', this_selector).each(function(i){
	   			$(this).wrap('<div class="video-drag-wrapper" type="iframe">');
	   			$(this).parent('.video-drag-wrapper').append('<i class="icon-move"></i>').draggable({
	   				revert: true
	   			});
	   		});
	   	},

	   	initDroppable: function(){
	   		var this_selector = '#element-'+this.model.get('_id');
	   		$('.annotations', this_selector).droppable({
	   			drop: function( event, ui ) {

	   				var $note;

	   				switch($(ui.draggable.context).attr('type')){
	   					case 'img':
	   						console.log('image dropped');
			   				$note = $('<img class="note">');
	   						$note.attr('src', $(ui.draggable.context).attr('src'));
	   						break;
	   					case 'iframe':
	   						console.log('iframe dropped');
	   						$note = $('<iframe class="note" frameborder="0"></iframe>');
		   					$note.attr('src', $(ui.draggable.context).find('iframe').attr('src'));
	   						break;
	   				}

	   				$('.list', this).append( $note );

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
				that.initDraggableImages();
				that.initDraggableObjects();
				that.initDraggableIframes();
				that.initDroppable();
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