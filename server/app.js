
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
  , fetchtumblr = require('./routes/fetchtumblr');

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
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/posts/:collection', tumblr.posts);
app.get('/fetch/:collection', tumblr.fetchTumblrPosts);
app.get('/info/:collection', tumblr.info);
app.get('/clear/:collection', tumblr.clearDatabase);

//CATEGORIES
app.get('/alchemy/:collection/categories/io', tumblr.categoriesIO);
app.get('/alchemy/:collection/categories/posts', tumblr.categoriesPosts);
app.get('/alchemy/:collection/categories/posts/post/:id', tumblr.categoriesPost);

//GLOSSARY
app.get('/alchemy/:collection/glossary/terms', tumblr.glossaryTerms);
app.get('/alchemy/:collection/glossary/quotes', tumblr.quotes);
app.get('/alchemy/:collection/glossary/quotes/quote/:term', tumblr.quotesQuote);

//FETCH
app.get('/alchemy/:collection/sync', fetchtumblr.sync);
app.get('/alchemy/:collection/download', fetchtumblr.download);

fetchtumblr.clear();


app.get('/', routes.index);
app.get('/projects/yap', routes.projectyap);

app.get('/alchemy', routes.alchemy);

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
