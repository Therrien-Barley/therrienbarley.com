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
var col = 'users';

var GET_LIMIT = 100;

db.open(function(err, db) {
	if(!err) {
      console.log('opening DB insights in users.js');
  }else{
    console.log('ERROR: cannot open db insights in users.js with error: ' + err);
  }
});

exports.get = function(req, res, id){
    console.log('users.js::get(id) with id: '+id+' and req.user.username: '+req.user.username);


    id = id || null;

    if(id == null){//get all users
        if(req.user){
            if(req.user.role == 'admin'){
                db.collection(col, function(err, collection) {
                    collection.find().limit(GET_LIMIT).sort('id').toArray(function(err, items) {
                        if (err) {
                            console.log('error: users.js::get()');
                            console.log(err);
                            res.send(500, 'Error: attempting to get all users with message: '+ err);
                        } else {
                            console.log('Success: got all users');
                            res.json(200, items);
                        }
                    });
                });
            }else{
                res.send(404, "Forbidden: you are not admin users.js");
            }
        }else{
            res.send(404, "Forbidden: no req.user users.js");
        }
    }else{
        if(id == 'self'){
            id = req.user.id;
        }
        db.collection(col, function(err, collection) {
            collection.findOne({ id: id }, function(err, user) {
                if (err) {
                    console.log('error: users.js::get()');
                    console.log(err);
                    res.send(500, 'Error: attempting to get one users with message: '+ err);
                } else {
                    console.log('Success: got one user');
                    res.json(200, user);
                }
            });
        });
    }
}//end get



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


exports.update = function(req, res, id){
    console.log('collections.js::update()');
    var timestamp = new Date().getTime();

    if(req.user){
        var updated_user = {
            username: req.body.username,
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            created: timestamp,
            updated: timestamp,
            collections: req.body.collections
        };

        db.collection(col, function(err, collection) {
            collection.update({'id': req.user.id }, updated_user, {safe:true}, function(err) {
                if (err) {
                    console.log('error: users.js::update()');
                    console.log(err);
                    res.send(500, 'Error attempting to update user with error message: '+ err);
                } else {
                    console.log('Success: updated users');
                    res.send(200);
                }
            });
        });
    }else{
        res.send(400, 'No permissions, req.user doesnt exist');
    }   
}





//post request
exports.create = function(req, res){
    console.log('collections.js::create()');

    //only admins can create other users
    if(req.user){
        if(req.user.role == 'admin'){

            var timestamp = new Date().getTime();
            console.log('time: '+ timestamp);

            db.collection(col, function(err, collection) {
                collection.count(function(err, count) {
                    if(err){
                        console.log("ERROR: in counting number of objects in users collection in users.js::create() with msg: "+ err);
                        res.send(500, "ERROR: in counting number of objects in users collection in users.js::create() with msg: "+ err);
                    }else{
                        var id = count + 1;
                        console.log('adding new user with id: '+ id);
                        var new_user = {
                            id: id,
                            username: req.body.username,
                            name: req.body.name,
                            password: req.body.password,
                            email: req.body.email,
                            role: 'user',
                            created: timestamp,
                            updated: timestamp,
                            collections: []
                        };

                        collection.insert(new_user, function(err, docs) {
                            if (err) {
                                console.log('error: users.js::create()');
                                console.log(err);
                                res.send(500, 'Error attempting to create user with error message: '+ err);
                            } else {
                                console.log('Success: created new user with id: '+ id);
                                console.log(docs);
                                res.json(200, docs[0]);
                            }
                        });

                    }
                });
            });
        }else{
            res.send(400, 'Error: cant create user, not admin role');
        }
    }else{
        res.send(400, 'Error: cant create user, no permissions: req.user doesnt exist');
    }   

                

}
