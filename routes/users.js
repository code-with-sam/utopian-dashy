var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:username', function(req, res, next) {
  let username = req.params.username
  res.render('profile', {
     title: 'Utopian User',
     username: username
  });
});

module.exports = router;
