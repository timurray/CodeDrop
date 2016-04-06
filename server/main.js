var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var sqlite = require('sqlite3').verbose();
var bodyParser = require('body-parser');
const fs = require('fs');

var db = new sqlite.Database("codedrop.db");

var userId = -1;

router.get('/', function(req, res) {
	res.sendFile('public/index.html', {root: __dirname });
});

router.get('/login', function(req, res) {
	res.sendFile('public/login.html', {root: __dirname });
});

function session_sql(user_id, session_id) {
	return "INSERT INTO sessions (session_id, user_id) VALUES (" + quote(session_id) + "," + user_id + ")";
}

router.post('/userpage', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var sessionId = '';
	var found_user = false;

	db.serialize(function() {
			db.each("SELECT u.* FROM users u WHERE u.email = '" + username + "' AND u.password = '" + password + "'", function(err, row) {
				if(err || row == undefined || row === []){
					
				}
				else{
					found_user = true;
					userId = row.user_id;
					sessionId = crypto.randomBytes(10).toString('hex');
					db.run(session_sql(userId,sessionId));
					
					// puts the users session token in the database
					return;
				}
			}, function() {
				if(found_user) {
					req.method = 'get';
					res.redirect('/courses?sessionId='+sessionId);
				}
				else {
					console.log("Invalid credentials");
				}
			});
	});
});

function saveCodeContentsSql(work_id, session_id, content) {
	return "INSERT OR REPLACE INTO solution (work_id, user_id, contents) VALUES ("+work_id+", (SELECT user_id FROM sessions WHERE session_id = '" + session_id +"'), '" + content + "')";
}

router.post('/savecode', function(req, res) {
	db.serialize(function() {
		db.run(saveCodeContentsSql(req.query.id, req.query.sessionId, req.body.codeeditarea), res.redirect('/courses?sessionId='+req.query.sessionId));
		
	});
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
		res.write(projectHeaderHTML('User/Course Creation', 0));
		res.write('\n<h1>User/Course Creation</h1>\n<body>\n<h3> Current Users: <h3>\n<form method="get" action="/deleteUser">\n<select name="users">\n');

		db.serialize(function() {
        	db.each("SELECT * FROM users", function(err, row) {
        		if (err) {
        			res.write(err);	
        		}
        		
        		if(row.role_admin == 1) {
            		res.write('<option>' + row.email + ' (admin)' + '</option><br>\n');
            	}
            	else{
            		res.write('<option>' + row.email + '</option><br>\n');
            	}
            	
        	}, function() {
        		res.write('</select>\n<input type="submit" value="Delete User"/></form>\n<h2> Create New User: </h2>\n');
        		res.write('<form method="post" action="/createuser">\n<input type="text" name="email" placeholder="Email"/><br>\n');
				res.write('<input type="text" name="password" placeholder="Password"/><br>\n');
				res.write('<input type="text" name="firstname" placeholder="First Name"/><br>\n');
				res.write('<input type="text" name="lastname" placeholder="Last Name"/><br>\n');
				res.write('<input type="text" name="phonenumber" placeholder="Phone Number"/><br>\n');
				res.write('Admin:<input type="checkbox" name="isAdmin"/>\n');
				res.write('<input type="submit"/>\n</form>\n');
				res.write('<h3> Current Courses Available: <h3>\n<form method="get" action="/deleteCourse"/>\n<select name="courses">\n');
			});	

        	db.each("SELECT * FROM courses", function(err, row) {
        		if (err) {
        			res.write(err);	
        		}
            	res.write('<option>' + row.name + '</option><br>\n');
        	}, function () {
        		res.write('</select>\n<input type="submit" value="Delete Course"/>\n</form>\n<button onclick="goToEdit()">Edit Course</button>\n<h2> Create New Course: </h2>\n');
        		res.write('<form method="post" action="/createcourse">\n');
				res.write('<input type="text" name="name" placeholder="Course Name"/><br>\n');
				res.write('<input type="text" name="startdate" placeholder="Start Date"/><br>\n');
				res.write('<input type="text" name="enddate" placeholder="End Date"/><br>\n');
				res.write('<input type="submit"/>\n');
				res.write('</form>\n');
				res.write('<script src="scriptsForStuff.js"></script>');
				
				res.write(projectFooterHTML());
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
	var isAdmin = req.body.isAdmin || false;
	
	if(isAdmin == false) {
		isAdmin = 0;
	}
	else {
		isAdmin = 1;
	}
	//var query = req.query;
	//var isAdmin = query.isAdmin;
	console.log("Student Registered: " + email + " " + fname + " " + lname + " " + phnum + " " + isAdmin);
 	
 	db.serialize(function() {
 		db.run("INSERT INTO users (first_name, last_name, email, phone, password, role_admin) VALUES ('" + fname + "','" + lname + "','" + email + "','" + phnum + "','" + pswd + "','" + isAdmin + "')");		
  	});
  	
  	res.redirect('back');
  	//res.send("User registered with the following info: " + "<br>" + email + "<br>" + fname + "<br>" + lname + "<br>" + phnum + '<br>\n<a href="/creation">Back to User/Course Creation</a>');
});

router.post('/createcourse', function(req, res) {
	var name = req.body.name;
	var startdate = req.body.startdate;
	var enddate = req.body.enddate;
	
	db.serialize(function() {
 		db.run("INSERT INTO courses (name, startdate, enddate) VALUES ('" + name + "','" + startdate + "','" + enddate + "')");		
  	});
  	
  	res.redirect('back');
  	//res.send("Course created with the following info: " + "<br>" + name + "<br>" + startdate + "<br>" + enddate + '<br>\n<a href="/creation">Back to User/Course Creation</a>');
});

router.get('/deleteUser', function(req, res) {
	var query = req.query;
	var email = query.users;
	// incase of admin, slits to get rid of '(admin)' in the email string
	var emailArr = email.split(' (');
	
	db.serialize(function(err) {
		if(err) {
			res.send(err);
		}
		db.run('DELETE FROM users WHERE email="' + emailArr[0] + '"');
		
		res.redirect('back');
	});
});

router.get('/deleteCourse', function(req, res) {
	var query = req.query;
	var course = query.courses;
	
	db.serialize(function(err) {
		if(err) {
			res.send(err);
		}
		db.run('DELETE FROM courses WHERE name="' + course + '"');
		
		res.redirect('back');
	});
});

router.get('/courseEdit/:courseName', function(req, res) {
	var course = req.params.courseName;
	var roleName = '';
	res.write(projectHeaderHTML("Edit Course/User Info", 0));
	res.write('\n<body>\n<h1>' + course + '</h1>\n');
	res.write('<h2>Change Course Info: </h2>\n');
    res.write('<form method="post" action="/editCourseInfo/' + course + '">\n');
	res.write('<input type="text" name="name" placeholder="Update Course Name"/><br>\n');
	res.write('<input type="text" name="startdate" placeholder="Update Start Date"/><br>\n');
	res.write('<input type="text" name="enddate" placeholder="Update End Date"/><br>\n');
	res.write('<input type="submit"/>\n');
	res.write('</form>\n<br><br>');
	res.write('<h2> Currently Registered Users in this Course:</h2>\n<form method="get" action="/removeUser/' + course + '">\n<select name="regUsers">\n');
	db.serialize(function () {
		db.each('SELECT * FROM users U, courses C, register R WHERE C.name = "' + course + '" AND R.course_id = C.course_id AND R.user_id = U.user_id', 
		function (err, row) {
			if(err) {
				res.write(err);
			}
			
			if(row.role == 0) {
				roleName = 'Student';
			}
			else if(row.role == 1){
				roleName = 'Instructor';
			}
			else if(row.role == 2) {
				roleName = 'TA';
			}
				
			res.write('<option>' + row.email + ' (' + roleName + ')' + '</option>\n<br>');
		}, function(){
			res.write('</select>\n<input type="submit" value="Remove user from course"/>\n</form>\n<h2>Users not registered for this course:</h2>\n');
			res.write('<form method="get" action="/addUser/' + course + '">\n<select name="users">\n');
		});
		
		db.each('SELECT * FROM users U WHERE NOT U.user_id IN (SELECT R.user_id FROM register R, courses C WHERE R.course_id = C.course_id AND C.name = "' + course + '")', function(err, row) {
        		if (err) {
        			res.write(err);
        		}
        		
        		//if not admin, add to list because admins can't be enrolled in courses
        		if(!(row.role_admin == 1)){
        			res.write('<option>' + row.email + '</option><br>\n');
        		}
        }, function() {
        	res.write('</select>\n<br><input type="radio" name="role" value="Student"/>Student<br>\n<input type="radio" name="role" value="Instuctor"/>Instructor<br>\n<input type="radio" name="role" value="TA"/>TA<br>\n');
        	res.write('<input type="submit" value="Add user to course"/>\n</form>\n');
        	res.write('<a href="/creation">Back to creation</a>\n</body>\n');
      
			res.write(projectFooterHTML());
			res.end();
        });		
	});
});

router.get('/addUser/:courseName', function(req, res) {
	var query = req.query;
	var email = query.users;
	
	// parses to get email because in the option, the role is next to it in the string
	var emailArr = email.split(' (');
	var roleName = query.role;
	var roleNum = -1;
	var course = req.params.courseName;
	var userId = '';
	var courseId = '';
	
	if(roleName == 'Student') {
		roleNum = 0;
	}
	else if(roleName == 'Instructor'){
		roleNum = 1;
	}
	else if(roleName == 'TA') {
		roleNum = 2;
	}
	
	db.serialize(function() {
		db.each('SELECT U.user_id from users U WHERE U.email = "' + emailArr[0] + '"', function(err, row) {
			if(err) {
				res.write(err);
			}
			userId = row.user_id;
		});		
		
		db.each('SELECT C.course_id from courses C WHERE C.name = "' + course + '"', function(err, row) {
			if(err) {
				res.write(err);
			}
			courseId = row.course_id;
		}, function() {
			db.run('INSERT OR REPLACE INTO register (user_id, course_id, role) VALUES ("' + userId + '","' + courseId + '","' + roleNum + '")');
			res.redirect('back');
		});
	});
});

router.get('/removeUser/:courseName', function(req, res) {
	var query = req.query;
	var email = query.regUsers;
	
	// parses to get email because in the option, the role is next to it in the string
	var emailArr = email.split(' (');
	var course = req.params.courseName;
	var userId = '';
	var courseId = '';
	db.serialize(function() {
		db.each('SELECT U.user_id from users U WHERE U.email = "' + emailArr[0] + '"', function(err, row) {
			if(err) {
				res.write(err);
			}
			userId = row.user_id;
		});
		
		db.each('SELECT C.course_id from courses C WHERE C.name = "' + course + '"', function(err, row) {
			if(err) {
				res.write(err);
			}
			courseId = row.course_id;
		}, function() {			
			db.run('DELETE FROM register WHERE user_id = "' + userId + '" AND course_id = "' + courseId + '"');
			res.redirect('back');
		});
	});
});

router.post('/editCourseInfo/:courseName', function(req, res) {
	var currentName = req.params.courseName;
	var name = req.body.name;
	var startdate = req.body.startdate;
	var enddate = req.body.enddate;
	
	console.log(currentName);
	console.log(name);
	db.serialize(function() {
		if(name != '') {
 			db.run('UPDATE courses SET name="' + name + '" WHERE name="' + currentName + '"');	
 		}
 		else if(startdate != '') {
 			db.run('UPDATE courses SET startdate="' + startdate + '" WHERE name="' + currentName + '"');
 		}
 		else if(enddate != '') {
 			db.run('UPDATE courses SET enddate="' + enddate + '" WHERE name="' + currentName + '"');
 		} 
 		res.redirect('/courseEdit/' + name);	
  	});
});

router.get('/contact', function(req, res) {
	res.sendFile('public/contact.html', {root: __dirname });
});

router.get('/edit', function(req, res) {
	res.sendFile('public/asignedit.html', {root: __dirname });
});

function viewSolutionSql(title, student) {
	return "SELECT S.contents FROM solution S WHERE S.work_id = (SELECT work_id FROM work WHERE title = " + quote(title) + ") AND S.user_id = " + student;
}

router.get('/viewsoln/:title/:student', function(req, res) {
	var contents = '';
	db.serialize(function() {
		db.each(viewSolutionSql(req.params.title, req.params.student), function(err, row) {
			if(err) {
				console.log(err);
			}
			else if (JSON.stringify(row.contents) != 'null') {
				contents = row.contents;
			}
		}, function() {
			fs.readFile('public/firsthalf-stucode.html', 'utf8', function(err, data) {
				if(err) {
					console.log(err);
				}
				res.write(data);
				
				res.write("<div id='codeeditor'>");
				res.write("<textarea id='codeeditarea' form='savecodeform' name='codeeditarea' rows='100'>");
				
				res.write(contents);
				fs.readFile('public/secondhalf-stucode.html', 'utf8', function(err, data) {
					if(err) {
						console.log(err);
					}
					res.write(data);
					res.end();
				});
			});
		});
	});
});

router.get('/soln', function(req, res) {
	db.serialize(function() {
		var contents = '';
		db.each("SELECT S.contents FROM solution S, sessions N WHERE N.session_id = '" + req.query.sessionId + "' AND S.user_id = N.user_id AND S.work_id = " + req.query.id, function(err, row) {
			if(err) { 
				console.log(err);
			}
			if(JSON.stringify(row.contents) != 'null') {
				contents = row.contents;
			}
		}, function() {
			fs.readFile('public/firsthalf-stucode.html', 'utf8', function(err, data) {
				if(err) {
					console.log(err);
				}
				res.write(data);
				
			/*
			<form id="savecodeform" method="post" action="/savecode">
            <div id="codeeditor">
               <textarea id="codeeditarea" form="savecodeform" name="codeeditarea" rows="100">
			*/
				res.write("<form id='savecodeform' method='post' action='/savecode?sessionId="+req.query.sessionId +"&id=" + req.query.id + "'>");
				res.write("<div id='codeeditor'>");
				res.write("<textarea id='codeeditarea' form='savecodeform' name='codeeditarea' rows='100'>");
				
				res.write(contents);
				fs.readFile('public/secondhalf-stucode.html', 'utf8', function(err, data) {
					if(err) {
						console.log(err);
					}
					res.write(data);
					res.end();
				});
			});
		});
	});
});


function getAssignments(user_id) {
	return "SELECT W.* FROM work W, register R WHERE W.course_id = R.course_id AND R.user_id = " + user_id;
}

function getCourses(session_id, role) {
	return "SELECT C.*, W.* FROM courses C, register R, sessions S, work W WHERE S.session_id = " + quote(session_id) + " AND R.user_id = S.user_id AND R.course_id = C.course_id AND R.role = " + role + " AND W.course_id = C.course_id";
}

function getRegister(user_id) {
	return "SELECT R.* FROM register R WHERE R.user_id = " + user_id;
}

var workId = 0;
var courses = [];
var assigns = [];
var register = [];

router.get('/submissions/:course/:title', function(req, res) {
	res.write(projectHeaderHTML("Assignment submissions", 0));
	res.write("<h2>Submissions for " + req.params.title + " </h2>");
	db.serialize( function() {
	
		db.each("SELECT S.* FROM users S, register R WHERE R.user_id = S.user_id AND R.role = 0 AND R.course_id = (SELECT course_id FROM courses WHERE name = " + quote(req.params.course) + ")", function(err, row) {
			res.write("<li><a href='/viewsoln/" + req.params.title + "/" + row.user_id + "'>"+row.first_name + " " + row.last_name +"</a></li>");
		});
	
	}, function() {
		res.write("</ul>");
		res.write(projectFooterHTML());
		res.end();
	});
});

router.get('/courses', function(req, res) {
	var student_course = '';
	var inst_course = '';
	db.serialize( function() {
		res.write(projectHeaderHTML("Your Assignments", 0));
		res.write("YOUR ASSIGNMENTS <br/> <ul>");
		
		// Put out rows for all courses you are a student in!
		
		db.each(getCourses(req.query.sessionId, 0), function(err, row) {
			if(err) {
				console.log(err);
			}
			if(row.course_id != student_course) {
				res.write("</ul>");
				student_course = row.course_id;
				res.write("<li>" + row.name + ": " + row.course_title + "</li>");
				res.write("<ul>");
				res.write("<li><a href='/soln?sessionId=" + req.query.sessionId + "&id=" + row.work_id + "'>" + row.title + "</a></li>");
			}
			else {
				res.write("<li><a href='/soln?sessionId=" + req.query.sessionId + "&id=" + row.work_id + "'>" + row.title + "</a></li>");
			}
			
		}, function() {
			res.write("</ul>");	
			res.write("Courses You Teach <ul>");
			db.each(getCourses(req.query.sessionId, 1), function(err, row) {
				if(err) {
					console.log(err);
				}
				if(row.course_id != inst_course) {
					res.write("</ul>");
					inst_course = row.course_id;
					res.write("<li>" + row.name + " <a href='edit/" + row.name+"/?sessionId="+req.query.sessionId+"'>Add new assignment</a></li>");
					res.write("<ul>");
					res.write("<li>" + row.title + "<a href='edit/"+row.name+"/"+row.work_id+"?sessionId="+req.query.sessionId+"'>EDIT</a> <a href='submissions/" + row.name + "/" + row.title + "?id=" + row.work_id + "'>View submissions</a></li>");
				}
				else {
					res.write("<li>" + row.title + "<a href='edit/"+row.name+"/"+row.work_id+"?sessionId="+req.query.sessionId+"'>EDIT</a> <a href='submissions/" + row.name + "/" + row.title + "?id=" + row.work_id + "'>View submissions</a></li>");
				}
			}, function() {
				res.write("</ul>");
				res.write(projectFooterHTML());
				res.end();
			});
		});
	});
});

function editAssignmentSql(session_id, work_id) {
	return "SELECT W.*, T.* FROM work W LEFT JOIN tests T ON W.work_id = T.work_id WHERE W.work_id = " + work_id + " AND (SELECT user_id FROM sessions WHERE session_id = " + quote(session_id) + ") = (SELECT user_id FROM register WHERE course_id = W.course_id AND role = 1)";
}

router.get('/edit/:name', function(req, res) {
	db.serialize( function() {
		var id = 0;
		db.run(
			"INSERT INTO work (course_id, title) VALUES ((SELECT course_id FROM courses WHERE name = " + quote(req.params.name) + "), 'New Assignment')",
			function(err, row) {
				if(err) {
					console.log(err);
				}
			},
			res.redirect('back')
		);
	});
	
});

router.get('/edit/:name/:work_id', function(req, res) {
	db.serialize(function() {
		res.write(projectHeaderHTML("Edit Assignment", 0));
		db.each(editAssignmentSql(req.query.sessionId, req.params.work_id), function(err, row) {
			if(err) {
				console.log(err);
			}
			res.write('<h1>Editing Assignment For ' + req.params.name + '</h1><br/>');
			res.write('<form method="post" action="/saveassign/' + req.params.name + '/' + req.params.work_id + '">');
			
			
			// Write Title and Description inputs
			res.write('<div>Assignment details:</div>');
			
			res.write('<table>');
			res.write('<tr><td>Title:</td><td>');
			res.write('<input name="save_title" type="text" value="'+ not_null(row.title) + '"/></td></tr>');
			res.write('<tr><td>Description:</td><td>');
			res.write('<input type="text" name="desc" value="'+ not_null(row.contents)+'"></input></td></tr>');
			
			// Write Start and End date inputs
			res.write('<tr><td>Start Date:</td><td>');
			res.write('<input name="startdate" type="text" value="' + not_null(row.start_date) + '"/></td></tr>');
			res.write('<tr><td>Due Date:</td><td>');
			res.write('<input name="duedate" type="text" value="' + not_null(row.due_date) + '"/></td></tr>');
			res.write('</table><br/>');
			
			// Write test parameter inputs table
			res.write('<div id="test">Test Parameters: </div>');
			res.write('<table id="test-table">');
			res.write('<tr><td>Input:</td><td>  <input name="save_input" type="text" value="' + not_null(row.test_input) + '"/></td></tr>');
			res.write('<tr><td>Output:</td><td> <input name="save_output" type="text" value="' + not_null(row.test_output) + '"/></td></tr>');
			res.write('<tr><td>Code:</td><td>   <input name="save_code" type="text" value="' + not_null(row.code) + '"/></td></tr>');
			res.write('<tr><td>Runs:</td><td>   <input name="save_runs" type="text" value="' + not_null(row.runs) + '"/></td></tr>');
			res.write('</table>');
			
			
			res.write('<input type="submit"/>');
			res.write('</form>');
		}, function() {
			res.write(projectFooterHTML());
			res.end();
		});
	});
});

function saveAssignmentSql(work_id, course_id, title, start_date, due_date, contents) {
	var sql = "INSERT OR REPLACE INTO work (work_id, course_id, title, start_date, due_date, contents) VALUES (";
	
	sql = sql + work_id;
	sql = appdel(sql, course_id);
	sql = appdel(sql, quote(title));
	sql = appdel(sql, quote(start_date));
	sql = appdel(sql, quote(due_date));
	sql = appdel(sql, quote(contents));
	sql = sql + ")"
	
	console.log(sql);
	return sql;
}

function saveTestsSql(work_id, input, output, code, runs) {
    if( isNaN(parseFloat(runs)) ) {
		runs = "''";
	}
	
	var sql = "INSERT OR REPLACE INTO tests(test_id, work_id, test_input, test_output, code, runs) VALUES (";
	sql = sql + work_id + ", ";
	sql = sql + work_id;
	sql = appdel(sql, quote(input));
	sql = appdel(sql, quote(output));
	sql = appdel(sql, quote(code));
	sql = appdel(sql, runs);
	sql = sql + ")";
	return sql;
}

router.post('/saveassign/:course_name/:work_id', function(req, res) {
	db.run(saveAssignmentSql(
		req.params.work_id,
		"(SELECT course_id FROM courses WHERE name = " + quote(req.params.course_name) + ")",
		req.body.save_title,
		req.body.startdate,
		req.body.duedate,
		req.body.desc)
	, function(err, row) {
		if(err) {
			console.log(err);
		}
	}
	, function() {
		db.run(saveTestsSql(req.params.work_id,
		req.body.save_input,
		req.body.save_output,
		req.body.save_code,
		req.body.save_runs),
			function(err, row) {
				if(err) {
					console.log(err);
				}
			}, res.redirect('back')
		);
	});
});

function appdel(sql, str) {
	return sql.concat(", " + str);
}

function quote(str) {
	return quote(str, true);
}
function quote(str, single) {
	if (single==true) return "'" + str + "'";
	else return '"' + str + '"';
}

function not_null(str) {
	if (str == undefined || str == null || str == 'null') {
		return '';
	}
	return str;
}

function projectHeaderHTML(title, selected) {
	var html = '';
	html = html.concat('<html><head><link rel="icon" href="/favicon.ico"/>');
	html = html.concat('<title>' + title + '</title>');
	html = html.concat('<link type="text/css" rel="stylesheet" href="/default.css"/>');
	html = html.concat('</head><body>');
	html = html.concat('<div id="header"><div id="header-wrapper"><div id="header" class="container">');
	html = html.concat('<div id="logo"><h1><img src="/favicon.ico" alt=""/><a href="/">CodeDrop</a></h1></div>');
	html = html.concat('<div id="menu"><ul><li><a href="/">Home</a></li>');
	html = html.concat('<li class="current_page_item"><a href="/courses">Courses</a></li>');
	html = html.concat('<li><a href="/contact">Contact</a></li>');
	html = html.concat('<li><a href="/login">Sign In</a></li>');
	html = html.concat('</ul></div></div></div>');
	
	html = html.concat('<div id="banner"><div class="container">');
	
	return html;
}

function projectFooterHTML() {
	var html = '';
	html = html.concat('</div></div></div>');
	html = html.concat('<div id="copyright" class="container">');
	html = html.concat('<p>Team CSSTCS4770TPAPT2016WSAMUN Winter 2016</p></div>');
	html = html.concat('</body></html>');
	return html;
}


module.exports = router;
