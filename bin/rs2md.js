#!/usr/bin/env node

const cli = require('commander')
const package = require('../package.json')
const parser = require('./index')

cli
	.version(package.version)
	.description(package.description)
	.option('-t, --token <token>', 'GitHub access token.')
	.option('-u, --username <username>', 'GitHub username.')
	.option('-p, --password <password>', 'GitHub password.')
	.option('--include-forks', 'Include forked repositories.')
	.option('--headline-depth <"##">', 'What typ of headline to use in the markdown.')
	.parse(process.argv)

const options = {
	includeForks: cli.includeForks || false,
	token: cli.token || '',
	authentication: cli.token ? 'oauth' : 'baisc',
	username: cli.username || '',
	password: cli.password || '',
	headline: cli.headlineDepth || '##'
}

parser(options, markdown => {
	process.stdout.write(markdown)
})
