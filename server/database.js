var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://codedrop.microhex.net:8081/codedropdb';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('SELECT * FROM courses');
query.on('end', function() { client.end(); });
