var express = require('express');
var router = express.Router();
let utopian = require('utopian-api');
var rp = require('request-promise');

utopian.getPostsByGithubProject = (repoName, options, projectId) => {
  return new Promise((resolve, reject) => {
    // return getGithubRepoIdByRepoName(repoName)
      // .then(projectId => {
        return utopian.getPosts(Object.assign({
          section: 'project',
          sortBy: 'created',
          platform: 'github',
          projectId,
          type: 'development'
        }, options || {})).then(resolve).catch(reject)
      // }).catch(reject)
  })
}


/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', {
      title: 'Utopian Dashy'
   });
});

router.get('/project/:id', (req, res) => {

  utopian.getPostsByGithubProject('',
    { type: 'development'},req.params.id)
    .then(data => res.json(data))
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
});



module.exports = router;
