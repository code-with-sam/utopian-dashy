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

    // console.log(weeklyAuthors, weeklyProjects)
    // console.log(dailyauthors, dailyProjects)
  })

  // $.getJSON('https://api.utopian.io/api/posts?status=flagged&type=development', (data) => {
  //   console.log(data)
  // })
  initLatestPosts()
}

function initLatestPosts(){
  let flagged = 'https://api.utopian.io/api/posts?status=flagged&type=development'
  let reviewd = 'https://api.utopian.io/api/posts?status=reviewed&type=development&limit=200'
  $.getJSON(reviewd, (data) => {
    let projects = getUniqueProjects(data)
    let projectData = data.results
    displayProjects('.grid', projects, projectData)
  })

}

function initProfile(username){
  utopianUserData(username).then( data => {
      let uniqueProjects = getUniqueProjects(data)
      let projectData = data.results
      displayProjects('main', uniqueProjects, projectData)
      displayHeader(username, uniqueProjects, projectData)
  })
}

function steemData(username){
  return steem.api.getAccountsAsync([username])
}

function utopianPendingData(category){
  return new Promise((resolve,reject) => {
    $.get(`/pending/${category}`, (result, res) => {
      if(res === 'success') resolve(result)
    })
  })
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

  let template = `<h1 class="profile__lead"><a href="https://steemit.com/@{username}">@${username}</a> has contributed ${development.length} submissions over ${uniqueProjects.length} Projects</h1>`
  $('header').append(template)
}

function displayProjects(selector, uniqueProjects, projectData) {
  console.log(uniqueProjects, projectData)
  uniqueProjects.forEach( async (projectName) => {
    let template = await singleProjectTemplate(projectName, projectData)
    $(selector).append(template)
  })
}

async function singleProjectTemplate(projectName, projectData){
  let projectPosts = projectData.filter(project => project.json_metadata.repository.name === projectName)
  let votes = projectPosts.map(project => project.net_votes)
  let avgVotes =  Math.round(projectPosts.reduce((total,post) => total + post.net_votes, 0) / projectPosts.length)
  let avgComments = Math.round(projectPosts.reduce((total,post) => total + post.children, 0) / projectPosts.length)
  let latestUpdate = projectPosts[0]
  let projectURL = latestUpdate.json_metadata.repository.html_url
  let age = moment(latestUpdate.created).startOf('day').fromNow();
  // let repo = await getGithubRepo(latestUpdate.json_metadata.repository.full_name)
  // console.log(repo.data.forks_count)
  // let repoStars = 'repo.data.stargazers_count'
  let repoStars = '22'
  let latestModifier = projectPosts.length > 1 ? 'Latest: ' : ''
  let desc = getFirstTag('p', latestUpdate.body).split(" ", 20);
  let content = desc.join(" ");

  // console.log(latestUpdate.body)
  let updates = projectPosts.length > 1 ? `<span class="project__updates"><span>${projectPosts.length - 1}</span></span>` : ''

  return template = `
  <div class="project-card">

    <h2 class="project__name">${projectName}</h2>
    <h3 class="project__title">${latestModifier}<a href="https://utopian.io${latestUpdate.url}">${latestUpdate.title}</a></h3>
    <p class="project__desc">${content + '..'}</p>
    <h3 class="project__age">Updated ${age}</h3>
    ${updates}
    <span class="project__stat">${avgVotes}</span>
    <span class="project__stat">${avgComments}</span>
    <span class="project__stat">${repoStars}</span>
  </div>`
}

function getFirstTag(tag, markdown){
  var converter = new showdown.Converter();
  let placeholder = document.createElement('div');
  placeholder.innerHTML = converter.makeHtml(markdown)
  let content = placeholder.querySelectorAll(tag) ;
  let output = 'dsf'
  for (var i = 0; i < content.length; i++) {
    let html = content[i].innerHTML;
    if (!html.includes('img') && html.length > 0 && html != '<br>' && !html.includes('<a') ) {
      return html
    }
  }
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
