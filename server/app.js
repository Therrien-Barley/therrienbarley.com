
/**
 * Module dependencies.
 */

var express = require('express')
  , engine = require('ejs-locals')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , tumblr = require('./routes/tumblr')
  , fetchtumblr = require('./routes/fetchtumblr')
  , habitat = require('./routes/habitat');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', engine);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('barleytherrien'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  //set up serving of static files from project directory
  app.use('/projects/air/public', express.static(__dirname + '/projects/air/public'));
  app.use('/projects/air/components', express.static(__dirname + '/projects/air/components'));
  app.use('/projects/air/views/templates', express.static(__dirname + '/projects/air/views/templates'));

  app.use('/projects/new-habitat/public', express.static(__dirname + '/projects/new-habitat/public'));
  app.use('/projects/new-habitat/components', express.static(__dirname + '/projects/new-habitat/components'));
  app.use('/projects/new-habitat/views/templates', express.static(__dirname + '/projects/new-habitat/views/templates'));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/posts/:collection', tumblr.posts);
app.get('/fetch/:collection', tumblr.fetchTumblrPosts);
app.get('/info/:collection', tumblr.info);
app.get('/clear/:collection', tumblr.clearDatabase);

//ALL
app.get('/alchemy/:collection/:taxonomy/distribution', tumblr.getElementsDistributionByTags);
app.get('/alchemy/:collection/:taxonomy/elements', tumblr.getElementsByTags);
app.get('/alchemy/:collection/:taxonomy/elements/element/:id', tumblr.getElement);

app.get('/alchemy/:collection/:taxonomy/fragments/:fragment/:tag', tumblr.getFragments);



//GLOSSARY
app.get('/alchemy/:collection/terms/all', tumblr.glossaryTerms);
app.get('/alchemy/:collection/glossary/quotes', tumblr.quotes);
app.get('/alchemy/:collection/glossary/quotes/quote/:term', tumblr.quotesQuote);

//FETCH
app.get('/alchemy/:collection/sync', fetchtumblr.sync);
app.get('/alchemy/:collection/download', fetchtumblr.download);


//A.I.R. 2.0
app.get('/insights*', routes.route);



app.get('/', routes.route);
app.post('/api*', routes.route);

app.get('/projects/yap', routes.projectyap);

app.get('/alchemy', routes.alchemy);

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
