var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3').verbose();

var db = new sqlite.Database("codedrop.db");

// define the home page route
router.get('/', function(req, res) {
  res.sendFile('public/api.html', {root: __dirname });
});


/**
 * SQL Statements
 */

function getAllCourses() {
	return "SELECT * FROM courses";
}
 
function getCourses(user_id) {
	return "SELECT C.* FROM courses C, register R WHERE C.course_id = R.course_id AND R.user_id = " + user_id;
}

function getAssignments(user_id) {
	return "SELECT W.* FROM work W, register R WHERE W.course_id = R.course_id AND R.user_id = " + user_id;
}

function getFiles(user_id) {
	return "SELECT F.* FROM file F, file_storage FS WHERE F.fs_id = FS.fs_id AND FS.user_id = " + user_id;
}

function getUsers() {
	return "SELECT * FROM users";
}

function getSolutions(user_id) {
	return "SELECT S.* FROM solution WHERE S.user_id = " + user_id;
}

function getSolution(work_id, user_id) {
	return "SELECT * FROM solution WHERE work_id = " + work_id + " AND user_id = " + userId;
}

/****************************************************
 * API METHOD ACCESS ENTRY POINT FACTORY GENERATION
 * CLASS DESCRIPTION DIAGRAM FACTORY for 
 * 	CodeDrop! made and licsenced by:
 * TEAM CSSTCS4770TPAPT2016WSAMUN Winter 2016
 ****************************************************
 *
 * Methods names are specified in the first part of get
 * example: router.get('[method_name]', function())
 *
 ****************************************************/
 
// GENERAL API METHODS
var resBody = "";
var userId = 0;
var workId = 0;
var courses = [];
var assigns = [];

router.get('/get_courses', function(req, res) {
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
});

router.get('/get_assignment_list', function(req, res) {
  db.serialize(function() {
        db.each(getAssignments(userId), function(err, row) {
              resBody  = resBody.concat(JSON.stringify(row) + "<br>");
        });
   });
   res.send(resBody);
   resBody = "";
});


router.get('/get_files', function(req, res) {
	db.serialize(function() {
        db.each(getFiles(userId), function(err, row) {
              resBody  = resBody.concat(JSON.stringify(row) + "<br>");
        });
   });
   res.send(resBody);
   resBody = "";
});


//XXX TODO later
router.get('/save_file', function(req, res) {
  res.send('Sample save success/fail');
});

router.get('/download_file', function(req, res) {
  res.send('Sample download success/fail statement');
});

router.get('/get_directory', function(req, res) {
  res.send('Sample directory');
});

router.get('/save_directory', function(req, res) {
  res.send('Sample assignment list');
});


// STUDENT SPECIFIC

router.get('/get_solutions', function(req, res) {
  db.serialize(function() {
        db.each(getSolution(userId, workId), function(err, row) {
              resBody  = resBody.concat(JSON.stringify(row) + "<br>");
        });
   });
   res.send(resBody);
   resBody = "";
});


// INSTRUCTOR SPECIFIC

router.get('/save_marks', function(req, res) {
  res.send('Sample marks saved success/fail');
});

// ADMIN SPECIFIC

router.get('/save_courses', function(req, res) {
  res.send('Sample courses saved success/fail');
});

router.get('/get_users', function(req, res) {
	db.serialize(function() {
        db.each(getUsers(), function(err, row) {
              resBody  = resBody.concat(JSON.stringify(row) + "<br>");
        });
   });
   res.send(resBody);
   resBody = "";
});

router.get('/save_users', function(req, res) {
  res.send('Sample users saved success/fail');
});

module.exports = router;
