var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3').verbose();
const fs = require('fs');

var http = require('http');
var client = http.createClient(80,'codedrop.microhex.net/api/get_courses');

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


function getCourses(user_id) {
	return "SELECT C.* FROM courses C, register R WHERE C.course_id = R.course_id AND R.user_id = " + user_id;
}

router.get('/courses', function(req, res) {

	fs.readFile('public/main.html', function (err, data) {
		if(err) {
			res.send(404);
		}
		else {
			var request = client.request();
			request.on('response', function(res) { 
				res.on('data', function(dat) {
					data = data + dat.toString();
				});
			});
			res.send(data);
		}
	});
	
	
});

//router.get('
module.exports = router;
