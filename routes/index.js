var express = require('express');
var router = express.Router();
let utopian = require('utopian-api');
var rp = require('request-promise');

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

router.get('/category/:category', async (req, res) => {
  let category = req.params.category

  let flaggedURL = 'https://api.utopian.io/api/posts?status=flagged&type=development&limit=75'
  let reviewedURL = 'https://api.utopian.io/api/posts?status=reviewed&type=development&limit=225'
  let flaggedProjects = JSON.parse( await rp(flaggedURL) )
  let reviewedProjects =  JSON.parse( await rp(reviewedURL) )
  let projects = flaggedProjects.results.concat(reviewedProjects.results)
  res.json(projects)



  // let data = [utopian.getPosts({ sortBy: 'created', type: category }),
  //  utopian.getPosts({ sortBy: 'created', type: category, skip: 50}),
  //  utopian.getPosts({ sortBy: 'created', type: category, skip: 100}),
  //  utopian.getPosts({ sortBy: 'created', type: category, skip: 150}),
  //  utopian.getPosts({ sortBy: 'created', type: category, skip: 200}),
  //  utopian.getPosts({ sortBy: 'created', type: category, skip: 250}),
  //  utopian.getPosts({ sortBy: 'created', type: category, skip: 300}) ]
  //
  //  Promise.all(data).then((data) => {
  //    let merge = data.map(x => x.results).reduce((all, arr) => all.concat(arr) ,[])
  //    res.json(merge)
  //  });
});

router.get('/pending/:category', (req, res) => {


  console.log(utopian)

  utopian.getPosts({
      sortBy: 'created'
  }).then((posts) => {
    res.json(posts)
  })

  // utopian.getPendingPostsByModerator('wehmoen')
  //     .then((data) => {
  //       res.json(data)
  //    });

  //   utopian.getPosts({
  //     status: 'any'
  //   })
  //   .then((data) => {
  //     res.json(data)
  //  });
});


module.exports = router;
