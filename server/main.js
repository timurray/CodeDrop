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

router.get('/edit', function(req, res) {
	res.sendFile('public/asignedit.html', {root: __dirname });
});

router.get('/soln', function(req, res) {
	res.sendFile('public/stucode.html', {root: __dirname });
});


function getAssignments(user_id) {
	return "SELECT W.* FROM work W, register R WHERE W.course_id = R.course_id AND R.user_id = " + user_id;
}

function getCourses(user_id) {
	return "SELECT C.* FROM courses C, register R WHERE C.course_id = R.course_id AND R.user_id = " + user_id;
}

function getRegister(user_id) {
	return "SELECT R.* FROM register R WHERE R.user_id = " + user_id;
}

var resBody = "";
var userId = 0;
var workId = 0;
var courses = [];
var assigns = [];
var register = [];

router.get('/submissions', function(req, res) {
	resBody.concat("<ul>");
	db.serialize( function() {
		db.each("SELECT S.name FROM users S, register R WHERE R.user_id = S.user_id AND R.role = 0 AND R.course_id = " + req.query.id, function(err, row) {
			resBody = resBody.concat("<li>"+JSON.stringify(row)+"</li>");
		}
	}
	res.send(resBody);
	resBody ="";
});

router.get('/courses', function(req, res) {
    db.serialize(function() {
        db.each(getCourses(userId), function(err, row) {
            courses.push(row);
        });

		db.each(getAssignments(userId), function(err, row) {
			assigns.push(row);
		});
	
		db.each(getRegister(userId), function(err, row) {
			register.push(row);
		});
	
   });
	
	for(var r in register) {
		if(register[r].user_id == userId) {
			for(var i in courses) {
				if(register[r].course_id== courses[i].course_id) {
					resBody = resBody.concat("<br>"+courses[i].name+"<ul>");
		
					for(var j in assigns) {
						if(courses[i].course_id == assigns[j].course_id) {
				
							resBody = resBody.concat("<li>"+assigns[j].title);
							if(register[r].role == 1) {
								resBody = resBody.concat("&nbsp;&nbsp;<a href='edit?id="+assigns[j].work_id+"'>[Edit]</a>&nbsp;&nbsp;<a href='submissions?id="+courses[i].course_id+"'>Student Submissions</a>");
							}
							else if(register[r].role == 0) {
								resBody = resBody.concat("&nbsp;&nbsp;<a href='soln?id="+assigns[j].work_id+"'>View Your Solution</a>");
							}
							resBody = resBody.concat("</li>");
						}
					}
					resBody = resBody.concat("</ul>");
				}
			}
		}
	}
	res.send(resBody);
	
   resBody = "";
   courses = [];
   assigns = [];
	register = [];
  // db.close();
});
//router.get('
module.exports = router;
