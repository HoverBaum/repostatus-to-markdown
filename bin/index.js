const GitHubApi = require("github")
const github = new GitHubApi()

const defaultOptions = {
	includeForks: false,
	headline: '##'
}

module.exports = function parseRepos(options = defaultOptions, callback) {

	if(options.token) {
		github.authenticate({
			type: 'oauth',
			token: options.token
		})
	} else {
		github.authenticate({
			type: 'basic',
			username: options.username,
			password: options.password
		})
	}


	github.repos.getAll({
	    affiliation: 'owner'
	}, function(err, res) {

		//Create an array of promises getting the repos readmes.
	    const promises = res.filter(repo => forkFilter(repo, !options.includeForks))
	        .map(addReame)

		//When all readmes are here handle the repos.
	    Promise.all(promises).then(repos => {
	        const parsedRepos = repos.map(addStatus)
	        const markdown = createMarkdown(parsedRepos, options.headline)
			callback(markdown);
	    }).catch(e => {
	        console.log(e);
	    })
	})
}

/**
 *   Filter forks out.
 *   @param  {Object} repo    - Currently visited repo.
 *   @param  {Boolean} active - If the filter is active.
 *   @return {Object}         - The filter result.
 */
function forkFilter(repo, active) {
	if(active && repo.fork) {
		return
	} else {
		return repo
	}
}

/**
 *   Add the readme of a repository.
 *   @param {Object} repo - The repo to work on.
 */
function addReame(repo) {
    return new Promise((resolve, reject) => {
        github.repos.getReadme({
            user: repo.owner.login,
            repo: repo.name
        }).then(readme => {
            repo.readme = new Buffer(readme.content, 'base64').toString("utf8")
            resolve(repo)
        }).catch(err => {
            if (err.code === 404) {

                //Add a placeholder empty readme if none present.
                //This helps down the line, we can assume that there is a readme.
                repo.readme = ''
                resolve(repo)
            } else {
                reject(err)
            }
        })
    })
}

/**
 *   Add a repos status to it's object.
 *   @param {Object} repo - The repo to add a status to.
 */
function addStatus(repo) {
    const status = /http[s]?:\/\/.*repostatus\.org\/badges\/(.+)\/(.+)\.svg/g.exec(repo.readme)
    if (status === null) {
        repo.status = 'no status'
    } else {
        repo.status = status[2]
    }
    return repo
}

//All possible statuses.
const statuses = [
    'active',
    'inactive',
    'unsupported',
    'wip',
    'concept',
    'suspended',
    'abandoned',
	'no status'
]

/**
 *   Create markdown representation from repos statuses.
 *   @param  {Array} repos     - All repos with information added.
 *   @param  {String} headline - The type of headline to use.
 *   @return {String}          - Markdown formatted overview of all repos.
 */
function createMarkdown(repos, headline) {
    let md = ``
    statuses.forEach(status => {

		//Only handle Statuses that have repos.
		if(repos.filter(repo => repo.status === status).length === 0) {
			return
		}
        md += `\n${headline} ${titleCase(status)}\n\n`
        repos.filter(repo => repo.status === status)
			.map(repo => {
				md += `[**${repo.name}**](${repo.url}) ${repo.description}\n\n`
			})
    })
	return md
}

/**
 *   Capitalize the first letter of a string.
 *   @param  {Stroing} string - String to capitalize.
 *   @return {String}         - The capitalized string.
 */
function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
