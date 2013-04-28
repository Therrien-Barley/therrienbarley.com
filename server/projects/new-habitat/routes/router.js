
var projects = require('../controllers/projects');
var presentations = require('../controllers/presentations');
var tumblr = require('../controllers/tumblr');



exports.newhabitatget = function(req, res){
	console.log('newhabitatroute() with url and it\'s array:');
	console.log(req.url);
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	console.dir(url_array);

	if(typeof url_array[1] == 'undefined'){
		res.render('../projects/new-habitat/views/index', 
		{
			title: 'New Habs'
		});
	}else{
		switch(url_array[1]){
			case '':
				res.render('../projects/new-habitat/views/index', 
				{
					title: 'New Habs'
				});
				break;
			case 'api':
				switch(url_array[2]){
					case 'project':
						console.log('/api/project::create');
						projects.get(req, res, url_array[3]);
						break;
					default:
						res.send(501, 'Invalid api request to '+req.url);
						break;
				}
				break;
			case 'projects':
				if(typeof url_array[2] == 'undefined'){
					projects.index(req, res);
				}else{
					//projectid
					project.project(req, res, url_array[3]);
				}
				break;
			default:
				res.send(501, 'This IP does not serve that host domain');//501 = not implemented
				break;

		}	
	}
};

exports.newhabitatpost = function(req, res){
	console.log('newhabitatpost() with url and it\'s array:');
	console.log(req.url);
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	console.dir(url_array);

	if(typeof url_array[1] == 'undefined'){
		res.render('../projects/new-habitat/views/index', 
		{
			title: 'New Habs'
		});
	}else{
		switch(url_array[1]){
			case 'api':
				switch(url_array[2]){
					case 'refresh':
						switch(url_array[3]){
							case 'presentations':
								//eg. projectid, refreshTumblr
								presentations.refresh(req, res);
								break;
							default:
								res.send(501, 'This IP does not serve that host domain');//501 = not implemented
								break;
						}
						break;
					case 'project':
						console.log('/api/project::create');
						projects.create(req, res);
						break;
					default:
						res.send(501, 'Invalid api request to '+req.url);
						break;
				}
				break;
			default:
				res.send(501, 'This IP does not serve that host domain');//501 = not implemented
				break;

		}	
	}
};