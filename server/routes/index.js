
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log('getting index!!!!!!!!');

  if(req.headers.host.indexOf('new-habit.at') >= 0){
    res.render('habitatindex', { title: 'New Habitat' });
  }else{
    res.render('index', { title: 'Therrien–Barley' });
  }
  
};


exports.projectyap = function(req, res){
  res.render('projectyap', { 
  	title: 'Young Architects Program Review',
  	category: 'Curating',
  	tags: 'tag1 tag2 tag3',
  	year: '2009',
  	month: '11',
  	day: '30',
  	published: true,
  	summary: 'The exhibition celebrated the legacy of architectural invention fueled by the exuberance of generations of young architects who took part in P.S.1  Contemporary Art Center and The Museum of Modern Art’s Young Architects Program, one of the most acclaimed architectural arenas for emerging talent of the last decade.', 
  	monoimage: 'yap_blue.png',
  	slug: 'yap'
  });
};

exports.alchemy = function(req, res){
  console.log('getting alchemy');
  res.render('alchemy', { 
    title: 'Alchemy | Therrien–Barley'
  });
};



var insightairrouter = require('../projects/air/routes/router');
var newhabitatrouter = require('../projects/new-habitat/routes/router');




exports.put = function(req, res){
  var url_array = req.url.split('/');
  switch(req.headers.host){
    case 'therrienbarley.com':
      break;
    case 'new-habit.at':
      console.log('routing for new-habit.at');
      newhabitatrouter.newhabitatput(req, res);
      break;
    default:
      res.send(501, 'This IP does not serve the host domain');//501 = not implemented
      break;
  }
}


exports.post = function(req, res){
  var url_array = req.url.split('/');
  switch(req.headers.host){
    case 'therrienbarley.com':
      break;
    case 'new-habit.at':
      console.log('routing for new-habit.at');
      newhabitatrouter.newhabitatpost(req, res);
      break;
    default:
      res.send(501, 'This IP does not serve the host domain');//501 = not implemented
      break;
  }

}

exports.get = function(req, res){
  var url_array = req.url.split('/');
  switch(req.headers.host){
    case 'therrienbarley.com':
      switch(url_array[1]){
        case 'insights':
          switch(url_array[2]){
            case 'air':
              insightairrouter.insightairroute(req, res);
              break;
            default:
              res.send(501, 'This IP does not serve the host domain');//501 = not implemented
              break;
          }
          break;
        case 'alchemy':
          res.render('index', { title: 'Therrien–Barley' });
          break;
        default:
          break;
      }
      break;
    case 'new-habit.at':
      console.log('routing for new-habit.at');
      newhabitatrouter.newhabitatget(req, res);
      break;
    default:
      res.send(501, 'This IP does not serve the host domain');//501 = not implemented
      break;
  }
};











