var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var sqlite = require('sqlite3').verbose();
var bodyParser = require('body-parser');
const fs = require('fs');

var db = new sqlite.Database("codedrop.db");


var userId = -1;

function session_sql(user_id, session_id) {
	return "INSERT INTO sessions (session_id, user_id) VALUES ('" + session_id + "'," + user_id + ")";
}

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
	var sessionId = '';


	db.serialize(function() {
			db.each("SELECT u.* FROM users u WHERE u.email = '" + username + "' AND u.password = '" + password + "'", function(err, row) {
				// if nothing was selected, rows will be empty array;			
				if(err || row == undefined || row === []){
					
				}
				else{
					userId = row.user_id;
					sessionId = crypto.randomBytes(10).toString('hex');
					db.run(session_sql(userId,sessionId));
					
					// puts the users session token in the database
					console.log('user Id is: ' + userId);
					return;
				}
			}, function() {
				console.log("sessionID: " + sessionId);
				req.method = 'get';
				res.redirect('/courses?sessionId='+sessionId);
			});
	});
});

router.post('/savecode', function(req, res) {
	var content = req.body.codeeditarea;
	db.serialize(function() {
		console.log ("UPDATE work SET contents = '" + content + "' WHERE work_id = " + req.query.id);
		db.run("UPDATE work SET contents = '" + content + "' WHERE work_id = " + req.query.id);
	});
	res.write("Success <br>" + content);
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
		//keep this commented out line which does the html statically
        //res.sendFile('public/creation.html', {root: __dirname });
		res.write('<html>\n<title>User/Course Creation</title>\n<h1>User/Course Creation</h1>\n<body>\n<h3> Current Users: <h3>\n<select>\n');

		db.serialize(function() {
        	db.each("SELECT * FROM users", function(err, row) {
        		if (err) {
        			res.write(err);	
        		}
            	res.write('<option>' + row.first_name + '</option><br>\n');
        	}, function() {
        		res.write('</select>\n<h2> Create New User: </h2>\n');
        		res.write('<form method="post" action="/createuser">\n<input type="text" name="email" placeholder="Email"/><br>\n');
				res.write('<input type="text" name="password" placeholder="Password"/><br>\n');
				res.write('<input type="text" name="firstname" placeholder="First Name"/><br>\n');
				res.write('<input type="text" name="lastname" placeholder="Last Name"/><br>\n');
				res.write('<input type="text" name="phonenumber" placeholder="Phone Number"/><br>\n');
				res.write('<input type="submit"/>\n</form>\n');
				res.write('<h3> Current Courses Available: <h3>\n<select>\n');
			});	

        	db.each("SELECT * FROM courses", function(err, row) {
        		if (err) {
        			res.write(err);	
        		}
            	res.write('<option>' + row.name + '</option><br>\n');
        	}, function () {
        		res.write('</select>\n<h2> Create New Course: </h2>\n');
        		res.write('<form method="post" action="/createcourse">\n');
				res.write('<input type="text" name="name" placeholder="Course Name"/><br>\n');
				res.write('<input type="text" name="startdate" placeholder="Start Date"/><br>\n');
				res.write('<input type="text" name="enddate" placeholder="End Date"/><br>\n');
				res.write('<input type="submit"/>\n');
				res.write('</form>\n');
				res.end();
			});
		});	
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
  	
  	res.send("User registered with the following info: " + "<br>" + email + "<br>" + fname + "<br>" + lname + "<br>" + phnum + '<br>\n<a href="/creation">Back to User/Course Creation</a>');
});

router.post('/createcourse', function(req, res) {
	var name = req.body.name;
	var startdate = req.body.startdate;
	var enddate = req.body.enddate;
	
	db.serialize(function() {
 		db.run("INSERT INTO courses (name, startdate, enddate) VALUES ('" + name + "','" + startdate + "','" + enddate + "')");		
  	});
  	
  	res.send("Course created with the following info: " + "<br>" + name + "<br>" + startdate + "<br>" + enddate + '<br>\n<a href="/creation">Back to User/Course Creation</a>');
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
		res.write(contents + rest);
	});
	rest = "";
	contents ="";
});


function getAssignments(user_id) {
	return "SELECT W.* FROM work W, register R WHERE W.course_id = R.course_id AND R.user_id = " + user_id;
}

function getCourses(session_id) {
	return "SELECT C.*, W.* FROM courses C, register R, sessions S, work W WHERE S.session_id = '" + session_id + "' AND R.user_id = S.user_id AND R.course_id = C.course_id AND W.course_id = C.course_id";
}

function getRegister(user_id) {
	return "SELECT R.* FROM register R WHERE R.user_id = " + user_id;
}

var workId = 0;
var courses = [];
var assigns = [];
var register = [];

router.get('/submissions', function(req, res) {
	res.write("<ul>");
	db.serialize( function() {
		db.each("SELECT S.* FROM users S, register R WHERE R.user_id = S.user_id AND R.role = 0 AND R.course_id = " + req.query.id, function(err, row) {
			res.write("<li><a href='soln'>"+row.first_name + " " + row.last_name +"</a></li>");
		});
	});
	res.write("</ul>");
});

router.get('/courses', function(req, res) {
	var course = '';
	db.serialize( function() {
		res.write("<html><body><ul><ul>");
		db.each(getCourses(req.query.sessionId), function(err, row) {
			if(err) {
				console.log(err);
			}
			if(row.course_id != course) {
				res.write("</ul>");
				course = row.course_id;
				res.write("<li><a href='/course?id=" + row.course_id + "'>" + row.name + "</a></li>");
				res.write("<ul>");
				res.write("<li><a>" + row.title + "</a></li>");
			}
			else {
				res.write("<li><a>" + row.title + "</a></li>");
			}
			
		}, function() {
			res.write("</ul></body></html>");
			res.end();
		});
	});
});

module.exports = router;
