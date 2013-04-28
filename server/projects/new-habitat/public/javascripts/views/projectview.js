define([
	'underscore',
	'backbone',
	'text!../../../views/templates/homeproject.html',
	'text!../../../views/templates/project.html',
	'models/work',
	'collections/works',
	'views/worksview'

],
function(_, Backbone, homeTemplate, projectTemplate, Work, Works, WorksView) {

	var ProjectView = Backbone.View.extend({
	    className: 'project',
	    template: homeTemplate,

	    events: {
		    "click .view": "open",
		    "click .edit_gallery": "editGallery"
		},

		initialize: function(vars){
			if(vars.template){
				this.template = vars.template;
			}
		},

		editGallery: function(){
			console.log('editGallery!');
			var that = this;
			$('body').append('<div id="input-form"><div id="close">X</div></div>');

			$('#input-form').append('<h2>Edit Gallery</h2>');
			$('#input-form').append('<div id="new-work" class="line"><div id="new-work-id" class="label" contenteditable="true">NewWork-ID</div><div class="button plus">+</div></div>');

			$('#input-form').append('<ul id="work-ids-el"></ul>');

			_.each(this.model.get('work_ids'), function(workID, index){
				$('#work-ids-el').append('<li class="line"><div contenteditable="true">'+workID+'</div><div class="button minus">-</div></li>');
			});

			$('#input-form').append('<div class="button save">Save</div>');

			$('#close').bind('click', function(){
				$('#input-form').detach();
			});

			$('.plus').bind('click', function(){
				$('#work-ids-el').append('<li class="line"><div class="work-id" contenteditable="true">'+$('#new-work-id').text()+'</div><div class="button minus">-</div></li>');
			});

			$('.save').bind('click', function(){
				var works = [];
				$('#work-ids-el li').each(function(){
					works.push($('.work-id', this).text());
				});

				that.model.set('works', works);

				that.model.save();

				console.log("calling that.render()");

				that.render();
			});
		},

		open: function(){
			console.log('open!');
			console.dir(this.model);

			this.unrender();

			$('#main').empty();
			$('#main').append('<div id="project-el"></div>');

			var pv = new ProjectView({
				model: this.model,
				el: '#project-el',
				template: projectTemplate
			});

			pv.render();
		},

		renderWorks: function(){
			console.log('called renderWorks()');

			if(typeof this.model._works != 'undefined'){
				console.log('this.model.get(works)');
				console.dir(this.model.get('works'));
				var key = 'ZWPsDquPDANctjAnxAcTmKL2ywTit3LyiMaLIYXK8C0wMcsYuu';

				var target_url = 'http://api.tumblr.com/v2/blog/new-habitat.tumblr.com/info';

				$.ajax({
			    	type : "GET",
			    	dataType : "jsonp",
			    	data: { api_key: key },
			        url : target_url, // ?callback=?
			        success: function(data){
			          console.log('success');
			          console.log(data);
			        },

			        error: function(e){
			          console.log('tumblr ajax error');
			          console.dir(e);
			        }
			    }); 


			}

		},

		render: function(vars){
			//use Underscore template, pass it the attributes from this model
			var attributes = this.model.toJSON();

			if(vars){
				_.extend(attributes, vars);
			}
		
			var content = _.template(this.template, attributes, {variable: 'data'});
			$(this.el).html(content);

			this.renderWorks();

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

	return ProjectView;

});