var express = require('express');
var api = require('./api');

var server = express();
server.use(express.static(__dirname + '/public'));

server.use('/api', api);

var port = 8081;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});
