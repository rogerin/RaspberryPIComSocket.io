(function startServer(){

	var express = require('express');
var load = require('express-load');
var http = require('http');
//var gpio = require("pi-gpio");

var app = express();
var port = Number(process.env.PORT || 5000);
//alterado
var server = app.listen(3000, function(){
  console.log('Iniciando na porta: ' + port +' ');
});
var io = require('socket.io').listen(server);

// all environments
app.set('views', __dirname + '/views'); 
app.set('view engine', 'jade');
app.use(app.router);
app.use(express.static(__dirname+'/public')); 

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

load('models').then('controllers').then('routes').into(app);

var eventos = 0;
var conexoes = 0;

function ativaPin(pin,acao) {
	gpio.open(pin, "output", function(err) {    
	    gpio.write(pin, acao, function() {          
	        gpio.close(pin);                     
	    });
	});

}

function lerPin(pin) {
	gpio.read(pin, function(err, value) {
    	if(err) throw err;
    	return value;
	});
}


io.sockets.on('connection', function (socket) {

	 var i = 0;
	  setInterval(function() {
	    socket.emit('news', {
	      message: i++
	    });
	  }, 1000);

	//console.log(socket.handshaken);
	++conexoes;
  	++eventos;
  	console.log("Conexoes: " + conexoes);
  	
	io.sockets.emit('returnStatus', { 
										evento: eventos, 
										user: {
											id: socket.id,
											total: conexoes
										}, 
										log: 'total de ' + conexoes +' usuarios conectados' 
									});  


	socket.on('ligaLuz', function(data){
		++eventos;

		// setar pin HIGH
		ativaPin(data.luz, 1);
		//console.log("Luz: " + data.luz);
		io.sockets.emit('returnStatus', { 
											evento: eventos, 
											user: {
												id: socket.id,
												total: conexoes
											}, 
											log: 'Luz '+data.luz+' ligada' 
										});
	});
	
	socket.on('desligaLuz', function(data){
		++eventos;

		// setar pin LOW
		ativaPin(data.luz, 0);
		//console.log("Luz: " + data.luz);
		io.sockets.emit('returnStatus', { 
											evento: eventos, 
											user: {
												id: socket.id,
												total: conexoes
											}, 
											log: 'Luz '+data.luz+' desligada' 
										}); 
	});


	socket.on('disconnect', function () {
		--conexoes;
		console.log("Caiu: " + conexoes);
		//++eventos;
		/*io.sockets.emit('returnStatus', { 
											evento: eventos, 
											user: {
												id: socket.id,
												total: conexoes
											}, 
											log: 'total de ' + conexoes +' usuarios conectados' 
										});*/
	});


});


})();
