var mongo = require('mongodb');
var Tumblr = require('tumblrwks');
var request = require('request');

var path = require('path');
var mime = require('mime');

process.setMaxListeners(0);

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

//HELPER FUNCTION
//returns html of the element itself
function getOuterHTML(el, fit){   
    var fit = fit || false;
    var wrapper = '';

    if(el){
        var inner = el.innerHTML;
        var wrapper = '<' + el.tagName;

        for( var i = 0; i < el.attributes.length; i++ ){
            wrapper += ' ' + el.attributes[i].nodeName + '="';
            //fit to 100% width if fit flag set
            if(el.attributes[i].nodeName == 'width' && fit){
                wrapper += '100%' + '"';
            }else{
                wrapper += el.attributes[i].nodeValue + '"';
            }
        }
        wrapper += '>' + inner + '</' + el.tagName + '>';
    }
    return wrapper;
}



function populateArrayPhoto(a,url){
	if(url != null){
		var filename = url;
		filename = filename.split('/').pop();

		if(filename.length > 100){
			filename = 'randomFilename_' + Math.floor(Math.random()*1000000000000000);
			console.log('** filename: '+ filename);
		}

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
		console.log('^^^ adding image with src: '+ $(this).attr('src'));
		temp_array.push( $(this).attr('src') );
	});

	$html.find('img').remove();

	//add ------- to the beginning of each blockquote
	$html.find('blockquote').each(function(){
		console.log('*******found blockquote with text');
		console.log( $(this).text() );
		var text = $(this).text();
		$(this).text('>>>>>>>' + text + '<<<<<<<');
	});

	if(temp_array.length > 0){
		inline_images.push( temp_array );
	}

	return $html;
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


function populateBodyCaption(a,value,field){
	console.log('populateBodyCaption()');

	var valueStr = '' + value;
	if(value != null){//get rid of the IFTTT tags

		valueStr = ent.decode( valueStr );

		var $html = populateInlineImages(valueStr);//strips out all images and populates the image array, returns html string without img tags

		var html_text = $html.text();

		var paras = html_text.split('\n');

		//remove any empty elements from the array
		for(var j = 0; j < paras.length; j++){
			if((paras[j] == '') || (paras[j].length < 3)){
				paras.splice(j, 1);
			}
		}

		for(var t = 0; t < MAX_BODY_PARAGRAPHS; t++){
			if(paras[t] != undefined){

				//vStr = _(vStr).stripTags();	
				
				paras[t] = paras[t].replace(/,/g, '');//replace all commas with empty string
				paras[t] = paras[t].replace(/,/g, '');//replace all commas with empty string
				paras[t] = paras[t].replace(/—/g, '-');//replace all commas with empty string
				paras[t] = paras[t].replace(/—/g, '-');//replace all commas with empty string
				paras[t] = paras[t].replace(/“/g, '"');//replace all commas with empty string
				paras[t] = paras[t].replace(/”/g, '"');//replace all commas with empty string
				paras[t] = paras[t].replace(/’/g, "'");//replace all commas with empty string
				paras[t] = paras[t].replace(/‘/g, "'");//replace all commas with empty string

				paras[t] = paras[t].replace(/</g, '');//replace all commas with empty string
				paras[t] = paras[t].replace(/>/g, '');//replace all commas with empty string
				paras[t] = paras[t].replace(/&nbsp;/g, ' ');//replace all commas with empty string

				paras[t] = paras[t].replace(/í/g, 'i');//replace all commas with empty string
				paras[t] = paras[t].replace(/•/g, '-');//replace all commas with empty string
				paras[t] = paras[t].replace(/»/g, '');//replace all commas with empty string

				//paras[t] = ent.decode( paras[t] );

				a.push( paras[t] );
			}else{
				a.push(' ');
			}
		}
	}else{
		//console.log('value is: '+value);
		for(var t = 0; t < MAX_BODY_PARAGRAPHS; t++){
			a.push(' ');
		}
	}
	return a;
}


function createCSV(s, res){
	var d = new Date();
	var month = d.getMonth()+1;
	var date = ''+d.getFullYear()+month+d.getDate();

	var path = __dirname+'/spreadsheets/';
	var filename = date + 'spreadsheet_'+ Math.floor(Math.random()*10000) +'.csv';
	var filepath = path+filename;

	fs.writeFile(filepath, s, { encoding: 'utf8'}, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");

			var mimetype = mime.lookup(filepath);

			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.setHeader('Content-type', mimetype);

			var filestream = fs.createReadStream(filepath);
			filestream.pipe(res);
	    }
	});
}

var MAX_TAGS = 15;
var MAX_PHOTOS = 10;
var MAX_INLINE_PHOTOS = 20;
var MAX_BODY_PARAGRAPHS = 25;

var itemNumber = 1;
var post_offset = 0;
var post_limit = 20;
var posts_gotten = 0;
var iter = 0;

var comp_array = [];

var components_array = [];
components_array.push( 'item' );
components_array.push( 'id' );
components_array.push( 'date' );
components_array.push( 'post_url' );
components_array.push( 'type' );

//components_array.push( 'note_count' );
components_array.push( 'title' );
//components_array.push( 'body' );
//components_array.push( 'caption' );

/*
components_array.push( 'word count' );
components_array.push( 'image count' );
components_array.push( 'link count' );
*/

//components_array.push( 'timestamp' );

for(var t = 0; t < MAX_BODY_PARAGRAPHS; t++){
	components_array.push( 'body' + t );
}

for(var t = 0; t < MAX_BODY_PARAGRAPHS; t++){
	components_array.push( 'caption' + t );
}


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



function getTumblrPosts(res){
	post_offset = iter*post_limit;

	console.log('');console.log('');console.log('');
	console.log('getTumblrPosts() with iter: '+ iter + ', post_offset: '+ post_offset);

	tumblr.get('/posts', {hostname: 'ifthisthenth-ey.tumblr.com', offset: post_offset, limit: post_limit}, function(json){
		console.log('*************');
		console.log('*************');
		//console.log(json.posts);

		//array to store all post date from this call to Tumblr API
		var components = [];

		//cycle through all the posts returned
		for(var i = 0; i < json.posts.length; i++){
			//align _id with tumblr id
			json.posts[i].bson_id = json.posts[i].id
			var id_str = '' + json.posts[i].id;
			var sb = '';
			for(var j = 0; j < (24 - id_str.length); j++){
				sb = sb + '0';
			}
			json.posts[i].bson_id = sb + id_str;

			var components_array = [];

			components_array = populateArray(components_array, itemNumber);
			itemNumber++;

			components_array = populateArray(components_array, json.posts[i].id);
			components_array = populateArray(components_array, json.posts[i].date);
			components_array = populateArray(components_array, json.posts[i].post_url);
			components_array = populateArray(components_array, json.posts[i].type);
			//components_array = populateArray(components_array, json.posts[i].note_count);
			components_array = populateArray(components_array, json.posts[i].title);

			//strips out photos and puts in inline_images array
			components_array = populateBodyCaption(components_array, json.posts[i].body, 'body');
			components_array = populateBodyCaption(components_array, json.posts[i].caption, 'caption');
			//components_array = populateArray(components_array, json.posts[i].timestamp);

			var tags_length = (json.posts[i].tags.length < MAX_TAGS) ? json.posts[i].tags.length : MAX_TAGS;
			
			for(var k = 0; k < MAX_TAGS; k++){
				if(k < tags_length){
					populateArray(components_array, json.posts[i].tags[k]);
				}else{
					populateArray(components_array, null);
				}
			}
			
			//if photo post, fill photos columns with photos
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
		

		if( json.total_posts > posts_gotten){
			iter++;
			getTumblrPosts(res);
		}else{
			var final_string = comp_array.join('\n');
			createCSV(final_string, res);
		}

	});



}

exports.download = function(req, res){
	getTumblrPosts(res);
}



exports.sync = function(req, res){
	fetchTumblr(20, 0, req, res);
}

var fetched_total_posts = 0;

function fetchTumblrCallback(limit, offset, req, res, fetched_posts, inserted_posts, total_posts){
	fetched_total_posts++;
	//if fetched everything, finish by sending 205 status
	if(fetched_total_posts >= total_posts){
		console.log('finished fetching, returning 205');
		fetched_total_posts = 0;//reset for the next sync
		res.send(205);//status 205 = Reset Content
	}else{
		//if not fetched everything, check to see if inserted everything in present fetch
		//and call fetch again
		if(inserted_posts >= fetched_posts){
			fetchTumblr(limit, fetched_total_posts, req, res);
		}
	}
}

function fetchTumblr(limit, offset, req, res){
	console.log('fetchTumblr() with offset: '+ offset);
	var col = req.params.collection;

	tumblr.get('/posts', {hostname: 'ifthisthenth-ey.tumblr.com', offset: offset, limit: limit}, function(json){

		var inserted_posts = 0;

		var total_posts = json.total_posts;
		var fetched_posts = json.posts.length;

		//cycle through all the posts returned
		for(var i = 0; i < fetched_posts; i++){

			var post = json.posts[i];

			//align _id with tumblr id
			json.posts[i].bson_id = json.posts[i].id
			var id_str = '' + json.posts[i].id;
			var sb = '';
			for(var j = 0; j < (24 - id_str.length); j++){
				sb = sb + '0';
			}
			json.posts[i].bson_id = sb + id_str;

			//sanitize tags
			for(var t = 0; t < json.posts[i].tags.length; t++){
                json.posts[i].tags[t] = json.posts[i].tags[t].toLowerCase();
                //convert all instances of 'technology' to 'tech'
                if(json.posts[i].tags[t] == 'technology'){
                	json.posts[i].tags[t] = 'tech';
                }
                //remove all IFTTT and t tags
                if(json.posts[i].tags[t] == 'ifttt' || json.posts[i].tags[t] == 't'){
                	json.posts[i].tags.splice(t, 1);
                }
            }


            db.collection(col, function(err, collection) {
                collection.update({ id: json.posts[i].id }, {"$set": json.posts[i]}, {safe:true, upsert:true}, function(err, result) {
                    if (err) {
                        console.log('error: An error has occurred in trying to upsert into the DB '+col+' collection');
                        console.log(err);
                    } else {
                        console.log('Success: added a post to to '+col+' collection with id '+ post.id);
                    	inserted_posts++;
                    	fetchTumblrCallback(limit, offset, req, res, fetched_posts, inserted_posts, total_posts);
                    }
                });
            });

		}//end for loop over all posts
	});
}


exports.clear = function(){
    db.collection('tumblrposts', function(err, collection) {
        collection.remove({}, 0);
    });
}


