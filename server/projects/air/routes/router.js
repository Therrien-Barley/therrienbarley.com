
var tumblr = require('../controllers/tumblr');
var fetchtumblr = require('../controllers/fetchtumblr');
var insights = require('../controllers/insights');
var fragments = require('../controllers/fragments');


exports.insightairput = function(req, res){
	console.log('insightairput() with url and it\'s array:');
	console.log(req.url);
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	console.dir(url_array);

	switch(url_array[3]){
		case 'api':
			switch(url_array[4]){
				case 'insight':
					console.log('/insights/air/api/insight::update');
					insights.update(req, res, url_array[5]);
					break;
				case 'fragment':
					console.log('/insights/air/api/fragment::update');
					fragments.update(req, res, url_array[5]);
					break;
				default:
					res.send(501, 'Invalid api request to '+req.url);
					break;
			}
			break;
		default:
			res.send(501, 'This IP does not serve '+req.url);//501 = not implemented
			break;

	}	
}

exports.insightairdelete = function(req, res){
	console.log('insightairdelete() with url and it\'s array:');
	console.log(req.url);
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	console.dir(url_array);

	switch(url_array[3]){
		case 'api':
			switch(url_array[4]){
				case 'insight':
					console.log('/insights/air/api/insight::delete');
					insights.delete(req, res, url_array[5]);
					break;
				case 'fragment':
					console.log('/insights/air/api/fragment::delete');
					fragments.delete(req, res, url_array[5]);
					break;
				default:
					res.send(501, 'Invalid api request to '+req.url);
					break;
			}
			break;
		default:
			res.send(501, 'This IP does not serve '+req.url);//501 = not implemented
			break;

	}	
}

exports.insightairpost = function(req, res){
	console.log('insightairpost() with url and it\'s array:');
	console.log(req.url);
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	console.dir(url_array);

	switch(url_array[3]){
		case 'api':
			switch(url_array[4]){
				case 'insight':
					console.log('/insights/air/api/insight::create');
					insights.create(req, res);
					break;
				case 'fragment':
					fragments.create(req, res);
					break;
				default:
					res.send(501, 'Invalid api request to '+req.url);
					break;
			}
			break;
		default:
			res.send(501, 'This IP does not serve '+req.url);//501 = not implemented
			break;

	}	
};


exports.insightairget = function(req, res){
	console.log('insightairroute()');
	console.log(req.url);
	var url_array = req.url.split('/');//gets rid of the preceding empty string
	console.dir(url_array);
	if(url_array[3]){
		console.log('going into the switch');
		switch(url_array[3]){
			case 'api':
				console.log('--->api');

				switch(url_array[4]){
					case 'insight':
						insights.get(req, res, url_array[5]);
						break;
					case 'fragment':
						if(typeof url_array[5] == 'undefined'){
							console.log('yes! trying to get all fragments');
							fragments.get(req, res);
						}else{
							console.log('calling tumblr.getFragments() with : '+ url_array[6]);
							tumblr.getFragments(req, res, 'categories', url_array[5], unescape(url_array[6]));
						}	
						break;

					//@todo!!!!!!!
					case 'get':
						console.log('--->get');
						switch(url_array[5]){
							case 'tumblrpost':
								console.log('--->tumblrpost');
								console.log('getting Element by id');
								tumblr.getElement(req, res, url_array[6]);
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
				switch(url_array[4]){
					case 'blogs':
						res.render('../projects/air/views/sources/blogs', 
						{
							title: 'Sources - Blogs | Therrien–Barley'
						});
						break;
					case 'magazines':
						res.render('../projects/air/views/sources/magazines', 
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
				switch(url_array[4]){
					case 'distribution':
						tumblr.getElementsDistributionByTags(req, res, 'categories');
						break;
					case 'elements':
						tumblr.getElementsByTags(req, res, 'categories');
						break;
					case 'fragments':
						res.render('../projects/air/views/categories/fragments', {
			                title: 'Categories Fragments | Therrien-Barley'
			            });
						break;
					default:
						res.send(501, 'This IP does not serve that host domain');//501 = not implemented
						break;
				}
				break;
			case 'terms':
				switch(url_array[4]){
					case 'distribution':
						tumblr.renderTermsDistribution(req, res);
						break;
					case 'elements':
						tumblr.getElementsByTags(req, res, 'terms');
						break;
					case 'fragments':
						res.render('../projects/air/views/categories/fragments', {
			                title: 'Categories Fragments | Therrien-Barley'
			            });
						break;
					default:
						res.send(501, 'This IP does not serve that host domain');//501 = not implemented
						break;
				}
				break;
			case 'insights':
				switch(url_array[4]){
					case 'insights':
						res.render('../projects/air/views/insights/insights', {
			                title: 'Insights - Insights | Therrien-Barley'
			            });
						break;
					case 'material':
						res.render('../projects/air/views/insights/insights', {
			                title: 'Insights - Material | Therrien-Barley'
			            });
						break;
					default:
						res.render('../projects/air/views/insights/insights', {
			                title: 'Insights - Insights | Therrien-Barley'
			            });
						break;
				}
				break;
			default:
				res.send(501, 'This IP does not serve that host domain');//501 = not implemented
				break;
		}
	}else{
		console.log('should render alchmey.ejs');
		//home page
		res.render('../projects/air/views/alchemy', { 
			title: 'A.I.R. Trend Research | Therrien–Barley'
		});
	}
		
};