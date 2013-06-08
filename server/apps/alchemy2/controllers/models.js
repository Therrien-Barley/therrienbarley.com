/////// SET UP DATABASE CONNECTION WITH MONGOOSE ///////
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/insights-staging');
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('models.js::opened insights-staging db with mongoose!');
});



var UserSchema = new Schema({
  name:  String,
  username: String,
  role: String,
  password: String,
  email: String,
  created: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now }
}, { 
  autoIndex: false
});

var User = mongoose.model('user', UserSchema);
exports.User = User;


var CollectionSchema = new Schema({
    title: String,
    description: String,
    updated_by: String,
    creator: String,
    sources: {
        type: Array,
        'default': []
    },
    collaborators: {
        type: Array,
        'default': []
    },
    visibility: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, { 
  autoIndex: false
});

var Collection = mongoose.model('collection', CollectionSchema);
exports.Collection = Collection;


var ElementSchema = new Schema({
    source: String,
    source_tag: String,
    collection_id: String,
    type: String,//tumblr, twitter, etc.
    data: Schema.Types.Mixed,
    source_id: String,
    source_timestamp: String,
    fetcher: String,//user who called fetch
    fetched: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, { 
  autoIndex: false
});

var Element = mongoose.model('element', ElementSchema);
exports.Element = Element;




var FragmentSchema = new Schema({
    type: String,
    element: Number,
    tags: [String],
    insight_ids: [Number],
    post_url: String,
    content: String,
    caption: [String],
    order: Number,
    featured: [Boolean],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, { 
  autoIndex: false
});

var Fragment = mongoose.model('fragment', FragmentSchema);
exports.Fragment = Fragment;


var InsightSchema = new Schema({
    title: String,
    tags: [String],
    description: String,
    position: Number,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, { 
  autoIndex: false
});

var Insight = mongoose.model('insight', InsightSchema);
exports.Insight = Insight;