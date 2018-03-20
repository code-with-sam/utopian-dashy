$.get('/data/sambillingham', (result, res) => {
  // console.log(res, result)
  if(res === 'success') processData(result)
})

function processData(data) {
  let development = data.results.filter(project => project.json_metadata.type === 'development')
  console.log(development)
  let repos = development.map(project => project.json_metadata.repository.name)
  let uniqueProjects = [...new Set(repos)]
  displayProjects(uniqueProjects)
}

function displayProjects(data) {
  data.forEach( (project) => {
    let template = `<div class="project-card"><h2>${project}</h2></div>`
    $('main').append(template)
  })
}
