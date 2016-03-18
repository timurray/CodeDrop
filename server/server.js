var express = require('express');
var api = require('./api');
var main = require('./main');

var server = express();
server.use(express.static(__dirname + '/public'));

server.use('/api', api);
server.use('/', main);

var port = 8081;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});
