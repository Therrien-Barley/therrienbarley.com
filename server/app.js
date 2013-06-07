
/**
 * Module dependencies.
 */

var express = require('express');


var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



app
	//Therrien-Barley
	.use(express.vhost('research.therrienbarley.com', require('./apps/alchemy/app').app))
	.use(express.vhost('therrienbarley.com', require('./apps/therrienbarley/app').app))
	.use(express.vhost('www.therrienbarley.com', require('./apps/therrienbarley/app').app))
	//New Habitat
	.use(express.vhost('new-habit.at', require('./apps/newhabitat/app').app))
	.use(express.vhost('www.new-habit.at', require('./apps/newhabitat/app').app))
	.listen(app.get('port'), function(){
    	console.log("Express server listening on port " + app.get('port'));
  	});



