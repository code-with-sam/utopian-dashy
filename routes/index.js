var express = require('express');
var router = express.Router();
let utopian = require('utopian-api');

/* GET home page. */
router.get('/', function(req, res, next) {


  utopian.getPostByAuthor('sambillingham').then((data) => {
        res.render('index', {
          title: 'Express',
          data: data
       });
    	}
  );

});

router.get('/data/:username', function(req, res) {
  let username = req.params.username
  utopian.getPostByAuthor(username)
    .then((data) => res.json(data));
});



module.exports = router;
