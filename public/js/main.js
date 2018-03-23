
const commentIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h2v3.5L7.5 11H14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 9H7l-2 2v-2H2V2h12v8z"/></svg>'
const ghIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>'
const thumbIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 14c-.05.69-1.27 1-2 1H5.67L4 14V8c1.36 0 2.11-.75 3.13-1.88 1.23-1.36 1.14-2.56.88-4.13-.08-.5.5-1 1-1 .83 0 2 2.73 2 4l-.02 1.03c0 .69.33.97 1.02.97h2c.63 0 .98.36 1 1l-1 6L14 14zm0-8h-2.02l.02-.98C12 3.72 10.83 0 9 0c-.58 0-1.17.3-1.56.77-.36.41-.5.91-.42 1.41.25 1.48.28 2.28-.63 3.28-1 1.09-1.48 1.55-2.39 1.55H2C.94 7 0 7.94 0 9v4c0 1.06.94 2 2 2h1.72l1.44.86c.16.09.33.14.52.14h6.33c1.13 0 2.84-.5 3-1.88l.98-5.95c.02-.08.02-.14.02-.2-.03-1.17-.84-1.97-2-1.97H14z"/></svg>'

// INIT
$('.loading__message').removeClass('loading__message--hidden')

if ( $('main').hasClass('profile') ){
  let user = $('main').data('username');
  initProfile(user)
}

if ( $('main').hasClass('landing') ){

  utopianCategoryData('development').then(data => {
    landingStats(data)
    let latest = { results : data.filter(project => project.reviewed) }
    initLatestPosts(latest)
  })
}

function filterUtopianData(data, modVerdict, timeWindowInDays){
  let timeWindow = new Date(moment().subtract(timeWindowInDays,'days').format('YYYY-MM-DDThh:mm:ss') );
  let results = data.filter(project => project[modVerdict] === true)
  return results.filter( project => new Date(project.created).valueOf() >= timeWindow.valueOf() )
}

function filterPreviousUtopianData(data, modVerdict, timeWindowInDaysStart, timeWindowInDaysEnd ){
  let timeWindowStart = new Date(moment().subtract(timeWindowInDaysStart,'days').format('YYYY-MM-DDThh:mm:ss') );
  let timeWindowEnd = new Date(moment().subtract(timeWindowInDaysEnd,'days').format('YYYY-MM-DDThh:mm:ss') );
  let results = data.filter(project => project[modVerdict] === true)
  return results.filter( project => new Date(project.created).valueOf() >= timeWindowEnd.valueOf() && new Date(project.created).valueOf() <= timeWindowStart.valueOf() )
}


function initLatestPosts(data){
    let projects = getUniqueProjects(data)
    displayProjects('.grid', projects, data.results, 'category')
}

function initProfile(username){
  utopianUserData(username).then( data => {
      let projectData = data.results
      let uniqueProjects = getUniqueProjects(data)
      displayProjects('main', uniqueProjects, projectData, 'profile')
      displayHeader(username, uniqueProjects, projectData)
  })
}

function landingStats(data){
  let dailyFlaggedProjects = filterUtopianData(data, 'flagged', 1)
  let dailyapprovedProjects = filterUtopianData(data, 'reviewed', 1)
  let weeklyFlaggedProjects = filterUtopianData(data, 'flagged', 7)
  let weeklyapprovedProjects = filterUtopianData(data, 'reviewed', 7)

  let previousFlagged14 = filterPreviousUtopianData(data, 'flagged', 7, 14 )
  let previousReviewed14 = filterPreviousUtopianData(data, 'reviewed', 7, 14 )
  let previousFlagged48 = filterPreviousUtopianData(data, 'flagged', 1, 2 )
  let previousReviewed48 = filterPreviousUtopianData(data, 'reviewed', 1, 2 )

  let approved24Change = ((dailyapprovedProjects.length - previousReviewed48.length)/previousReviewed48.length)*100
  if (approved24Change < 0) $('.stat__project24--approved-change').addClass('--negative')
  let flagged24Change = ((dailyFlaggedProjects.length - previousFlagged48.length)/previousFlagged48.length)*100
  if (flagged24Change < 0) $('.stat__project24--flagged-change').addClass('--negative')

  let approved7Change = ((weeklyapprovedProjects.length - previousReviewed14.length)/previousReviewed14.length)*100
  if (approved7Change < 0) $('.stat__project7--approved-change').addClass('--negative')
  let flagged7Change = ((weeklyFlaggedProjects.length - previousFlagged14.length)/previousFlagged14.length)*100
  if (flagged7Change < 0) $('.stat__project7--flagged-change').addClass('--negative')

  $('.stat__project24--approved').text(dailyapprovedProjects.length )
  $('.stat__project24--approved-change').text(  approved24Change.toFixed(2) + '%')
  $('.stat__project24--flagged').text(dailyFlaggedProjects.length )
  if (dailyFlaggedProjects > 0 ) $('.stat__project24--flagged-change').text( flagged24Change.toFixed(2)+ '%')

  $('.stat__project7--approved').text(weeklyapprovedProjects.length )
  $('.stat__project7--approved-change').text( approved7Change.toFixed(2)+ '%')
  $('.stat__project7--flagged').text(weeklyFlaggedProjects.length )
  $('.stat__project7--flagged-change').text(  flagged7Change.toFixed(2)+ '%')

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
  let user = await steem.api.getAccountsAsync([username])
  let development = projectData.filter(project => project.json_metadata.type === 'development')
  let profileImage;
  try { profileImage = JSON.parse(user[0].json_metadata).profile.profile_image } catch(error){console.warn(error)}
  let template = `<h1 class="profile__lead"><a href="https://steemit.com/@${username}">@${username}</a> has contributed ${development.length} submissions over ${uniqueProjects.length} Projects</h1>`
  $('header').append(template)
}

function displayProjects(selector, uniqueProjects, projectData, view) {
  let displayProjects = uniqueProjects.slice(0, 20);
  displayProjects.forEach( (projectName) => {
    let template = singleProjectTemplate(projectName, projectData, view)
    $(selector).append(template)
  })
  if(view === 'category') loadProjectUpdateCount()
}

function singleProjectTemplate(projectName, projectData, view){
  projectData = projectData.filter(project => project.json_metadata.repository !== null )

  let projectPosts = projectData.filter(project => project.json_metadata.repository.name === projectName)
  let votes = projectPosts.map(project => project.net_votes)
  let avgVotes =  Math.round(projectPosts.reduce((total,post) => total + post.net_votes, 0) / projectPosts.length)
  let avgComments = Math.round(projectPosts.reduce((total,post) => total + post.children, 0) / projectPosts.length)
  let latestUpdate = projectPosts[0]
  let projectURL = latestUpdate.json_metadata.repository.html_url
  let age = moment(latestUpdate.created).startOf('day').fromNow();
  let latestModifier = projectPosts.length > 1 ? 'Latest: ' : ''
  let desc = getFirstTag('p', latestUpdate.body).split(" ", 20);
  let content = desc.join(" ");
  let updates = projectPosts.length > 1 ? `<span class="project__updates ${view === 'category' ? 'project__updates--hidden':'' }"><span>${projectPosts.length - 1}</span></span>` : ''

  let profileCardTemplate = `
  <div class="project-card">

    <h2 class="project__name">${projectName}</h2>
    <h3 class="project__title">${latestModifier}<a href="https://utopian.io${latestUpdate.url}">${latestUpdate.title}</a></h3>
    <p class="project__desc">${content + '..'}</p>
    <h3 class="project__age">Updated ${age}</h3>
    ${updates}
    <div class="project__icons">
    <span class="project__stat project__stat--comment">
      <span class="tooltiptext">Average Comments</span>
      ${avgComments} ${commentIcon}
    </span>
      <span class="project__stat project__stat--thumb">
      <span class="tooltiptext">Average Upvotes</span>
        ${avgVotes} ${thumbIcon}</span>
      <span class="project__stat"><A href="${projectURL}">${ghIcon}</a></span>
    </div>
  </div>`
  let categoryCardTemplate = `
  <div class="project-card" data-id="${latestUpdate.json_metadata.repository.id}" data-path="${latestUpdate.json_metadata.repository.full_name}">
    <h2 class="project__name">${projectName}</h2>
    <h3 class="project__title">${latestModifier}<a href="https://utopian.io${latestUpdate.url}">${latestUpdate.title}</a> -   <a href="/users/${latestUpdate.author}">@${latestUpdate.author}</a></h3>
    <p class="project__desc">${content + '..'}</p>
    <h3 class="project__age">Updated ${age}</h3>
    ${updates}
    <div class="project__icons">
    <span class="project__stat project__stat--comment">
      <span class="tooltiptext">Average Comments</span>
      ${avgComments} ${commentIcon}
    </span>
      <span class="project__stat project__stat--thumb">
      <span class="tooltiptext">Average Upvotes</span>
        ${avgVotes} ${thumbIcon}</span>
      <span class="project__stat"><A href="${projectURL}">${ghIcon}</a></span>
    </div>
  </div>`

  if (view === 'profile') {
    return profileCardTemplate
  } else {
    return categoryCardTemplate
  }
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

function loadProjectUpdateCount(){
  let projects = $('.project-card')
  console.log(projects)
  projects.each( (i, el) => {
      let projectId = $(el).data('id')
      let projectPath = $(el).data('path')
      let url = `/project/${projectId}`
      $.getJSON(url, (data) => {
        $(`*[data-path="${projectPath}"]`).attr('data-updates', data.total)
        showUpdateCount(projectPath)
      })
  })

}
function showUpdateCount(projectPath){
  let value = $(`*[data-path="${projectPath}"]`).attr('data-updates')
  console.log(projectPath, value)
  $(`*[data-path="${projectPath}"]`).find('.project__updates span').text(value)
  $(`*[data-path="${projectPath}"]`).find('.project__updates').removeClass('project__updates--hidden')
}
