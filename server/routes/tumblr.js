var mongo = require('mongodb');
var Tumblr = require('tumblrwks');
var request = require('request');
var $ = require('jquery');


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



function returnCategories(returnObject, req, res){
    if(returnObject.flags >= 6){
       
        res.render('categoriesio', {
            title: 'Categories',
            architecture: returnObject.architecture.length,
            fashion: returnObject.fashion.length,
            tech: returnObject.tech.length,
            design: returnObject.design.length,
            women: returnObject.women.length,
            total_posts: returnObject.total_posts
        });
    }
}

function getCategories(req, res, returnObject, callback){
    var col = req.params.collection;

    db.collection(col, function(err, collection) {
        collection.find({ tags : 'architecture' }).toArray(function(err, items){
            returnObject.architecture = items;
            returnObject.flags++;
            callback(returnObject, req, res);
        });

        collection.find({ tags : 'fashion' }).toArray(function(err, items){
            returnObject.fashion = items;
            returnObject.flags++;
            callback(returnObject, req, res);
        });

        collection.find({ tags : 'tech' }).toArray(function(err, items){
            returnObject.tech = items;
            returnObject.flags++;
            callback(returnObject, req, res);
        });

        collection.find({ tags : 'design' }).toArray(function(err, items){
            returnObject.design = items;
            returnObject.flags++;
            callback(returnObject, req, res);
        });

        collection.find({ tags : 'women' }).toArray(function(err, items){
            returnObject.women = items;
            returnObject.flags++;
            callback(returnObject, req, res);
        });

        collection.find().count(function(err, number){
            returnObject.total_posts = number;
            returnObject.flags++;
            callback(returnObject, req, res);
        });

    });
}

exports.categoriesIO = function(req, res){
    var col = req.params.collection;

    var returnObject = {};
    returnObject.flags = 0;

    getCategories(req, res, returnObject, returnCategories);
}



function returnCategoriesPosts(returnObject, req, res){
    if(returnObject.flags >= 6){

        console.dir(returnObject.architecture[0].photos[0].alt_sizes);
       
        res.render('categoriesposts', {
            title: 'Categories',
            architecture: returnObject.architecture,
            fashion: returnObject.fashion,
            tech: returnObject.tech,
            design: returnObject.design,
            women: returnObject.women,
            total_posts: returnObject.total_posts
        });
    }
}

exports.categoriesPosts = function(req, res){
    var col = req.params.collection;

    var returnObject = {};
    returnObject.flags = 0;

    getCategories(req, res, returnObject, returnCategoriesPosts);
}

function returnCategoriesPost(returnObject, req, res){
    if(returnObject.flags >= 6){
        var id = parseInt( req.params.id );

        console.log('id: '+ id);

        var col = req.params.collection;



        db.collection(col, function(err, collection) {
            collection.find({ id : id }).toArray(function(err, items){
                console.dir(items);

                var post = items[0];

                var post_text = '';
                var post_photos = [];

                switch(post.type){
                    case 'photo':
                        for(var i in post.photos){
                            post_photos.push('<img src="' + post.photos[i].alt_sizes[1].url + '" width="' + post.photos[i].alt_sizes[1].width + 'px" height="' + post.photos[i].alt_sizes[1].height + 'px">');
                        }

                        var $caption = $(post.caption);
                        $caption.find('img').each(function(i){
                            console.log('');
                            console.log('img #'+ i);
                            console.log( $(this).attr('src') );
                            post_photos.push( '<img src="' + $(this).attr('src') + '" width="500px" height="auto">' );
                            $(this).remove();
                        });


                        $caption.each(function(i){
                            console.log('$$$$ '+ i);
                            if($(this).html() != undefined){
                                if(i == 0){
                                    post_text = post_text + '<h2 class="bold">' + $(this).html() + '</h2><br><br>';
                                    
                                    if(post.tags.length > 0){
                                        var tags_text = [];
                                        tags_text.push('<div class="post-tags">');

                                        for(var j = 0; j < post.tags.length; j++){
                                            if(j < post.tags.length -1 ){
                                                tags_text.push( '<span class="' + post.tags[j].toLowerCase().replace(/ /g,"-") + '">' + post.tags[j] + '</span>, ');
                                            }else{
                                                tags_text.push( '<span class="' + post.tags[j].toLowerCase().replace(/ /g,"-") + '">' + post.tags[j] + '</span>');
                                            }
                                        }

                                        tags_text.push('</div><br><br>');

                                        post_text = post_text + tags_text.join('');
                                    }
                                        
                                }else{
                                    post_text = post_text + $(this).html();
                                }
                            }
                        });

                        console.log('the caption: ');
                        console.log(post.caption);

                        console.log('the text: ');
                        console.log(post_text);

                        
                        break;
                    case 'text':
                        break;
                }

                res.render('categoriespostspost', {
                    title: 'Categories',
                    architecture: returnObject.architecture,
                    fashion: returnObject.fashion,
                    tech: returnObject.tech,
                    design: returnObject.design,
                    women: returnObject.women,
                    total_posts: returnObject.total_posts,
                    post_text: post_text,
                    post_photos: post_photos,
                    post_url: post.post_url
                });
            });
        });
            
    }
}

exports.categoriesPost = function(req, res){

    var returnObject = {};
    returnObject.flags = 0;

    getCategories(req, res, returnObject, returnCategoriesPost);
}







