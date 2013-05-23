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
var col = 'airinsights';

var GET_LIMIT = 100;

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


var SECTIONS = ['topten', 'toptwenty', 'other'];

exports.get = function(req, res, _id){
    var _id = _id || false;
    console.log('insights.js::get() with _id: '+ _id);

    if(_id == false){
        //get all projects
        db.collection(col, function(err, collection) {
            collection.find({'type': 'insight' }).limit(GET_LIMIT).sort({'position': -1}).toArray(function(err, items) {
                if (err) {
                    console.log('error: insights.js::create()');
                    console.log(err);
                    res.send(500, 'Error attempting to get insight with error message: '+ err);
                } else {
                    console.log('Success: got insight');
                    console.log(items);
                    res.json(200, items);
                }
            });
        });
    }else{
        //is one of the sections
        if(SECTIONS.indexOf(_id) > -1){
            var limit, offset;

            switch(_id){
                case 'topten':
                    limit = 10;
                    offset = 0;
                    break;
                case 'toptwenty':
                    limit = 10;
                    offset = 10;
                    break;
                case 'other':
                    limit = 500;
                    offset = 20;
                    break;
                default:
                    limit = 0;
                    offset = 0;
                    break;
            }
            //get single project by _id
            db.collection(col, function(err, collection) {
                collection.find().limit(limit).skip(offset).sort({'position': -1}).toArray(function(err, items) {
                    if (err) {
                        console.log('error: insights.js::create()');
                        console.log(err);
                        res.send(500, 'Error attempting to get insight with error message: '+ err);
                    } else {
                        console.log('Success: g0t insight');
                        console.log(items);
                        res.json(200, items);
                    }
                });
            });
        }else{//is an _id
            //get single project by _id
            db.collection(col, function(err, collection) {
                collection.find({'_id': new ObjectID(_id) }).limit(GET_LIMIT).sort({'position': -1}).toArray(function(err, items) {
                    if (err) {
                        console.log('error: insights.js::create()');
                        console.log(err);
                        res.send(500, 'Error attempting to get insight with error message: '+ err);
                    } else {
                        console.log('Success: g0t insight');
                        console.log(items);
                        res.json(200, items[0]);
                    }
                });
            });
        }    
    }
}



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
    var insight = {
        type: 'insight',
        title: req.body.title,
        categories: req.body.categories,
        description: req.body.description,
        questions: req.body.questions,
        fragments: [],
        section: req.body.section
    };

    db.collection(col, function(err, collection) {
        collection.count(function(err, count) {
            insight.position = parseInt(count)+1;

            collection.insert(insight, function(err, docs) {
                if (err) {
                    console.log('error: insights.js::create()');
                    console.log(err);
                    res.send(500, 'Error attempting to create insight with error message: '+ err);
                } else {
                    console.log('Success: created new insight');
                    console.log(docs);
                    res.json(200, docs[0]);
                }
            });
        });  
    });
}
