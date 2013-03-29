var mongo = require('mongodb');
var Tumblr = require('tumblrwks');
var request = require('request');


var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('audiinnovationresearch', server, {safe:false});

db.open(function(err, db) {
	console.log('opening DB audiinnovationresearch');
    if(!err) {
        console.log("Connected to audiinnovationresearch database");
        db.collection('tumblrposts', {safe:true}, function(err, collection) {
            if (err) {
                console.log("Error trying to open tumblrposts collection with error: " + err);
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







var MAX_TAGS = 15;
var MAX_PHOTOS = 3;
var MAX_INLINE_PHOTOS = 20;
var MAX_BODY_PARAGRAPHS = 25;

var itemNumber = 1;
var post_offset = 0;
var post_limit = 20;
var posts_gotten = 0;
var iter = 0;

var comp_array = [];

var components_array = [];


var done = true;


function getTumblrPosts(){
	post_offset = iter*post_limit;

	tumblr.get('/posts', {hostname: 'ifthisthenth-ey.tumblr.com', offset: post_offset, limit: post_limit}, function(json){

		for(var i = 0; i < json.posts.length; i++){

            db.collection('tumblrposts', function(err, collection) {
                collection.find({ id: json.posts[i].id }).toArray(function(err, items){
                    if(err){
                        console.log('Error: trying to find item in tumblrposts collection with id '+ json.posts[i].id);
                        console.log(err);
                    }else{
                        if(items.length == 1){
                            //element already in the collection so update it
                            collection.update({ id : json.posts[i].id }, {"$set": json.posts[i]}, {safe:true}, function(err, result) {
                                    if (err) {
                                        console.log('Error: An error has occurred in trying to update an element in tumblrposts collection with id '+json.posts[i].id);
                                        console.log(err);
                                    } else {
                                        console.log('Success: updated element in tumblrposts collection with id '+json.posts[i].id);
                                        console.dir(result);
                                    }
                                });
                        }else if(items.length > 1){
                            //more than one element in the collection with this ID so abort
                            //@todo: clean out the db and insert the new one only (ie. de-dupe)
                            console.log('Error: more than 1 item in tumblrposts collection matched id '+ json.posts[i].id);
                            console.log('aborting');
                        }else{
                            //element not in collection so insert it
                            json.posts[i].bson_id = json.posts[i].id;
                            var id_str = '' + json.posts[i].id;

                            var sb = '';
                            for(var j = 0; j < (24 - id_str.length); j++){
                                sb = sb + '0';
                            }

                            json.posts[i].bson_id = sb + id_str;
                            json.posts[i]._id = new BSON.ObjectID(json.posts[i].id_bson);


                            collection.insert( json.posts[i], {safe:true}, function(err, result) {
                                if (err) {
                                    console.log('error: An error has occurred in trying to insert an element into the tumblrposts collection with _id '+ json.posts[i].bson_id);
                                    console.log(err);
                                } else {
                                    console.log('Success: inserted an element into the tumblrposts collection with _id ' + json.posts[i].bson_id);
                                    console.dir(result);
                                }
                            });
                        }
                    }
                });//end find
            });//end db.collection
		}

		posts_gotten = posts_gotten + json.posts.length;
		
		if( json.total_posts > posts_gotten){
			iter++;
			getTumblrPosts();
		}
	});
}

getTumblrPosts();


