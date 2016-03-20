var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3').verbose();
const fs = require('fs');

var db = new sqlite.Database("codedrop.db");

router.get('/', function(req, res) {
  res.sendFile('public/index.html', {root: __dirname });
});

router.get('/login', function(req, res) {
  res.sendFile('public/login.html', {root: __dirname });
});

router.get('/contact', function(req, res) {
  res.sendFile('public/contact.html', {root: __dirname });
});

router.get('/courses', function(req, res) {
	fs.readFile('public/main.html', function (err, data) {
		if(err) {
			res.send(404);
		}
		else {
		var result = "";
			db.serialize(function() {
				db.each(getCourses(userId), function(err, row) {
					result  = result.concat(JSON.stringify(row) + "<br>");	
				});
			});
			res.send(data + "<br><br>" + result);
		}
	});
			
});

//router.get('
module.exports = router;
