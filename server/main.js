var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3').verbose();

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

//router.get('
module.exports = router;
