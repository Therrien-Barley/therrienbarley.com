define([
	'backbone',
	'text!../../../views/templates/collection.html',
	'taxonomies',
	'models/collection'
],
function(Backbone, template, TAXONOMIES, Collection) {

	var CollectionView = Backbone.View.extend({
	    className: 'collection row-fluid',
	    tagName: 'li',
		template: template,
		events: {
	    	'click .editbutton': 'edit',
	    	'click .save': 'save',
	    	'click .cancel': 'cancel',
	    	'click .delete': 'delete',
	    	'click .addsource': 'addSource',
	    	'click .deletesource': 'deleteSource',
	    	'mouseenter .inner': 'showEditButton',
	    	'mouseleave .inner': 'hideEditButton'
	    },

	    showEditButton: function(){
	    	if(!this.model.isNew()){
	    		var this_selector = '#collection-'+this.model.get('_id');
	    		$(this_selector).addClass('showeditbutton');
	    	}	
	    },

	    hideEditButton: function(){
	    	if(!this.model.isNew()){
	    		var this_selector = '#collection-'+this.model.get('_id');
	    		$(this_selector).removeClass('showeditbutton');
	    	}	
	    },

	    addSource: function(){
	    	var this_selector;
	    	if(this.model.isNew()){
	    		this_selector = '#collection-new';
	    	}else{
	    		this_selector = '#collection-'+this.model.get('_id');
	    	}

	    	$('.sources', this_selector).append('<li class="row-fluid source-container"><ul class="source-type-menu span2"><li class="selected" type="tumblr"><i class="icon-tumblr"></i></li></ul><div class="editable source-source span9" contenteditable="true">source</div><div class="span4 editable source-tags" contenteditable="true">tag</div><div class="span1 deletesource"><i class="icon-remove"></i></div></li>');

	    },

	    deleteSource: function(event){
	    	console.log('deleteSource()');
	    	console.dir(event.target);
	    	$(event.target).closest('.source-container').remove();
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
/*
	    				var $cn = $('#collection-new').detach();
	    				var $newWrapper = $('<div class="collection row-fluid"></div>');
	    				$newWrapper.append($cn);
	    				$('.collections-list-el').prepend($newWrapper);
	    				$('#collection-new').attr('id', 'collection-'+model.get('_id'));
	    				*/
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

			var attributes = this.model.attributes;

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
			return this;
	    },
	});

	return CollectionView;

});