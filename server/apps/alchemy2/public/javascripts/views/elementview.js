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
	    
	    //wraps iframes in div and adds icon-move for draggable onto .annotations drop target
	   	initDraggableIframes: function(){
	   		console.log('initDraggableIframes()');
	   		var this_selector = '#element-'+this.model.get('_id');

	   		$('iframe', this_selector).each(function(i){
	   			$(this).wrap('<div class="video-drag-wrapper" type="iframe" draggable="true">');
	   			$(this).parent('.video-drag-wrapper').append('<i class="icon-move"></i>');
	   			$(this).parent('.video-drag-wrapper').height($(this).height());
	   		});
	   	},

	   	//initializes iframe, img, and selected text to be dragged onto .annotations drop target
	   	initDraggable: function(){
	   		function startDrag (e) {		
				if (e.target.tagName == "IMG") {
	   				var html = '<img class="note" src="'+ e.target.src + '">';

					e.dataTransfer.setData("text/html", html);
				}else if (e.target.textContent != ''){

					function getSelection(){
						var text;
						if (window.getSelection){
							text = window.getSelection().toString();
						} else if (document.getSelection) {
							text = document.getSelection().toString()
						} else if (document.selection) {
							text = document.selection.createRange().text;
						}
						return text;
					}

					var text = '<blockquote class="note">'+getSelection()+'</blockquote>';
					console.log('text: '+ text);

					e.dataTransfer.setData("text/html", text);
				}else if(e.target.className == "video-drag-wrapper"){

					var src = '';
					$(e.target.innerHTML).each(function(){
						if($(this).prop("tagName") == 'IFRAME'){
							src = $(this).attr('src');
						}
					});

					var html = '<iframe class="note" frameborder="0" src="'+src+'"></iframe>';
					e.dataTransfer.setData("text/html", html );
				}

			};

			document.addEventListener('dragstart', startDrag, true);

	   	},

	   	//initializes .annotations as a drop target for iframe, img, and selected text
	   	initDroppable: function(){
	   		var this_selector = '#element-'+this.model.get('_id');

	   		function drop(e){
	   			var data;
	   			for (var i in e.dataTransfer.types) {
			    	data = e.dataTransfer.getData(e.dataTransfer.types[i]);
			    }

			    $(data).each(function(){
			    	switch($(this).prop('tagName')){
			    		case 'IFRAME':
			    			var src = $(this).attr('src');
			    			if( $('.annotations iframe[src="'+src+'"]', this_selector).length <= 0){
			    				$('.annotations', this_selector).append( $(this) );
			    			}
			    			break;
			    		case 'IMG':
			    			var src = $(this).attr('src');
			    			if( $('.annotations img[src="'+src+'"]', this_selector).length <= 0){
			    				$('.annotations', this_selector).append( $(this) );
			    			}
			    			break;
			    		case 'BLOCKQUOTE':
			    			console.dir($(this));
			    			var dup = false;
			    			var $this = $(this);
			    			$('.annotations blockquote', this_selector).each(function(){
			    				if($(this).text() == $this.text()){
			    					dup = true;
			    				}
			    			});
			    			if(dup == false){
			    				$('.annotations', this_selector).append( $(this) );
			    			}
			    			break;
			    	}
			    });

	   			e.stopPropagation();
			    e.preventDefault();
			    return false
	   		}

	   		function dragOver(e){
	   			e.stopPropagation();
			    e.preventDefault();
			    return false;
	   		}

	   		function dragEnter(e){
	   			return false;
	   		}

	   		//need to implement all three for drop to work
	   		$('.annotations', this_selector).get(0).addEventListener("drop", drop, false);
		    $('.annotations', this_selector).get(0).addEventListener("dragenter", dragEnter, false)
		    $('.annotations', this_selector).get(0).addEventListener("dragover", dragOver, false)
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