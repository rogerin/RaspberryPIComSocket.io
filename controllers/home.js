module.exports = function(app){

var HomeController = {
	index: function(req,res){
		res.render('index');
	}
}
	return HomeController;
}