var mongo = require('mongodb');
var Tumblr = require('tumblrwks');
var csv = require('csv');
var request = require('request');
var _  = require('underscore');
var fs = require('fs');

// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());

// All functions, include conflict, will be available through _.str object
_.str.include('Underscore.string', 'string'); // => true


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



function populateArrayPhoto(a,url){

	if(url != null){

		var filename = url;
		filename = filename.split('/').pop();
		var pathname = __dirname + '/photos/' + filename;
		request( url ).pipe(fs.createWriteStream( pathname ));

		a.push( 'Users:troytherrien:Insync:info@th-ey.co:GIT:therrienbarley.com:util:node:tumblr-air:photos:'+filename );
	}else{
		console.log('url is: '+url);
		a.push(' ');
	}
	return a;
}




function populateArray(a,value,htmlValues){
	htmlValues = htmlValues || false;

	var vStr = '' + value;

	if(value != null){

		if(htmlValues){
			vStr = _(vStr).stripTags();
		}

		vStr = vStr.replace(/,/g, '');//replace all commas with empty string
		vStr = vStr.replace(/\n/g, ' ');//replace all commas with empty string

		vStr = _(vStr).prune(500);//trim to 500 characters without cutting words in half

		a.push( vStr );
	}else{
		console.log('value is: '+value);
		a.push(' ');
	}
	return a;
}

function createCSV(s){
	csv()
		.from( s )
		.to.path(__dirname+'/spreadsheet.csv');
		// Output:
		// 1,2,3,4
		// a,b,c,d
}

var MAX_TAGS = 3;
var MAX_PHOTOS = 2;

tumblr.get('/posts', {hostname: 'ifthisthenth-ey.tumblr.com'}, function(json){
	console.log('*************');
	console.log('*************');
	console.log('*************');
	console.log('*************');
	//console.log(json.posts);

	var components = [];

	var components_array = [];
	components_array.push( 'id' );
	components_array.push( 'post_url' );
	components_array.push( 'type' );
	//components_array.push( 'date' );
	//components_array.push( 'note_count' );
	components_array.push( 'title' );
	components_array.push( 'body' );
	components_array.push( 'caption' );

	//components_array.push( 'timestamp' );

	
	for(var t = 0; t < MAX_TAGS; t++){
		components_array.push( 'tag' + t );
	}
	

	
	for(var p = 0; p < MAX_PHOTOS; p++){
		components_array.push( '@photo' + p );
	}
	


	components[0] = components_array.join(',');

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

		var components_array = [];

		components_array = populateArray(components_array, json.posts[i].id);
		components_array = populateArray(components_array, json.posts[i].post_url);
		components_array = populateArray(components_array, json.posts[i].type);
		//components_array = populateArray(components_array, json.posts[i].date);
		//components_array = populateArray(components_array, json.posts[i].note_count);
		components_array = populateArray(components_array, json.posts[i].title);
		components_array = populateArray(components_array, json.posts[i].body, true);
		components_array = populateArray(components_array, json.posts[i].caption, true);
		//components_array = populateArray(components_array, json.posts[i].timestamp);

		var tags_length = (json.posts[i].tags.length < MAX_TAGS) ? json.posts[i].tags.length : MAX_TAGS;
		
		for(var k = 0; k < MAX_TAGS; k++){
			if(k < tags_length){
				populateArray(components_array, json.posts[i].tags[k]);
			}else{
				populateArray(components_array, null);
			}
		}



		
		if(json.posts[i].type == 'photo'){
			var photos_length = (json.posts[i].photos.length < MAX_PHOTOS) ? json.posts[i].photos.length : MAX_PHOTOS;
		
			for(var x = 0; x < MAX_PHOTOS; x++){
				if(x < photos_length){
					populateArrayPhoto(components_array, json.posts[i].photos[x].alt_sizes[0].url);
				}else{
					populateArray(components_array, null);
				}
			}
		}else{//if not photo post, fill with empty strings
			for(var k = 0; k < MAX_PHOTOS; k++){
				components_array.push( 'none' );
			}
		}
		

		

		components[i+1] = components_array.join(',');

	}

	var components_string = components.join('\n');

	createCSV(components_string);

});
