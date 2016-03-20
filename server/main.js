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


function getCourses(user_id) {
	return "SELECT C.* FROM courses C, register R WHERE C.course_id = R.course_id AND R.user_id = " + user_id;
}
var resBody = "";
var userId = 0;
var workId = 0;
var courses = [];
var assigns = [];

router.get('/courses', function(req, res) {
    db.serialize(function() {
        db.each(getCourses(userId), function(err, row) {
            courses.push(row);
        });

	db.each(getAssignments(userId), function(err, row) {
              assigns.push(row);
        });


   });
	
	for(var i in courses) {
		resBody = resBody.concat("<br>"+courses[i].name+"<ul>");
		for(var j in assigns) {
			if(assigns[j].course_id == courses[i].course_id) {
				resBody = resBody.concat("<li>"+assigns[j].title+"</li>");	
			}
		}
		resBody = resBody.concat("</ul>");

	}
	res.send(resBody);
	
   resBody = "";
   courses = [];
   assigns = [];
  // db.close();

//router.get('
module.exports = router;
