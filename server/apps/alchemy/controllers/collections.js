var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;

var request = require('request');
var $ = require('jquery');
var ent = require('ent');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('insights', server, {safe:false});
var col = 'collections';

var GET_LIMIT = 100;

db.open(function(err, db) {
	if(!err) {
      console.log('opening DB insights in collections.js');
  }else{
    console.log('ERROR: cannot open db insights in collections.js with error: ' + err);
  }
});

exports.get = function(req, res, id){
    console.log('collections.js::get(id) with id: '+id+' and req.user.username: '+req.user.username);

    id = id || null;

    if(id == null){//get all collections for the user

        if(req.user.collections){
            if(req.user.collections.indexOf('all') >= 0){//get all collections
                db.collection(col, function(err, collection) {
                    collection.find().limit(GET_LIMIT).sort('title').toArray(function(err, items) {
                        if (err) {
                            console.log('error: collections.js::get() all');
                            console.log(err);
                            res.send(500, 'Error: attempting to get all collections with message: '+ err);
                        } else {
                            console.log('Success: got all collections');
                            res.json(200, items);
                        }
                    });
                });
            }else{
                db.collection(col, function(err, collection) {
                    collection.find({ title: { $in: req.user.collections } }).limit(GET_LIMIT).sort('title').toArray(function(err, items) {
                        if (err) {
                            console.log('error: collections.js::get() in user collections');
                            console.log(err);
                            res.send(500, 'Error: attempting to get user collections with message: '+ err);
                        } else {
                            console.log('Success: got user collections');
                            res.json(200, items);
                        }
                    });
                });
            }
        }else{//user has no collections
            res.json(404, null);
        }
    }
}//end get



exports.delete = function(req, res, _id){
    console.log('insights.js::delete()');

    db.collection(col,function(err, collection){
        collection.remove({ '_id': new ObjectID(_id) },function(err, removed){
            if (err) {
                console.log('error: insights.js::delete()');
                console.log(err);
                res.send(500, 'Error attempting to delete insight with error message: '+ err);
            } else {
                console.log('Success: deleted insight');
                res.json(200, removed);
            }
        });
    });
}


exports.update = function(req, res, _id){
    console.log('insights.js::create()');

    var insight = {
        type: 'insight',
        title: req.body.title,
        categories: req.body.categories,
        description: req.body.description,
        questions: req.body.questions,
        fragments: req.body.fragments,
        section: req.body.section,
        position: req.body.position
    };

    db.collection(col, function(err, collection) {
        collection.update({'_id': new ObjectID(_id) }, insight, {safe:true}, function(err) {
            if (err) {
                console.log('error: insights.js::create()');
                console.log(err);
                res.send(500, 'Error attempting to update insight with error message: '+ err);
            } else {
                console.log('Success: updated insight');
                res.json(200);
            }
        });
    });
}





//post request
exports.create = function(req, res){
    console.log('collections.js::create()');

    var timestamp = new Date().getTime();
    console.log('time: '+ timestamp);


    var new_collection = {
        type: 'collection',
        title: req.body.title,
        creator: req.user.id,
        created: timestamp,
        status: 'private'
    };

    console.dir(new_collection);
    console.log(col);

    db.collection(col, function(err, collection) {
        collection.insert(new_collection, function(err, docs) {
            if (err) {
                console.log('error: collections.js::create()');
                console.log(err);
                res.send(500, 'Error attempting to create collection with error message: '+ err);
            } else {
                console.log('Success: created new collection');
                console.log(docs);
                res.json(200, docs[0]);
            }
        });
    });

}
