var mongo = require('mongodb');
var Tumblr = require('tumblrwks');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ifthisthenth-eydb', server, {safe:false});

db.open(function(err, db) {
	console.log('opening DB ifthisthenth-eydb');
    if(!err) {
        console.log("Connected to 'ifthisthenth-eydb' database");
        db.collection('posts', {safe:true}, function(err, collection) {
            if (err) {
                console.log("Error trying to open posts collection with error: " + err);
            }
        });
    }
});

/*
  For accessToken and accessSecret, user need to grant access of your app. I recommend to use: https://github.com/jaredhanson/passport-tumblr
*/

var tumblr = new Tumblr(
  {
    consumerKey: 'IMMvdPYHS4s0jniNnAj53aOxWaw5GwqsbwJhnYdXm14DQZfcHc'
  }, "ifthisthenth-ey.tumblr.com"
  // specify the blog url now or the time you want to use
);

tumblr.get('/posts', {hostname: 'ifthisthenth-ey.tumblr.com'}, function(json){
	console.log('*************');
	console.log('*************');
	console.log('*************');
	console.log('*************');
	console.log(json.posts);

	for(var i = 0; i < json.posts.length; i++){

		json.posts[i].bson_id = json.posts[i].id

		var id_str = '' + json.posts[i].id;

		var sb = '';
		for(var j = 0; j < (24 - id_str.length); j++){
			sb = sb + '0';
		}

		json.posts[i].bson_id = sb + id_str;

		db.collection('posts', function(err, collection) {
	        collection.update({_id:new BSON.ObjectID(json.posts[i].bson_id)}, {"$set": json.posts[i]}, {safe:true, upsert:true}, function(err, result) {
	        	if (err) {
	                console.log('error: An error has occurred in trying to upsert into the DB posts collection');
	                console.log(err);
	            } else {
	                console.log('Success: ' + JSON.stringify(result[0]));
	                //res.send(result[0]);
	            }
	        });
		});
	}

});
