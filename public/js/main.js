const octokit = new Octokit()

if ( $('main').hasClass('profile') ){
  let user = $('main').data('username');
  console.log(user)
  initProfile(user)
}

if ( $('main').hasClass('landing') ){
  utopianCategoryData('development').then(data => {

    let oneWeekAgo = new Date(moment().subtract(7,'days').format('YYYY-MM-DDThh:mm:ss') );
    let oneDayAgo = new Date(moment().subtract(1,'days').format('YYYY-MM-DDThh:mm:ss') );

    let weeklyProjects = data.filter( project => new Date(project.created).valueOf() >= oneWeekAgo.valueOf() )
    let weeklyAuthors = [...new Set(weeklyProjects.map(project => project.author))]
    let dailyProjects = data.filter( project => new Date(project.created).valueOf() >= oneDayAgo.valueOf() )
    let dailyauthors = [...new Set(dailyProjects.map(project => project.author))]

    console.log(weeklyAuthors, weeklyProjects)
    console.log(dailyauthors, dailyProjects)
  })

}

function initProfile(username){
  utopianUserData(username).then( data => {
    let uniqueProjects = getUniqueProjects(data)
    let projectData = data.results
    displayProjects(uniqueProjects, projectData)
    displayHeader(username, uniqueProjects, projectData)
  })
}

function steemData(username){
  return steem.api.getAccountsAsync([username])
}

function utopianCategoryData(category){
  return new Promise((resolve,reject) => {
    $.get(`/category/${category}`, (result, res) => {
      if(res === 'success') resolve(result)
    })
  })
}

function utopianUserData(username){
  return new Promise((resolve,reject) => {
    $.get(`/data/${username}`, (result, res) => {
      if(res === 'success') resolve(result)
    })
  })
}
    
function getUniqueProjects(data) {
  let development = data.results.filter(project => project.json_metadata.type === 'development')
  let repos = development.map(project => project.json_metadata.repository.name)
  let uniqueProjects = [...new Set(repos)]
  return uniqueProjects
}

async function displayHeader(username, uniqueProjects, projectData){
  let user = await steemData(username);
  let development = projectData.filter(project => project.json_metadata.type === 'development')
  let profileImage;
  try { profileImage = JSON.parse(user[0].json_metadata).profile.profile_image } catch(error){console.warn(error)}
  console.log(profileImage)

  let template = `@${username} has contributed ${development.length} updates over ${uniqueProjects.length} Projects`
  $('header').append(template)
}

function displayProjects(uniqueProjects, projectData) {
  console.log(uniqueProjects, projectData)
  uniqueProjects.forEach( async (projectName) => {
    let template = await singleProjectTemplate(projectName, projectData)
    $('main').append(template)
  })
}

async function singleProjectTemplate(projectName, projectData){
  let projectPosts = projectData.filter(project => project.json_metadata.repository.name === projectName)
  let votes = projectPosts.map(project => project.net_votes)
  let avgVotes = projectPosts.reduce((total,post) => total + post.net_votes, 0) / projectPosts.length
  let avgComments = Math.round(projectPosts.reduce((total,post) => total + post.children, 0) / projectPosts.length)
  let latestUpdate = projectPosts[0]
  let projectURL = latestUpdate.json_metadata.repository.html_url
  let age = moment(latestUpdate.created).startOf('day').fromNow();
  let repo = await getGithubRepo(latestUpdate.json_metadata.repository.full_name)
  // console.log(repo.data.forks_count)
  let repoStars = repo.data.stargazers_count

  return template = `
  <div class="project-card">

    <h2>${projectName}</h2>
    <h3>Latest: <a href="https://utopian.io${latestUpdate.url}">${latestUpdate.title}</a></h3>
    <h3>Updated: ${age}</h3>
    <h4>Update Count ${projectPosts.length}</h4>
    <h4>Average Votes ${avgVotes}</h4>
    <h4>Average Comments ${avgComments}</h4>
    <h4>Gh Stars ${repoStars}</h4>
  </div>`
}

async function getGithubRepo(repoPath){
  let repoPathParts = repoPath.split('/')
  let owner = repoPathParts[0]
  let name = repoPathParts[1]
  return octokit.repos.get({
    owner: owner,
    repo: name
  })
}
