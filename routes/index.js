var express = require('express');
var router = express.Router();
let utopian = require('utopian-api');

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', {
      title: 'Express'
   });
});

router.get('/data/:username', function(req, res) {
  let username = req.params.username
  utopian.getPostByAuthor(username)
    .then((data) => res.json(data));
});

router.get('/category/:category', (req, res) => {
  let category = req.params.category

  let data = [utopian.getPosts({ sortBy: 'created', type: category }),
   utopian.getPosts({ sortBy: 'created', type: category, skip: 50}),
   utopian.getPosts({ sortBy: 'created', type: category, skip: 100}) ]

   Promise.all(data).then((data) => {
     let merge = data.map(x => x.results).reduce((all, arr) => all.concat(arr) ,[])
     res.json(merge)
   });
});


module.exports = router;
