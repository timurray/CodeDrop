var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3').verbose();
var bodyParser = require('body-parser');
const fs = require('fs');

var db = new sqlite.Database("codedrop.db");

router.get('/', function(req, res) {
	res.sendFile('public/index.html', {root: __dirname });
});

router.get('/login', function(req, res) {
	res.sendFile('public/login.html', {root: __dirname });
	//console.log('Username: ' + req.body.username);
	//console.log('password: ' + req.body.password);
});

router.post('/userpage', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	db.serialize(function() {
		try {
			db.all("SELECT u.* FROM users u WHERE u.email = '" + username + "' AND u.password = '" + password + "'", function(err, rows) {
				// if nothing was selected, rows will be empty array;			
				if(err || rows == undefined || rows === []){
					res.send("User not registered");	
				}
				else{
					res.send(rows[0].user_id + rows[0].first_name + rows[0].email + '\n');
				}
			});
		}
		catch(er) {
			console.log(er);
		}
	});
});

router.post('/savecode', function(req, res) {
	var content = req.body.codeeditarea;
	db.serialize(function() {
		console.log ("UPDATE work SET contents = '" + content + "' WHERE work_id = " + req.query.id);
		db.run("UPDATE work SET contents = '" + content + "' WHERE work_id = " + req.query.id);
	});
	res.send("Success <br>" + content);
});

router.get('/register', function(req, res) {
        res.sendFile('public/register.html', {root: __dirname });
});

router.post('/registered', function(req, res) {
	var email = req.body.email;
	var fname = req.body.firstname;
    var lname = req.body.lastname;
	var phnum = req.body.phonenumber;
	var pswd = req.body.password;
	console.log("Student Registered: " + email + " " + fname + " " + lname + " " + phnum);
 	
 	db.serialize(function() {
 		db.run("INSERT INTO users (first_name, last_name, email, phone, password) VALUES ('" + fname + "','" + lname + "','" + email + "','" + phnum + "','" + pswd + "')");		
  	});
  	
  	res.send("User registered with the following info: " + "<br>" + email + "<br>" + fname + "<br>" + lname + "<br>" + phnum);
  	
});

router.get('/creation', function(req, res) {
        res.sendFile('public/creation.html', {root: __dirname });
});

router.post('/createuser', function(req, res) {
	var email = req.body.email;
	var fname = req.body.firstname;
    var lname = req.body.lastname;
	var phnum = req.body.phonenumber;
	var pswd = req.body.password;
	console.log("Student Registered: " + email + " " + fname + " " + lname + " " + phnum);
 	
 	db.serialize(function() {
 		db.run("INSERT INTO users (first_name, last_name, email, phone, password) VALUES ('" + fname + "','" + lname + "','" + email + "','" + phnum + "','" + pswd + "')");		
  	});
  	
  	res.send("User registered with the following info: " + "<br>" + email + "<br>" + fname + "<br>" + lname + "<br>" + phnum);
});

router.post('/createcourse', function(req, res) {
	var name = req.body.name;
	var number = req.body.number;
	var startdate = req.body.startdate;
	var enddate = req.body.enddate;
	
	db.serialize(function() {
 		//db.run("INSERT INTO users (first_name, last_name, email, phone, password) VALUES ('" + fname + "','" + lname + "','" + email + "','" + phnum + "','" + pswd + "')");		
  	});
});

router.get('/contact', function(req, res) {
	res.sendFile('public/contact.html', {root: __dirname });
});

router.get('/edit', function(req, res) {
	res.sendFile('public/asignedit.html', {root: __dirname });
});

var contents = "";
var rest = "";
router.get('/soln', function(req, res) {
	db.serialize(function() {
		fs.readFile('public/firsthalf-stucode.html', 'utf8', function(err, data) {
			if(err) {
				console.log(err);
			}
			contents = contents + data;
		});
		fs.readFile('public/secondhalf-stucode.html', 'utf8', function(err, data) {
			if(err){ 
				console.log(err);
			}
			rest = rest + data;
		});
		db.each("SELECT W.contents FROM work W WHERE W.work_id = " + req.query.id, function(err, row) {
			rest += row.contents;
		});
		res.send(contents + rest);
	});
	rest = "";
	contents ="";
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
		db.each("SELECT S.* FROM users S, register R WHERE R.user_id = S.user_id AND R.role = 0 AND R.course_id = " + req.query.id, function(err, row) {
			resBody = resBody.concat("<li><a href='soln'>"+row.first_name + " " + row.last_name +"</a></li>");
		});
	});
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

module.exports = router;
