var Fragment = require(__dirname + '/models').Fragment;



/////// GLOBALS ///////
var GET_LIMIT = 600;
var SEGMENTS = ['topten', 'toptwenty', 'other'];




//post request
exports.create = function(req, res){
    console.log('fragments.js::create()');
    var fragment = new Fragment({
        type: req.body.type,
        content: req.body.content,
        element_id: req.body.element,
        post_url: req.body.post_url,
        annotation: req.body.annotation,
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
            insight_ids: req.body.insight_ids,//should be an array
            annotation: req.body.annotation,
            order: parseInt(req.body.order),
            caption: req.body.caption,
            featured: req.body.featured,
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
exports.get = function(req, res, designator, _id){
    console.log('fragments.js::get() with designator: '+ designator + ' and _id: '+ _id);

    switch(designator){
        case 'fragment_id':
            Fragment
                .findById(_id, function(err, item) {
                    if (err) {
                        res.send(500, 'Error attempting to get fragment by fragment_id with error message: '+ err);
                    } else {
                        console.log('Success: got fragment');
                        res.json(200, item);
                    }
                });
            break;
        case 'element_id':
            Fragment
                .find({ 'element_id': element_id })
                .sort('order')
                .exec(function(err, items){
                    if (err) {
                        console.log('error: fragments.js::get() by element_id with msg: '+ err);
                        res.send(500, 'Error attempting to get fragment by element_id with error message: '+ err);
                    } else {
                        console.log('Success: got '+ items.length + ' fragments');
                        res.json(200, items);
                    }
                });
            break;
    }
}


















