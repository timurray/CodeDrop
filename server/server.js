var express = require('express');
//var api = require('./api');
//var main = require('./main');
var bodyParser = require('body-parser');

var server = express();
server.use(express.static(__dirname + '/public'));
server.use(bodyParser.urlencoded({ extended: true }));

var api = require('./api');
var main = require('./main');

server.use('/api', api);
server.use('/', main);

var port = 8081;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});

