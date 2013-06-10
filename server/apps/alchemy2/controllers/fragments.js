var Fragment = require(__dirname + '/models').Fragment;



/////// GLOBALS ///////
var GET_LIMIT = 600;
var SEGMENTS = ['topten', 'toptwenty', 'other'];




//post request
exports.create = function(req, res){
    console.log('fragments.js::create()');
    var fragment = new Fragment({
        type: req.body.type,
        element: parseInt(req.body.element),
        tags: req.body.tags,//should be an array
        insight_ids: req.body.insight_ids,//should be an array
        post_url: req.body.post_url,
        content: req.body.content,
        caption: req.body.caption,
        order: parseInt(req.body.order)
        //dates are set automatically to now
    });

    fragment
        .save(function(err){
            if(err){
                console.log('Error: attempted to save new fragment with msg:'+ err);
                res.send(500, 'Error: attempted to save new fragment with msg:'+ err);
            }else{  
                console.log('Success: created new fragment');
                res.json(200, 'Success: created new fragment');
            }
        });
}


exports.update = function(req, res, _id){
    console.log('fragments.js::update()');

    var timestamp_now = new Date().getTime();

    Fragment
        .update({ 'id': _id }, {
            type: req.body.type,
            element: parseInt(req.body.element),
            tags: req.body.tags,//should be an array
            insight_ids: req.body.insight_ids,//should be an array
            post_url: req.body.post_url,
            content: req.body.content,
            caption: req.body.caption,
            order: parseInt(req.body.order),
            updated: timestamp_now
        }, function(err, user) {
            if(err){
                console.log('error: fragments.js::create() with msg: '+ err);
                res.send(500, 'Error attempting to update fragment with error message: '+ err);
            }else{
                console.log('Success: updated fragment');
                res.json(200);
            }
  });//end Fragment.update()

}//end exports.update()


exports.delete = function(req, res, _id){
    console.log('fragments.js::delete() with _id: '+ _id);

    Fragment
        .findByIdAndRemove({ _id: _id }, function(err){
            if (err) {
                console.log('error: fragments.js::delete() with msg: '+ err);
                res.send(500, 'Error attempting to delete fragment with error message: '+ err);
            } else {
                console.log('Success: deleted fragment');
                res.json(200, removed);
            }
        });
}




//This is necessary because I load all fragments at the beginning of an insights page load
//to save time
exports.get = function(req, res, designator){
    var designator = designator || false;
    console.log('fragments.js::get() with designator: '+ designator);

    if(SEGMENTS.indexOf(designator) > -1){
        console.log('req.body.INSIGHT_IDS:');
        console.dir(req.body.insight_ids);

        //get topten, toptwenty, or other
        Fragment
            .find({ 'insight_id': { $in: req.body.insight_ids} })
            .limit(GET_LIMIT)
            .sort('order')
            .exec(function(err, items) {
                if (err) {
                    console.log('error: fragments.js::create() with msg: '+ err);
                    res.send(500, 'Error attempting to get fragment with error message: '+ err);
                } else {
                    console.log('Success: got '+ items.length + ' fragments');
                    res.json(200, items);
                }
            });

    }else if(designator == 'all' || designator == false){
        //get all projects
        Fragment
            .find()
            .limit(GET_LIMIT)
            .sort('order')
            .exec(function(err, items) {
                if (err) {
                    console.log('error: fragments.js::create() with msg: '+ err);
                    res.send(500, 'Error attempting to get fragment with error message: '+ err);
                } else {
                    console.log('Success: got '+ items.length + ' fragments');
                    res.json(200, items);
                }
            });
    }else{
        //get single fragment by _id
        Fragment
            .findOne({ _id: designator })
            .exec(function(err, item) {
                if (err) {
                    console.log('error: fragments.js::create() with msg: '+ err);
                    res.send(500, 'Error attempting to get a fragment with error message: '+ err);
                } else {
                    console.log('Success: got a fragment');
                    res.json(200, item);
                }
            });
    }
}


















