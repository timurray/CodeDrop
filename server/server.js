var express = require('express');
 
var server = express();
server.use(express.static(__dirname + '/public'));

server.get('/theotherside', function (req, res) {
  res.send('Hello from the other side!');
});
 
var port = 8081;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});
