var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = "pg://codedrop_user:12345@codedrop.microhex.net:8081/codedropdb";

var client = new pg.Client(connectionString);
client.connect();


// define the home page route
router.get('api/', function(req, res) {
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
  //var query = client.query("SELECT * FROM courses");
  //res.sendFile('public/test.json', {root: __dirname });
  //res.send();
  var query = client.query("SELECT * FROM courses");
  query.on("row", function (row, result) {
    result.addRow(row);
  });

  query.on("end", function (result) {
    res.send(JSON.stringify(result.rows, null, "    "));
    client.end();
  });
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
