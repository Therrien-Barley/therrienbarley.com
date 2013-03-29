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

exports.fetchTumblrPosts = function(req, res){
    var col = req.params.collection;
    return getTumblrPosts(col);
}



function getTumblrPosts(col){

    console.log('getTumblrPosts()');

	post_offset = iter*post_limit;


    tumblr.get('/posts', {hostname: 'ifthisthenth-ey.tumblr.com', offset: post_offset, limit: post_limit}, function(json){


        for(var i = 0; i < json.posts.length; i++){

            json.posts[i].bson_id = json.posts[i].id

            var id_str = '' + json.posts[i].id;

            var sb = '';
            for(var j = 0; j < (24 - id_str.length); j++){
                sb = sb + '0';
            }

            json.posts[i].bson_id = sb + id_str;

            for(var t = 0; t < json.posts[i].tags.length; t++){
                json.posts[i].tags[t] = json.posts[i].tags[t].toLowerCase();
            }


            db.collection(col, function(err, collection) {
                collection.update({_id:new BSON.ObjectID(json.posts[i].id_bson)}, {"$set": json.posts[i]}, {safe:true, upsert:true}, function(err, result) {
                    if (err) {
                        console.log('error: An error has occurred in trying to upsert into the DB posts collection');
                        console.log(err);
                    } else {
                        var g = posts_gotten + i;
                        console.log('Success: added to posts collection, number: '+ g);
                        //res.send(result[0]);
                    }
                });
            });

        }


        posts_gotten = posts_gotten + json.posts.length;
        console.log('posts_gotten: '+ posts_gotten);


        if( json.total_posts > posts_gotten){
            iter++;
            getTumblrPosts(col);
        }

    });
}



exports.info = function(req, res){
    var col = req.params.collection;

    db.collection(col, function(err, collection) {
        collection.find().count(function(err, number){
            console.log(number);
            res.send(number);
        });
    });
}

exports.clearDatabase = function(req, res){
    var col = req.params.collection;
    db.collection(col, function(err, collection) {
        collection.remove({}, 0);
        res.redirect('/alchemy');
    });
}

exports.posts = function(req, res){
    var col = req.params.collection;

    db.collection(col, function(err, collection) {
        collection.find().limit(100).toArray(function(err, items){
            res.send(items);
        });
        
    });
}



function returnCategories(returnObject, res){
    if(returnObject.flags >= 3){
       
        res.render('categories', {
            title: 'Categories',
            architecture: returnObject.architecture.length,
            fashion: returnObject.fashion.length,
            tech: returnObject.tech.length
        });
    }
}


exports.categories = function(req, res){
    var col = req.params.collection;

    var returnObject = {};
    returnObject.flags = 0;

    db.collection(col, function(err, collection) {
        collection.find({ tags : 'architecture' }).toArray(function(err, items){
            returnObject.architecture = items;
            returnObject.flags++;
            returnCategories(returnObject, res);
        });

        collection.find({ tags : 'fashion' }).toArray(function(err, items){
            returnObject.fashion = items;
            returnObject.flags++;
            returnCategories(returnObject, res);
        });

        collection.find({ tags : 'tech' }).toArray(function(err, items){
            returnObject.tech = items;
            returnObject.flags++;
            returnCategories(returnObject, res);
        });

    });
}

