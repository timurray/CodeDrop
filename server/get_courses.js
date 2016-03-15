var express = require('express');
var router = express.Router();


// define the home page route
router.get('api/', function(req, res) {
  res.sendFile('public/api.html', {root: __dirname });
});