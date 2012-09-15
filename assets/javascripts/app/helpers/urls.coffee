@Travis.Urls =
  repository: (slug) ->
    "/#{slug}"

  builds: (slug) ->
    "/#{slug}/builds"

  pullRequests: (slug) ->
    "/#{slug}/pull_requests"

  branches: (slug) ->
    "/#{slug}/branches"

  build: (slug, id) ->
    "/#{slug}/builds/#{id}"

  job: (slug, id) ->
    "/#{slug}/jobs/#{id}"

  githubCommit: (slug, sha) ->
    "http://github.com/#{slug}/commit/#{sha}"

  githubRepository: (slug) ->
    "http://github.com/#{slug}"

  githubWatchers: (slug) ->
    "http://github.com/#{slug}/watchers"

  githubNetwork: (slug) ->
    "http://github.com/#{slug}/network"

  githubAdmin: (slug) ->
    "http://github.com/#{slug}/admin/hooks#travis_minibucket"

  statusImage: (slug, branch) ->
    "https://secure.travis-ci.org/#{slug}.png" + if branch then "?branch=#{branch}" else ''

  email: (email) ->
    "mailto:#{email}"

  account: (login) ->
    "/profile/#{login}"

