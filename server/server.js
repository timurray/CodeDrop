var express = require('express');
//var api = require('./api');
//var main = require('./main');
var bodyParser = require('body-parser');
//var api = require('./api');
//var main = require('./main');
//var compile = require('./compilerequest');

var server = express();
server.use(express.static(__dirname + '/public'));
server.use(bodyParser.urlencoded({ extended: true }));

// all new routes go after this line
var api = require('./api');
var main = require('./main');
var compile = require('./compilerequest');

server.use('/api', api);
server.use('/', main);
server.use('/compile',compile);

var port = 8081;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});

