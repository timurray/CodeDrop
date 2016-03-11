var express = require('express');
var router = express.Router();

// database config
var pgp = require('pg-promise');

var conn = {
	host: 'codedrop.microhex.net',
	port: 8081,
	database: 'codedropdb',
	user: 'codedrop_user',
	password: '12345'
};

var db = pgp(conn);

// define the home page route
router.get('/', function(req, res) {
  res.sendFile('public/api.html', {root: __dirname });
});

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
//var query = db.query('SELECT * FROM courses');

router.get('/get_courses', function(req, res) {
  res.sendFile('public/test.json', {root: __dirname });
  // res.send(query);
});

router.get('/get_assignment_list', function(req, res) {
  res.send('Sample assignment list');
});

router.get('/get_directory', function(req, res) {
  res.send('Sample directory');
});

router.get('/get_file', function(req, res) {
  res.send('Sample file');
});

router.get('/save_file', function(req, res) {
  res.send('Sample save success/fail');
});

router.get('/download_file', function(req, res) {
  res.send('Sample download success/fail statement');
});

router.get('/save_directory', function(req, res) {
  res.send('Sample assignment list');
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
  res.send('Sample users list');
});

router.get('/save_users', function(req, res) {
  res.send('Sample users saved success/fail');
});

module.exports = router;
