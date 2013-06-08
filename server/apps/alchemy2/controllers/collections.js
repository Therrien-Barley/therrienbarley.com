var tumblr = require(__dirname + '/fetchtumblr');
var Collection = require(__dirname + '/models').Collection;






/////// GLOBALS ///////
var GET_LIMIT = 40;






//post request
exports.create = function(req, res){
    console.log('collections.js::create()');

    console.log('collaborators: ');
    console.dir(req.body.collaborators);

    var new_collection = new Collection({
        title: req.body.title,
        description: req.body.description,
        creator: req.user.id,
        updated_by: req.user.id,
        visibility: 'private',
        collaborators: req.body.collaborators,
        database_collection_name: req.body.title+'_'+Math.floor(Math.random()*100000)
    });

    for(var i = 0; i < req.body.sources.length; i++){
        new_collection.sources.addToSet(req.body.sources[i]);
    }

    new_collection
        .save(function(err){
            if(err){
                console.log('Error: attempted to save new collection with msg:'+ err);
                res.send(500, 'Error: attempted to save new collection with msg:'+ err);
            }else{  
                console.log('Success: created new collection');
                res.json(200, 'Success: created new collection');
            }
        });
}


exports.update = function(req, res, _id){
    console.log('collections.js::update() with _id: '+ _id);
    var timestamp_now = new Date().getTime();

    console.log('collaborators: ');
    console.dir(req.body.collaborators);


    Collection
        .findById(_id, function(err, doc){
            doc.title = req.body.title;
            doc.description = req.body.description;
            doc.updated_by = req.user.id;
            doc.visibility = req.body.visibility;
            doc.updated = timestamp_now;

            for(var i = doc.sources.length-1; i >= 0; i--){
                doc.sources.splice(i, 1);
            }

            for(var i = 0; i < req.body.sources.length; i++){
                doc.sources.addToSet(req.body.sources[i]);
            }

            for(var i = doc.collaborators.length-1; i >= 0; i--){
                doc.collaborators.splice(i, 1);
            }

            for(var i = 0; i < req.body.collaborators.length; i++){
                doc.collaborators.addToSet(req.body.collaborators[i]);
            }


            

            doc.save(function(err){
                if(err){
                    console.log('error: collections.js::create() with msg: '+ err);
                    res.send(500, 'Error attempting to update collection with error message: '+ err);
                }else{
                    console.log('Success: updated collection');
                    res.json(200);
                }
            });
        });

/*
    Collection
        .update({ 'id': _id }, {
            title: req.body.title,
            description: req.body.description,
            updated_by: req.user.id,
            sources: req.body.sources,
            collaborators: req.body.collaborators,
            visibility: req.body.visibility,
            updated: timestamp_now
        }, function(err, user) {
            if(err){
                console.log('error: collections.js::create() with msg: '+ err);
                res.send(500, 'Error attempting to update collection with error message: '+ err);
            }else{
                console.log('Success: updated collection');
                res.json(200);
            }
    });//end Collection.update()*/

}

exports.delete = function(req, res, _id){
    console.log('collections.js::delete()');

    Collection
        .findByIdAndRemove(_id, function(err){
            if (err) {
                console.log('error: collections.js::delete() with msg: '+ err);
                res.send(500, 'Error attempting to delete collection with error message: '+ err);
            } else {
                console.log('Success: deleted collection');
                res.json(200);
            }
        });
}









exports.get = function(req, res){
    console.log('collections.js::get(id) with id: '+req.query._id+' and req.user.username: '+req.user.username);
    var id = null;
    if(typeof req.query._id !== 'undefined'){
        id = req.query._id;
    }

    if(id == null){//get all collections for the user
        console.log('apparently, id == null');

        if(req.user.role == 'admin'){//get all collections

            Collection
                .find()
                .limit(GET_LIMIT)
                .sort('updated')
                .exec(function(err, items) {
                    if (err) {
                        console.log('error: collections.js::get() all with msg: '+ err);
                        res.send(500, 'Error: attempting to get all collections with message: '+ err);
                    } else {
                        console.log('Success: got all collections');
                        res.json(200, items);
                    }
                });

        }else{//not admin
            console.log('return all collections for NON ADMIN');

            Collection
                .find({$or: [{ creator: req.user.id }, { "collaborators.id": req.user.id }]})
                .limit(GET_LIMIT)
                .sort('updated')
                .exec(function(err, items) {
                    if (err) {
                        console.log('error: collections.js::get() all with msg: '+ err);
                        res.send(500, 'Error: attempting to get all collections with message: '+ err);
                    } else {
                        console.log('Success: got all collections');
                        res.json(200, items);
                    }
                });

        }
        
    }else{
        console.log('collections.js::get() with an id');
        if(req.user.role == 'admin'){//get all collections
            console.log('user has all, so make it happen');

            Collection
                .findOne({ _id: id })
                .exec(function(err, item) {
                    if (err) {
                        console.log('error: collections.js::get() all with msg: '+ err);
                        res.send(500, 'Error: attempting to get all collections with message: '+ err);
                    } else {
                        console.log('Success: got all collections');
                        res.json(200, item);
                    }
                });

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

        Collection
            .findOne({ _id: _id })
            .exec(function(err, collect) {
                var flag = false;
                //check for permissions
                if( req.user.role != 'admin' ){
                    for(var i = 0; i < collect.collaborators.length; i++){
                        if(collect.collaborators[i].id == req.user.id){
                            flag = true;
                            break;
                        }
                    }
                }
                if( (req.user.role == 'admin') || flag == true){

                    for(var i = 0; i < collect.sources.length; i++){
                        //type, source, tag
                        switch(collect.sources[i].type){
                            case 'tumblr':
                                console.log('fetching from tumblr host: '+ collect.sources[i].source+' with tag: '+ collect.sources[i].tag);
                                tumblr.getElements(req, res, collect.id);
                                break;
                        }
                    }//end for

                }else{
                    res.send(404, 'Error, you dont have permission for this collection');
                }
            });
        
    }else{
        res.send(404, 'Error, no _id for getElements()');
    }
}//end getElements


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// SYNCING /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.sync = function(req, res){
    var _id = '51b33d266e80adbc55000001';

    Collection
        .findOne({ _id: _id })
        .exec(function(err, collect) {
            var flag = false;
            //check for permissions
            if( req.user.role != 'admin' ){
                for(var i = 0; i < collect.collaborators.length; i++){
                    if(collect.collaborators[i].id == req.user.id){
                        flag = true;
                        break;
                    }
                }
            }
            if( (req.user.role == 'admin') || flag == true){

                console.log('collect.sources: ');
                console.dir(collect.sources);

                for(var i = 0; i < collect.sources.length; i++){
                    console.log('source: '+ i);
                    console.dir(collect.sources[i]);
                    //type, source, tag
                    switch(collect.sources[i].type){
                        case 'tumblr':
                            console.log('fetching from tumblr host: '+ collect.sources[i].source+' with tag: '+ collect.sources[i].tag);
                            tumblr.fetch(collect.sources[i].source, collect.sources[i].tag, 20, 0, req, res, _id);
                            break;
                    }
                }

            }else{
                res.send(404, 'Error, you dont have permission to sync this collection');
            }
        });

}

exports.download = function(req, res){
    var _id = '51b33d266e80adbc55000001';

    Collection
        .findOne({ _id: _id })
        .exec(function(err, collect) {
            var flag = false;
            //check for permissions
            if( req.user.role != 'admin' ){
                for(var i = 0; i < collect.collaborators.length; i++){
                    if(collect.collaborators[i].id == req.user.id){
                        flag = true;
                        break;
                    }
                }
            }
            if( (req.user.role == 'admin') || flag == true){

                for(var i = 0; i < collect.sources.length; i++){
                    //type, source, tag
                    switch(collect.sources[i].type){
                        case 'tumblr':
                            console.log('downloading tumblr posts');
                            tumblr.download(req, res, collect.id);
                            break;
                    }
                }

            }else{
                res.send(404, 'Error, you dont have permission to sync this collection');
            }
        });
}




