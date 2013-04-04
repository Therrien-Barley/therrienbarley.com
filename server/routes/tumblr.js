var mongo = require('mongodb');
var Tumblr = require('tumblrwks');
var request = require('request');
var $ = require('jquery');
var ent = require('ent');


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
                collection.update({_id:new BSON.ObjectID(json.posts[i].bson_id)}, {"$set": json.posts[i]}, {safe:true, upsert:true}, function(err, result) {
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





function getElements(req, res, callback){
    var col = req.params.collection;
    var taxonomy = req.params.taxonomy;
    var tag = req.params.tag || false;

    var returnObject = {};
    var i = 0;

    if(tag != false){
        findTag(col, tag, returnObject, req, res, callback);
    }else{
        findTaxonomyRecursive(col, taxonomy, i, returnObject, req, res, callback);
    }
}

function findTag(col, tag, returnObject, req, res, callback){
    var tag = tag.replace(/-/g," ");
        db.collection(col, function(err, collection) {
            collection.find({ tags : tag }).toArray(function(err, items){         
                returnObject[ tag ] = items;
                callback(returnObject, req, res);
            });  
        });
}

function findTaxonomyRecursive(col, taxonomy, i, returnObject, req, res, callback){
    if(i < TAXONOMIES[taxonomy].length){
        db.collection(col, function(err, collection) {
            
            console.log('finding '+ TAXONOMIES[taxonomy][i]);
            var tag = TAXONOMIES[taxonomy][i];

            collection.find({ tags : tag }).toArray(function(err, items){
                console.log('returned from find with tag: '+ tag);
                returnObject[ tag ] = items;
                i++;
                findTaxonomyRecursive(col, taxonomy, i, returnObject, req, res, callback);
            });
            
        });
    }else{
        db.collection(col, function(err, collection) {
            collection.count(function(err, number){
                callback(returnObject, req, res, number);
            });
        });
        
    }   
}


exports.getElementsDistributionByTags = function(req, res){
    var col = req.params.collection;

    getElements(req, res, returnDistribution);
}


function returnDistribution(returnObject, req, res, total_posts){
    switch(req.params.taxonomy){
        case 'categories':
            res.render('categoriesdistribution', {
                title: 'Categories Distribution',
                elements: returnObject,
                total_posts: total_posts,
                colors: TAXONOMIES['colors']
            });
            break;
        case 'terms':
            var data = [];
            var i = 0;
            for(var tag in returnObject){
                data[i++] = {
                    name: tag,
                    val: Math.floor(returnObject[tag].length/total_posts * 100)
                };
            }

            console.log('returnObject.length: '+Object.keys(returnObject).length);
           
            var total_objects = Object.keys(returnObject).length;
            var increment = Math.floor(256/total_objects);
            var colors = [];
            var j = 0;
            for(var tag in returnObject){
                var redValue = 256-(j*increment);
                redValue = redValue.toString(16);

                if(redValue.length == 1){
                    redValue = '0' + redValue;
                }

                colors[j++] = '#' + redValue + redValue + redValue;
                console.log(redValue);
            }

            res.render('termsdistribution', {
                title: 'Terms Distribution',
                elements: returnObject,
                total_posts: total_posts,
                data: data,
                colors: colors
            });
            break;
    }  
}



var TAXONOMIES = [];
TAXONOMIES[ 'categories' ] = [
    'material',
    'light',
    'architecture',
    'fashion',
    'tech',
    'design',
    'women'
];

TAXONOMIES[ 'terms' ] = [
    'art',
    '3d printing',
    'crowdsourcing',
    'patterns',
    'collaboration',
    '4d printing',
    'youth',
    'aging',
    '1990s',
    'transgenerational',
    'quantified self',
    'context awareness',
    'ubiquitous computing',
    'realtime',
    'social media',
    'peer to peer',
    'prosumer',
    'ownership',
    'identity',
    'big data',
    'analytics',
    'cultural memory',
    'nostalgia',
    'emotion',
    'new americana',
    'authenticity',
    'new aesthetic',
    'digital dualism',
    'augmented reality',
    'maker culture',
    'street culture',
    'network culture',
    'filter failure',
    'content production',
    'storytelling',
    'communication',
    'advertising',
    'gamification',
    'behavior',
    'collaborative consumption',
    'share economy',
    'semantic web',
    'anticipatory computing',
    'indieweb',
    'hypermaterial',
    'reflectivity',
    'material lifespan',
    'wood',
    'glass',
    'invisible design',
    'wearables',
    'embedded devices',
    'motivational objects',
    'performance',
    'sportswear',
    'byod',
    'alternative energy',
    'mobile workforce',
    'object oriented ontology',
    'androgeny',
    'feminism',
    'women in tech',
    'celebrity',
    'gender roles',
    'thought leader',
    'hardware',
    'socialtech',
    '1990s',
    'interface',
    'sharing',
    'cultures',
    'opensource',
    'postdigital'
];

TAXONOMIES['colors'] = [];
TAXONOMIES['colors']['material'] = '#ffb000';
TAXONOMIES['colors']['light'] = '#0FFF00';
TAXONOMIES['colors']['architecture'] = '#ff00ff';
TAXONOMIES['colors']['fashion'] = '#FFFF00';
TAXONOMIES['colors']['tech'] = '#00FFFF';
TAXONOMIES['colors']['design'] = '#FF7F7F';
TAXONOMIES['colors']['women'] = '#aaaaaa';


function returnElements(returnObject, req, res){

    switch(req.params.taxonomy){
        case 'categories':
            res.render('categorieselements', {
                title: 'Categories Elements',
                elements: returnObject
            });
            break;
        case 'terms':
            res.render('termselements', {
                title: 'Terms Elements',
                elements: returnObject
            });
            break;
    }
}


exports.getElementsByTags = function(req, res){
    getElements(req, res, returnElements);
}


function returnElement(returnObject, req, res, total_posts){
    
        var id = parseInt( req.params.id );

        var col = req.params.collection;

        db.collection(col, function(err, collection) {
            collection.find({ id : id }).toArray(function(err, items){
                var post = items[0];

                var post_text = '';
                var post_photos = [];

                switch(post.type){
                    case 'photo':
                        
                        for(var i in post.photos){
                            post_photos.push('<img src="' + post.photos[i].alt_sizes[1].url + '" width="' + post.photos[i].alt_sizes[1].width + 'px" height="' + post.photos[i].alt_sizes[1].height + 'px">');
                        }

                        //strip all media out of caption and insert into post_photos
                        var $caption = $(post.caption);

                        $caption.find('iframe').each(function(i){
                            var outerHTML = getOuterHTML($(this).get(0), true);//fit to 100% width
                            post_photos.push( outerHTML );
                            $(this).remove();
                        });

                        $caption.find('object').each(function(i){
                            var outerHTML = getOuterHTML($(this).get(0), true);//fit to 100% width
                            post_photos.push( outerHTML );
                            $(this).remove();
                        });

                        $caption.find('img').each(function(i){
                            post_photos.push( '<img src="' + $(this).attr('src') + '" width="500px" height="auto">' );
                            $(this).remove();
                        });

                        


                        $caption.each(function(i){
                            if($(this).html() != undefined){
                                if(i == 0){
                                    

                                    post_text = post_text + '<h1 class="bold">' + $(this).text() + '</h1>';
                                    post_text = post_text + '<div id="overlay-post-url"><a href="'+ post.post_url +'" target="_blank">Original post →</a></div><br><br><br>';

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

                                        tags_text.push('</div><br>');

                                        post_text = post_text + tags_text.join('');
                                    }
                                        
                                }else{
                                    post_text = post_text + getOuterHTML($(this).get(0));
                                }
                            }
                        });
                        
                        break;
                    case 'text':
                        break;
                }

                res.render('categorieselementselement', {
                    title: 'Categories',
                    elements: returnObject,
                    total_posts: total_posts,
                    post_text: post_text,
                    post_photos: post_photos,
                    post_url: post.post_url
                });
            });
        });
            
}

exports.getElement = function(req, res){
    getElements(req, res, returnElement);
}


exports.glossaryTerms = function(req, res){
    var col = req.params.collection;

    var terms = [];

    db.collection(col, function(err, collection) {
        collection.find().toArray(function(err, items){
            for(var i = 0; i < items.length; i++){
                for(var j = 0; j < items[i].tags.length; j++){
                    var tag = items[i].tags[j];
                    //don't print out categories
                    if(tag.toLowerCase() != 'material' && 
                        tag.toLowerCase() != 'light' && 
                        tag.toLowerCase() != 'architecture' && 
                        tag.toLowerCase() != 'fashion' && 
                        tag.toLowerCase() != 'tech' && 
                        tag.toLowerCase() != 'design' && 
                        tag.toLowerCase() != 'women'){
                        if(terms[tag] != undefined){
                            terms[ tag ].value++;
                        }else{
                            terms[ tag ] = {
                                tag: tag,
                                value: 1
                            };
                        }
                    }
                }    
            }

            var sorted_terms = [];
            for(var t in terms){
                sorted_terms.push(terms[t]);
            }
            
            sorted_terms.sort(function(a,b) { return b.value - a.value } );
            

            res.render('glossaryterms', {
                    title: 'Glossary',
                    terms: sorted_terms
                });


        });
    });
}



exports.quotes = function(req, res){
    var col = req.params.collection;

    var terms = [];

    db.collection(col, function(err, collection) {
        collection.find().toArray(function(err, items){
            for(var i = 0; i < items.length; i++){
                for(var j = 0; j < items[i].tags.length; j++){
                    var tag = items[i].tags[j];
                    //don't print out categories
                    if(tag.toLowerCase() != 'architecture' && 
                        tag.toLowerCase() != 'fashion' && 
                        tag.toLowerCase() != 'tech' && 
                        tag.toLowerCase() != 'design' && 
                        tag.toLowerCase() != 'women'){
                        if(terms[tag] != undefined){
                            terms[ tag ].value++;
                        }else{
                            terms[ tag ] = {
                                tag: tag,
                                value: 1
                            };
                        }
                    }
                }    
            }

            var sorted_terms = [];
            for(var t in terms){
                sorted_terms.push(terms[t]);
            }
            
            sorted_terms.sort(function(a,b) { return b.value - a.value } );

            terms = [];

            for(var s = 0; s < sorted_terms.length; s++){
                if(sorted_terms[s].value > 7){
                    terms.push(sorted_terms[s]);
                }
            }
            

            res.render('glossaryquotes', {
                    title: 'Glossary',
                    terms: terms
                });
        });
    });
}

exports.quotesQuote = function(req, res){
    var col = req.params.collection;
    var search_term = req.params.term.replace(/-/g," ");

    var terms = [];

    db.collection(col, function(err, collection) {
        collection.find().toArray(function(err, items){
            for(var i = 0; i < items.length; i++){
                for(var j = 0; j < items[i].tags.length; j++){
                    var tag = items[i].tags[j];
                    //don't print out categories
                    if(tag.toLowerCase() != 'architecture' && 
                        tag.toLowerCase() != 'fashion' && 
                        tag.toLowerCase() != 'tech' && 
                        tag.toLowerCase() != 'design' && 
                        tag.toLowerCase() != 'women'){
                        if(terms[tag] != undefined){
                            terms[ tag ].value++;
                        }else{
                            terms[ tag ] = {
                                tag: tag,
                                value: 1
                            };
                        }
                    }
                }    
            }

            var sorted_terms = [];
            for(var t in terms){
                sorted_terms.push(terms[t]);
            }
            
            sorted_terms.sort(function(a,b) { return b.value - a.value } );

            terms = [];

            for(var s = 0; s < sorted_terms.length; s++){
                if(sorted_terms[s].value > 7){
                    terms.push(sorted_terms[s]);
                }
            }

            db.collection(col, function(err, collection) {
                collection.find({ tags: search_term}).toArray(function(err, items){

                    res.render('glossaryquotesquote', {
                        title: 'Glossary',
                        terms: terms,
                        quotes: items
                    });
                });
            });

            

            
        });
    });
}


function processBlockquotes(obj){

    var html;
    var return_array = [];

    switch(obj.type){
        case 'photo':
            html = obj.caption;
            break;
        case 'video':
            html = obj.caption;
            break;
        case 'text':
            html = obj.body;
            break;
        case 'link':
            html = obj.description;
            break;
        case 'quote':
            return_array.push( ent.decode( obj.text ) );
            return return_array;
            break;
        default:
            return null;
            html = '';
            break;
    }

    html = ent.decode( html );

    //console.log('HTML!!!');
    //console.log(html);

    var $html = $(html);

    $html.find('blockquote').each(function(i){
        var text = $(this).text();
        return_array.push( text );

        //console.log('******* found blockquote! '+ i + ' with blockquote: '+ text);
    });

    if(return_array.length > 0){
        return return_array;
    }else{
        return null;
    }

}

function renderFragmentQuotes(returnObject, req, res, number){

    var elements = [];

    for(var tag in returnObject){
        elements[tag] = [];

        for(var i = 0; i < returnObject[tag].length; i++){
            

            var quotes = processBlockquotes( returnObject[tag][i] );

            if(quotes != null){
                for(var j = 0; j < quotes.length; j++){
                    var element = {};
                    element.id = returnObject[tag][i].id;
                    element.post_url = returnObject[tag][i].post_url;
                    element.tags = returnObject[tag][i].tags;
                    element.quote = quotes[j];

                    for(var c = 0; c < TAXONOMIES['categories'].length; c++){
                        if(returnObject[tag][i].tags.indexOf(TAXONOMIES['categories'][c]) > -1){
                            element.category = TAXONOMIES['categories'][c];
                        }
                    }
                    
                    elements[tag].push( element ); 
                }
                
            }
        }
    }

    switch(req.params.taxonomy){
        case 'categories':
            res.render('termsfragmentsquotes', {
                title: 'Categories Quotes',
                elements: elements,
                total_posts: number
            });
            break;
        case 'terms':
            res.render('termsfragmentsquotes', {
                title: 'Terms Quotes',
                elements: elements,
                total_posts: number
            });
            break;
    }
}




function processImages(obj){

    var html;
    var return_array = [];

    switch(obj.type){
        case 'photo':
            for(var p = 0; p < obj.photos.length; p++){
                return_array.push( obj.photos[p].alt_sizes[0].url );
            }
            html = obj.caption;
            break;
        case 'video':
            html = obj.caption;
            break;
        case 'text':
            html = obj.body;
            break;
        case 'link':
            html = obj.description;
            break;
        case 'quote':
            html = obj.source;
            break;
        default:
            return null;
            html = '';
            break;
    }

    html = ent.decode( html );

    //console.log('HTML!!!');
    //console.log(html);

    var $html = $(html);

    $html.find('img').each(function(i){
        var src = $(this).attr('src');
        return_array.push( src );

        //console.log('******* found blockquote! '+ i + ' with blockquote: '+ text);
    });

    if(return_array.length > 0){
        return return_array;
    }else{
        return null;
    }

}

function renderFragmentImages(returnObject, req, res){
    var elements = [];

    for(var tag in returnObject){
        elements[tag] = [];

        for(var i = 0; i < returnObject[tag].length; i++){
            

            var images = processImages( returnObject[tag][i] );

            if(images != null){
                for(var j = 0; j < images.length; j++){
                    var element = {};
                    element.id = returnObject[tag][i].id;
                    element.post_url = returnObject[tag][i].post_url;
                    element.tags = returnObject[tag][i].tags;
                    element.image = images[j];

                    for(var c = 0; c < TAXONOMIES['categories'].length; c++){
                        if(returnObject[tag][i].tags.indexOf(TAXONOMIES['categories'][c]) > -1){
                            element.category = TAXONOMIES['categories'][c];
                        }
                    }
                    
                    elements[tag].push( element ); 
                }
                
            }
        }
    }

    switch(req.params.taxonomy){
        case 'categories':
            res.render('termsfragmentsimages', {
                title: 'Categories Images',
                elements: elements
            });
            break;
        case 'terms':
            res.render('termsfragmentsimages', {
                title: 'Terms Images',
                elements: elements
            });
            break;
    }

}



exports.getFragments = function(req, res){
    var fragment = req.params.fragment || 'quotes';

    switch(fragment){
        case 'quotes':
            console.log('quotes');
            getElements(req, res, renderFragmentQuotes);
            break;
        case 'images':
            console.log('images');
            getElements(req, res, renderFragmentImages);
            break;

        default:
            console.log('default');
            break;
    }
}




































