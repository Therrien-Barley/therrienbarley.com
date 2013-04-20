
/*
 * GET home page.
 */

exports.habitatindex = function(req, res){
  console.log('getting Habitat index!!!!!!!!');

  console.log('req headers:');
  console.log(req.headers);

  if(req.headers.host.indexOf('new-habit.at') >= 0){
  	res.render('habitatindex', { title: 'New Habitat' });
  }

  
};
