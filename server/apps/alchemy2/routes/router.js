
var tumblr = require('../controllers/tumblr');
var fetchtumblr = require('../controllers/fetchtumblr');
var insights = require('../controllers/insights');
var fragments = require('../controllers/fragments');
var collections = require('../controllers/collections');
var users = require('../controllers/users');
var url = require('url');


//url_array[1] is insights

exports.put = function(req, res){
	console.log('insightairput() with url and it\'s array:');
	console.log(req.url);
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	console.dir(url_array);

	switch(url_array[2]){
		case 'api':
			switch(url_array[3]){
				case 'user':
					//console.log('/insights/api/user::update');
					//users.update(req, res, url_array[4]);
					break;
				case 'collection':
					console.log('/insights/api/collection::update');
					collections.update(req, res, url_array[4]);
					break;
				case 'insight':
					console.log('/insights/api/insight::update');
					insights.update(req, res, url_array[4]);
					break;
				case 'fragment':
					console.log('/insights/air/api/fragment::update');
					fragments.update(req, res, url_array[4]);
					break;
				default:
					res.send(501, 'Invalid api put request to '+req.url);
					break;
			}
			break;
		default:
			res.send(501, 'This IP does not serve put requests to '+req.url);//501 = not implemented
			break;
	}	
}

exports.delete = function(req, res){
	console.log('insightairdelete() with url and it\'s array:');
	console.log(req.url);
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	console.dir(url_array);

	switch(url_array[2]){
		case 'api':
			switch(url_array[3]){
				case 'collection':
					console.log('/insights/api/collection::delete');
					collections.delete(req, res, url_array[4]);
					break;
				case 'insight':
					console.log('/insights/air/api/insight::delete');
					insights.delete(req, res, url_array[4]);
					break;
				case 'fragment':
					console.log('/insights/air/api/fragment::delete');
					fragments.delete(req, res, url_array[4]);
					break;
				default:
					res.send(501, 'Invalid api delete request to '+req.url);
					break;
			}
			break;
		default:
			res.send(501, 'This IP does not serve delete requests to '+req.url);//501 = not implemented
			break;

	}	
}

exports.post = function(req, res){
	console.log('insightairpost() with url and it\'s array:');
	console.log(req.url);
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	console.dir(url_array);

	switch(url_array[2]){
		case 'api':
			switch(url_array[3]){
				case 'collection':
					console.log('router.js::create collection called');
					collections.create(req, res);
					break;
				case 'insight':
					console.log('/insights/api/insight::create');
					insights.create(req, res);
					break;
				case 'fragment':
					fragments.create(req, res);
					break;
				case 'fragments':
					if(typeof url_array[4] == 'undefined'){
						console.log('yes! trying to get all fragments');
						fragments.get(req, res);
					}else{
						console.log('calling tumblr.getFragments() with : '+ url_array[4]);
						fragments.get(req, res, url_array[4]);
					}	
					break;
				default:
					res.send(501, 'Invalid api post request to '+req.url);
					break;
			}
			break;
		default:
			res.send(501, 'This IP does not serve post requests to '+req.url);//501 = not implemented
			break;

	}	
};


exports.get = function(req, res){
	
	console.log('alchemy::route()');
	var url_parts = url.parse(req.url, true);
	console.dir(url_parts);
	var url_array = url_parts.pathname.split('/');//gets rid of the preceding empty string
	console.dir(url_array);


	var uid = req.params.uid;

	console.log('the UID: '+ uid);

	console.log('req.user.id: '+ req.user.id);
	console.log('');console.log('');console.log('');



	if(url_array[2]){
		console.log('going into the switch');
		switch(url_array[2]){
			case 'collections':
				res.render('collections', { 
					title: 'Therrien–Barley Insights',
					user: req.user
				});
				break;
			case 'collection':
				switch(url_array[4]){
					case 'content':
						res.render('collection/content', { 
							title: 'Therrien–Barley Insights',
							user: req.user,
							collection: url_array[3]
						});
						break;
				}
				break;
			case 'users':
				res.render('users', { 
					title: 'Therrien–Barley Insights',
					user: req.user
				});
				break;
			case 'api':
				console.log('--->api');
				console.log('url_array[3]: '+ url_array[3]);

				switch(url_array[3]){
					case 'user':
						users.get(req, res, url_array[4]);
						break;
					case 'element':
						console.log('collections.getElements(req, res)');
						if(req.query._id){
							collections.getElements(req, res);
						}
						break;
					case 'collection':
						console.log('collections.get(req, res)');
						collections.get(req, res);
						break;
					case 'user':
						users.get(req, res);
						break;
					case 'insight':
						insights.get(req, res, url_array[4]);
						break;
					case 'fragments':
						if(typeof url_array[4] == 'undefined'){
							console.log('yes! trying to get all fragments');
							fragments.get(req, res);
						}else{
							console.log('calling tumblr.getFragments() with : '+ url_array[4]);
							fragments.get(req, res, url_array[4]);
						}	
						break;
					case 'fragment':
						if(typeof url_array[4] == 'undefined'){
							console.log('yes! trying to get all fragments');
							fragments.get(req, res);
						}else{
							console.log('calling tumblr.getFragments() with : '+ url_array[4]);
							fragments.get(req, res, url_array[4]);
						}	
						break;

					//@todo!!!!!!!
					case 'get':
						console.log('--->get');
						switch(url_array[4]){
							case 'tumblrpost':
								console.log('--->tumblrpost');
								console.log('getting Element by id');
								tumblr.getElement(req, res, url_array[5]);
								break;
							
						}
						break;
					//calls a fetch using the tumblr API to update the db
					case 'sync':
						fetchtumblr.sync(req, res);
						break;
					//downloads a CSV
					case 'download':
						fetchtumblr.download(req, res);
						break;
				}
				break;

			case 'sources':
				switch(url_array[3]){
					case 'blogs':
						res.render('sources/blogs', 
						{
							title: 'Sources - Blogs | Therrien–Barley'
						});
						break;
					case 'magazines':
						res.render('sources/magazines', 
						{
							title: 'Sources - Magazines | Therrien–Barley'
						});
						break;
					default:
						res.send(501, 'This IP does not serve that host domain');//501 = not implemented
						break;
				}
				break;
			case 'categories':
				switch(url_array[3]){
					case 'distribution':
						tumblr.getElementsDistributionByTags(req, res, 'categories');
						break;
					case 'elements':
						tumblr.getElementsByTags(req, res, 'categories');
						break;
					case 'fragments':
						res.render('categories/fragments', {
			                title: 'Categories Fragments | Therrien-Barley'
			            });
						break;
					default:
						res.send(501, 'This IP does not serve that host domain');//501 = not implemented
						break;
				}
				break;
			case 'terms':
				switch(url_array[3]){
					case 'distribution':
						tumblr.renderTermsDistribution(req, res);
						break;
					case 'elements':
						tumblr.getElementsByTags(req, res, 'terms');
						break;
					case 'fragments':
						res.render('categories/fragments', {
			                title: 'Categories Fragments | Therrien-Barley'
			            });
						break;
					default:
						res.send(501, 'This IP does not serve that host domain');//501 = not implemented
						break;
				}
				break;
			case 'insights':
				switch(url_array[3]){
					case 'insights':
						res.render('insights/insights', {
			                title: 'Insights - Insights | Therrien-Barley'
			            });
						break;
					default:
						res.render('insights/insights', {
			                title: 'Insights - Insights | Therrien-Barley'
			            });
						break;
				}
				break;
			default:
				res.send(501, 'This IP does not serve get requests to '+req.url);//501 = not implemented
				break;
		}
	}else{
		console.log('should render alchmey.ejs');
		//home page
		res.render('collections', { 
			title: 'A.I.R. Trend Research | Therrien–Barley',
			user: req.user
		});

	}
		
};