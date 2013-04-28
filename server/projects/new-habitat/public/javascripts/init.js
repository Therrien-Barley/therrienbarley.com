
define([
	'jquery',
	'collections/projects',
	'views/projectsview',
	'text!../../views/templates/projects.html',
],
function($, Projects, ProjectsView, projectsTemplate) {

	function initProjects(){
		//build the page
		$('#main, #hackcity, #footer').empty();

		$('#main').append('<div id="projects-el"></div>');

		var projects = new Projects();
		projects.fetch({
			success: function(collection, response, options){
				var projectsView = new ProjectsView({
                    collection: collection,
                    el: '#projects-el',
                    _projectViewEl: '#project-el',
                    _projectTemplate: projectsTemplate
                });

               projectsView.render();
			}
		});




		$('#main').append('<a id="create">create project</a>');

		$('#create').bind('click', function(event){
			$('#main').append('<div id="create-form"><h2 id="new-title" contenteditable="true">Title</h2><div id="new-date" contenteditable="true">Date</div><div id="new-description" contenteditable="true">Description</div><a id="save">Save</a>');

			//create new project
			$('#save').bind('click', function(event){
				event.preventDefault();

				console.log()

				var project = new Project({
					title: $('#new-title').text(),
					date: $('#new-date').text(),
					description: $('#new-description').text()
				});

				project.save();
			});
		});

			

	}

	var init = function(){

		
		var url_array = window.location.pathname.split('/');

		switch(url_array[1]){
			case '':
				$('#nav a').bind('click', function(event){
					event.preventDefault();

					switch($(this).attr('href')){
						case '/projects':
							initProjects();
							break;
					}
				});
				break;
			case 'api':

				break;
			case 'projects':

				break;
			default:
				break;
		}

	}

	return init;


});