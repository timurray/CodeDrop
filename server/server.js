var express = require('express');
var bodyParser = require('body-parser');

var server = express();
server.use('/favicon.ico',./favicon.ico);
server.use("/public", express.static(__dirname + '/public'));
server.use(bodyParser.urlencoded({ extended: true }));

// all new routes go after this line
var api = require('./api');
var main = require('./main');
var compile = require('./compilerequest');

server.use('/api', api);
server.use('/', main);
server.use('/compile',compile.route);

var port = 8081;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});

