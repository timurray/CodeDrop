var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function(req, res) {
  res.sendFile('public/api.html', {root: __dirname });
});

router.get('/get_courses', function(req, res) {
  res.sendFile('public/test.json', {root: __dirname });
});

module.exports = router;

