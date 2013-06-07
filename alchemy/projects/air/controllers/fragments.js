var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;

var request = require('request');
var $ = require('jquery');
var ent = require('ent');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('audiinnovationresearch', server, {safe:false});
var col = 'airfragments';

var GET_LIMIT = 600;

db.open(function(err, db) {
	console.log('opening DB audiinnovationresearch');
    if(!err) {
        console.log("Connected to audiinnovationresearch database");
        db.collection(col, {safe:true}, function(err, collection) {
            if (err) {
                console.log("Error trying to open airinsights collection with error: " + err);
            }
        });
    }
});

var SEGMENTS = ['topten', 'toptwenty', 'other'];
var FRAGMENTS = ['quotes', 'images', 'titles'];

exports.get = function(req, res, designator, term){
    var designator = designator || false;
    console.log('fragments.js::get() with designator: '+ designator);

    if(SEGMENTS.indexOf(designator) > -1){
        console.log('req.body.INSIGHT_IDS:');
        console.dir(req.body.insight_ids);

        //get topten, toptwenty, or other
        db.collection(col, function(err, collection) {
            //@todo: sort by insight_id then order?
            collection.find({ 'insight_id': { $in: req.body.insight_ids} }).limit(GET_LIMIT).sort('order').toArray(function(err, items) {
                if (err) {
                    console.log('error: fragments.js::create()');
                    console.log(err);
                    res.send(500, 'Error attempting to get fragment with error message: '+ err);
                } else {
                    console.log('Success: got fragments');
                    console.dir(items);
                    res.json(200, items);
                }
            });
        });

    }else if(designator == 'all' || designator == false){
        //get all projects
        db.collection(col, function(err, collection) {
            collection.find().limit(GET_LIMIT).sort('order').toArray(function(err, items) {
                if (err) {
                    console.log('error: fragments.js::create()');
                    console.log(err);
                    res.send(500, 'Error attempting to get fragment with error message: '+ err);
                } else {
                    console.log('Success: got fragment');
                    res.json(200, items);
                }
            });
        });
    }else if(FRAGMENTS.indexOf(designator) > -1){
        if(designator == 'quotes'){ designator = 'quote'; }
        if(designator == 'images'){ designator = 'image'; }
        if(designator == 'titles'){ designator = 'title'; }
console.log('');
        console.log('**** term: ');
        console.log(term);
        console.log('');

        db.collection(col, function(err, collection) {
            collection.find({ type : designator, tags: term}).limit(GET_LIMIT).sort('order').toArray(function(err, items) {
                if (err) {
                    console.log('error: fragments.js::create()');
                    console.log(err);
                    res.send(500, 'Error attempting to get fragment with error message: '+ err);
                } else {
                    console.dir(items[0]);
                    console.log('Success: got fragment');
                    res.json(200, items);
                }
            });
        });
    }else{
        //get single project by _id
        db.collection(col, function(err, collection) {
            console.log('designator: '+ designator);
            collection.find({'_id': new ObjectID(designator) }).limit(GET_LIMIT).toArray(function(err, items) {
                if (err) {
                    console.log('error: fragments.js::create()');
                    console.log(err);
                    res.send(500, 'Error attempting to get fragment with error message: '+ err);
                } else {
                    console.log('Success: g0t fragment');
                    res.json(200, items[0]);
                }
            });
        });
    }
}



exports.delete = function(req, res, _id){
    console.log('fragments.js::delete()');

    db.collection(col,function(err, collection){
        collection.remove({ '_id': new ObjectID(_id) },function(err, removed){
            if (err) {
                console.log('error: fragments.js::delete()');
                console.log(err);
                res.send(500, 'Error attempting to delete fragment with error message: '+ err);
            } else {
                console.log('Success: deleted fragment');
                res.json(200, removed);
            }
        });
    });
}


exports.update = function(req, res, _id){
    console.log('fragments.js::create() with featured: '+ req.body.featured);

    var fragment = {
        type: req.body.type,
        element: req.body.element,
        tags: req.body.tags,
        category: req.body.category,
        insight_id: req.body.insight_id,
        post_url: req.body.post_url,
        content: req.body.content,
        caption: req.body.caption,
        order: req.body.order,
        featured: req.body.featured
    };

    db.collection(col, function(err, collection) {
        collection.update({'_id': new ObjectID(_id) }, fragment, {safe:true}, function(err) {
            if (err) {
                console.log('error: fragments.js::create()');
                console.log(err);
                res.send(500, 'Error attempting to update fragment with error message: '+ err);
            } else {
                console.log('Success: updated fragment');
                res.json(200);
            }
        });
    });
}







//post request
exports.create = function(req, res){
    var featured;
    console.log('fragments.js::create()');
    if(req.body.featured){
        console.log('featured exists!');
        featured = req.body.featured;
    }else{
        console.log('no featured exists');
        featured = false;
    }

    var fragment = {
        type: req.body.type,
        element: req.body.element,
        tags: req.body.tags,
        category: req.body.category,
        insight_id: req.body.insight_id,
        post_url: req.body.post_url,
        content: req.body.content,
        caption: req.body.caption,
        order: req.body.order,
        featured: featured
    };

    db.collection(col, function(err, collection) {
        collection.insert(fragment, function(err, docs) {
            if (err) {
                console.log('error: fragments.js::create()');
                console.log(err);
                res.send(500, 'Error attempting to create fragment with error message: '+ err);
            } else {
                console.log('Success: created new fragment');
                console.log(docs);
                res.json(200, docs);
            }
        });
    });

}




