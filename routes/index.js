
var express = require('express');
var path = require('path');
var router = express.Router();
var appRoot = require('app-root-path');

/* GET home page. */
router.get('/*', function (req, res, next) {
  res.sendFile(path.join(appRoot.path, 'public', 'index.html'));
});

module.exports = router;