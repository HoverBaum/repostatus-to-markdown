# repostatus to markdown

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

Create an overview of your repos statuses by parsing [repostatus](http://www.repostatus.org/) badges into a single markdown file listing all your repos.

## Installation

```bash
$ npm install -g repostatus2md
```

## Usage

By default the resulting markdown will be printed to the commandline. This allows to chain rs2md together with other tools. Or you can just save it to a file.

```bash
$ rs2dm -t [your token here] > repos.md
```

```bash
Usage: rs2md [options]

  Create a markdown overview of your repos statuses.

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -t, --token <token>        GitHub access token.
    -u, --username <username>  GitHub username.
    -p, --password <password>  GitHub password.
    --include-forks            Include forked repositories.
    --headline-depth <"##">    What typ of headline to use in the markdown.
```

## Authentication

You need to authenticate with GitHub. You can either enter your username and password or generate a token.

Visit [/settings/token](https://github.com/settings/tokens) to generate a new access token. Make sure it has access to your public repos. Copy it when you see it as you will only get to see it once.
