define([
	'underscore',
	'backbone',
	'text!../../../views/templates/insight.html'

],
function(_, Backbone, template) {

	var InsightView = Backbone.View.extend({
	    className: 'insight',
	    tagName: 'div',
	    template: template,

	    events: {
	    	'click .delete': 'delete',
	    	'click .edit': 'edit',
	    	'click .save': 'save'
	    },

	    delete: function(){
	    	this.unrender();

	    	var conf = confirm("This will delete the insight from the database, this cannot be undone. Are you sure you would like to delete this insight?");
			if (conf==true)
  			{
  				this.model.destroy({
		    		success: function(model, response, options){
		    			alert('The Insight has been deleted from the database');
		    		}
		    	});
  			}
		    
	    },

	    edit: function(){
	    	var this_selector = '#insight-'+ this.model.get('_id');
	    	console.log('this_selector: '+ this_selector);

	    	$(this_selector).addClass('edit-mode');
	    	$('.edit', this_selector).removeClass('edit span2').addClass('save span1 pull-left').text('Save');
	    	$('.editable', this_selector).attr('contenteditable', 'true');

	    },

	    save: function(){
	    	console.log('insightview.js::save!!!');

	    	var newInsight = this.model.isNew();

	    	var this_selector = newInsight ? '#new-insights-el .insight-container' : '#insight-'+ this.model.get('_id');
            var title = $('.title', this_selector).text();
            var description = $('.description', this_selector).text();

            var categories = $('.categories', this_selector).text().split(',');

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
            	}
            });

            $(this_selector).removeClass('edit-mode');
            $('.save', this_selector).text('Edit').removeClass('save span1 pull-left').addClass('edit span2');
            $('.editable', this_selector).attr('contenteditable', 'false');
	    },

		render: function(vars){
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