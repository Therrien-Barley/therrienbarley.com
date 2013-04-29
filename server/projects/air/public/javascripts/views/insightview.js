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
	    	'click .edit': 'edit',
	    	'click .save': 'save'
	    },

	    edit: function(){
	    	var this_selector = '#insight-'+ this.model.get('_id');
	    	console.log('this_selector: '+ this_selector);

	    	$(this_selector).addClass('edit-mode');
	    	$('.edit', this_selector).removeClass('edit').addClass('save').text('Save');
	    	$('.editable', this_selector).attr('contenteditable', 'true');

	    },

	    save: function(){
	    	console.log('insightview.js::save!');

	    	var this_selector = '#insight-'+ this.model.get('_id');
            var title = $('.title', this_selector).text();
            var description = $('.description', this_selector).text();

            var categories = $('.categories', this_selector).text().split(',');

            this.model.set({
                'title': title, 
                'categories' : categories,
                'description': description
            });

            this.model.save();

            $(this_selector).removeClass('edit-mode');
            $('.save', this_selector).text('Edit').removeClass('save').addClass('edit');
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