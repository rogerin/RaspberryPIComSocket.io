$(function(){
	'use strict';

	var socket = io.connect('http://192.168.1.101');
	//var socket = io.connect('http://localhost');
	
	socket.on('returnStatus', function (data) {
		var _html = "<tr><td> "+data.evento+"</td><td> "+data.user.id+"</td><td> "+data.log+"</td></tr>";

		$('#log').prepend(_html);
		$('#users').text(data.user.total);
	});

	$(".ligaluz").on('click', function (data) {
		var idLuz = $(this).attr("rel");
		socket.emit('ligaLuz', { luz: idLuz });
	});

	$(".desligaluz").on('click', function (data) {
		var idLuz = $(this).attr("rel");
		socket.emit('desligaLuz', { luz: idLuz });
	});
});