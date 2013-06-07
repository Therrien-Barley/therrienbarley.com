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

var GET_LIMIT = 40;

db.open(function(err, db) {
	if(!err) {
      console.log('opening DB insights in collections.js');
  }else{
    console.log('ERROR: cannot open db insights in collections.js with error: ' + err);
  }
});

exports.get = function(req, res){
    console.log('collections.js::get(id) with id: '+req.query._id+' and req.user.username: '+req.user.username);
    var id = null;
    if(typeof req.query._id !== 'undefined'){
        console.log('********* NOT NULL********');
        id = req.query._id;
    }

    if(id == null){//get all collections for the user
        console.log('apparently, id == null');

        if(req.user.collections){
            if(req.user.role == 'admin'){//get all collections
                db.collection(col, function(err, collection) {
                    collection.find().limit(GET_LIMIT).sort('updated').toArray(function(err, items) {
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
            }else{//not admin
                console.log('return all collections for NON ADMIN');
                db.collection(col, function(err, collection) {
                    collection.find({$or: [{ creator: req.user.id }, { "collaborators.id": req.user.id }]}).limit(GET_LIMIT).sort('title').toArray(function(err, items) {
                        if (err) {
                            console.log('error: collections.js::get() in user collections');
                            console.log(err);
                            res.send(500, 'Error: attempting to get user collections with message: '+ err);
                        } else {
                            console.log('Success: got user collections, totalling: '+items.length);
                            res.json(200, items);
                        }
                    });
                });
            }
        }else{//user has no collections
            res.json(404, null);
        }
    }else{
        console.log('collections.js::get() with an id');
        if(req.user.collections){
            if(req.user.role == 'admin'){//get all collections
                console.log('user has all, so make it happen');
                db.collection(col, function(err, collection) {
                    collection.findOne({ '_id': new ObjectID(id) }, function(err, collect) {
                        if (err) {
                            console.log('error: collections.js::get()');
                            console.log(err);
                            res.send(500, 'Error: attempting to get a collections with message: '+ err);
                        } else {
                            console.log('Success: got the collection');
                            res.json(200, collect);
                        }
                    });
                });
            }
        }else{
            res.json(404, 'Error: req.user.collections not present');
        }

    }
}//end get


exports.getElements = function(req, res){
    console.log('collections.js::getElements() from collection with _id: '+req.query._id+' and req.user.username: '+req.user.username);
    var _id = null;
    if(typeof req.query._id !== 'undefined'){
        console.log('********* NOT NULL********');
        _id = req.query._id;
    }

    if(_id != null){//get all collections for the user
        console.log('apparently, _id != null');


        db.collection(col, function(err, collection) {
            collection.findOne({ '_id': new ObjectID(_id) }, function(err, collect) {
                var flag = false;
                if( req.user.role != 'admin' ){
                    for(var i = 0; i < collect.collaborators.length; i++){
                        if(collect.collaborators[i].id == req.user.id){
                            flag = true;
                            break;
                        }
                    }
                }
                if( (req.user.role == 'admin') || flag == true){
                    db.collection( collect.database_collection, function(err, collection_two){
                        collection_two.find().limit(GET_LIMIT).sort({'timestamp': -1}).toArray(function(err, elements){
                            res.json(200, elements);
                        });
                    });
                }else{
                    res.send(404, 'Error, you dont have permission for this collection');
                }
            });

        });
    }else{
        res.send(404, 'Error, no _id for getElements()');
    }
}//end getElements



exports.delete = function(req, res, _id){
    console.log('collections.js::delete()');

    db.collection(col,function(err, collection){
        collection.remove({ '_id': new ObjectID(_id) },function(err, removed){
            if (err) {
                console.log('error: collections.js::delete()');
                console.log(err);
                res.send(500, 'Error attempting to delete collection with error message: '+ err);
            } else {
                console.log('Success: deleted collection');
                res.json(200, removed);
            }
        });
    });
}


exports.update = function(req, res, _id){
    console.log('collections.js::update()');
    var timestamp = new Date().getTime();

    var updated_collection = {
        type: 'collection',
        title: req.body.title,
        description: req.body.description,
        updated_by: req.user.id,
        updated: timestamp,
        editors: req.body.editors,
        viewers: req.body.viewers,
        sources: req.body.sources,
        collaborators: req.body.collaborators
    };

    db.collection(col, function(err, collection) {
        collection.update({'_id': new ObjectID(_id) }, updated_collection, {safe:true}, function(err) {
            if (err) {
                console.log('error: collections.js::update()');
                console.log(err);
                res.send(500, 'Error attempting to update collection with error message: '+ err);
            } else {
                console.log('Success: updated collection');
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
        description: req.body.description,
        creator: req.user.id,
        created: timestamp,
        updated_by: req.user.id,
        updated: timestamp,
        status: 'private',
        editors: [],
        viewers: [],
        sources: [],
        collaborators: [],
        database_collection: req.body.title+Math.floor(Math.random()*10000)
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
