function testOne() {
  var socket = require('socket.io-client')('http://localhost:3000', {forceNew: true});
  socket.on('connect', function(){
    socket.on('news', function(data){
      console.log(data.message);
    });
  });
}

for (var i = 0; i < 1000; i++) {
  testOne();
}