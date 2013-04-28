
define([
	'jquery',
	'models/project'
],
function($, Project) {

	function initProjects(){
		//build the page
		$('#main, #hackcity, #footer').empty();

		$('#main').html('<a id="create">create project</a>');

		$('#create').bind('click', function(event){
			$('#main').append('<div id="create-form"><h2 id="title" contenteditable="true">Title</h2><div id="date" contenteditable="true">Date</div><div id="description" contenteditable="true">Description</div><a id="save">Save</a>');

			//create new project
			$('#save').bind('click', function(event){
				event.preventDefault();

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