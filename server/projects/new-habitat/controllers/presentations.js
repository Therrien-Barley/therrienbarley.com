var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('newhabitat', server, {safe:false});

db.open(function(err, db) {
	console.log('opening DB newhabitat');
    if(!err) {
        console.log("Connected to newhabitat database");
        db.collection('projects', {safe:true}, function(err, collection) {
            if (err) {
                console.log("Error trying to open projects collection with error: " + err);
            }
        });
    }
});


//render projects page using Backbone
exports.index = function(req, res){

}

//render project page using Backbone
exports.project = function(req, res, pid){

    

}













