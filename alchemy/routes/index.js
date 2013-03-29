
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};








var mongo = require('mongodb');
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



exports.tags = function(req, res){

	db.collection('posts', function(err, collection) {
        collection.find().toArray(function(err, items) {
        	if(err){
        		console.log('Error: showAll() fired an error:');
        		console.log(err);
        		res.render('tags', { title: 'Tag Breakdown', posts: null, error: err, tags: null });
        	}else{
            	console.log('total posts found: ' + items.length);

            	var tags = [];


            	for(var i = 0; i < items.length; i++){
            		for(var j = 0; j < items[i].tags.length; j++){
            			if(tags[ items[i].tags[j] ] != undefined){
            				tags[ items[i].tags[j] ].instances++;
            			}else{
            				tags[ items[i].tags[j] ] = {
            					tag: items[i].tags[j],
            					instances: 1
            				};
            			}
            		}
            	}

				res.render('tags', { title: 'Tag Breakdown', posts: items, error: null, tags: tags });
            }
        });
    });

	
};

exports.posts = function(req, res){

	var posts;

	db.collection('posts', function(err, collection) {
        collection.find().toArray(function(err, items) {
        	if(err){
        		console.log('Error: showAll() fired an error:');
        		console.log(err);
        	}else{
            	console.log('total posts found: ' + items.length);
            	posts = items;
            	console.log(posts[0]);


            	

            	
				res.render('tags', { title: 'Tag Breakdown', post: items[0], posts: items });
            }
        });
    });

	
};








