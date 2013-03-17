var mongo = require('mongodb');
var Tumblr = require('tumblrwks');
var csv = require('csv');
var request = require('request');
var _  = require('underscore');
var fs = require('fs');
var $ = require('jquery');
var ent = require('ent');

// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());

// All functions, include conflict, will be available through _.str object
_.str.include('Underscore.string', 'string'); // => true

/*
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
*/

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

var inline_images = [];

//strips all images from HTML text and puts in the components array
function populateInlineImages(html){
	var temp_array = [];

	var $html = $(html);
	$html.find('img').each(function(i){
		temp_array.push( $(this).attr('src') );
	});

	if(temp_array.length > 0){
		inline_images.push( temp_array );
	}

	return true;

}

var once = true;

function populateArray(a,value,htmlValues){
	htmlValues = htmlValues || false;

	var vStr = '' + value;

	if(value == "tech" || value == "Tech" || value == "TECH"){
		console.log('value: '+ value);
		value = "Technology";
	}

	if(value != null){//get rid of the IFTTT tags

		if(htmlValues){
			var done = populateInlineImages(vStr);
			vStr = _(vStr).stripTags();		
		}

		vStr = vStr.replace(/,/g, '');//replace all commas with empty string
		vStr = vStr.replace(/\n/g, ' ');//replace all carriage returns with empty string

		vStr = ent.decode( vStr );

		//vStr = _(vStr).prune(500);//trim to 500 characters without cutting words in half

		a.push( vStr );
	}else{
		//console.log('value is: '+value);
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

var MAX_TAGS = 15;
var MAX_PHOTOS = 3;
var MAX_INLINE_PHOTOS = 20;


var post_offset = 0;
var post_limit = 20;
var posts_gotten = 0;
var iter = 0;

var comp_array = [];

var components_array = [];
components_array.push( 'id' );
components_array.push( 'date' );
components_array.push( 'post_url' );
components_array.push( 'type' );

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

for(var p = 0; p < MAX_INLINE_PHOTOS; p++){
	components_array.push( '@inlinePhoto' + p );
}


comp_array.push( components_array.join(',') );



function getTumblrPosts(){



	post_offset = iter*post_limit;

	console.log('');console.log('');console.log('');
	console.log('getTumblrPosts() with iter: '+ iter + ', post_offset: '+ post_offset);


	tumblr.get('/posts', {hostname: 'ifthisthenth-ey.tumblr.com', offset: post_offset, limit: post_limit}, function(json){
		console.log('*************');
		console.log('*************');
		//console.log(json.posts);

		var components = [];

		for(var i = 0; i < json.posts.length; i++){

			json.posts[i].bson_id = json.posts[i].id

			var id_str = '' + json.posts[i].id;

			var sb = '';
			for(var j = 0; j < (24 - id_str.length); j++){
				sb = sb + '0';
			}

			json.posts[i].bson_id = sb + id_str;

			var components_array = [];

			components_array = populateArray(components_array, json.posts[i].id);
			components_array = populateArray(components_array, json.posts[i].date);
			components_array = populateArray(components_array, json.posts[i].post_url);
			components_array = populateArray(components_array, json.posts[i].type);
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

			
			var inline_image_array = inline_images.pop();
			if(inline_image_array != undefined){
				for(var p = 0; p < MAX_INLINE_PHOTOS; p++){
					if(inline_image_array[p] != undefined){
						populateArrayPhoto(components_array, inline_image_array[p]);
					}else{
						populateArray(components_array, null);
					}
				}
			}else{
				for(var p = 0; p < MAX_INLINE_PHOTOS; p++){
					populateArray(components_array, null);
				}
			}
			/*
			for(var p = 0; p < MAX_INLINE_PHOTOS; p++){
				populateArray(components_array, null);
			}
			*/
			components.push( components_array.join(',') );
		}

		comp_array.push( components.join('\n') );//main storage array

		posts_gotten = posts_gotten + json.posts.length;

		console.log("posts_gotten: "+ posts_gotten + ' current json.posts.length: '+ json.posts.length);
		console.log('json.total_posts: '+ json.total_posts);
		

		if( json.total_posts > posts_gotten ){
			iter++;
			getTumblrPosts();
		}else{
			var final_string = comp_array.join('\n');
			createCSV(final_string);
		}

	});



}

getTumblrPosts();


