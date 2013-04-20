
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