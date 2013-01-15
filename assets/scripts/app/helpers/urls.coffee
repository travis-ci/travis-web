@Travis.Urls =
  plainTextLog: (id) ->
    "#{Travis.config.api_endpoint}/artifacts/#{id}.txt?deansi=true"

  githubPullRequest: (slug, pullRequestNumber) ->
    "http://github.com/#{slug}/pull/#{pullRequestNumber}"

  githubCommit: (slug, sha) ->
    "http://github.com/#{slug}/commit/#{sha}"

  githubRepo: (slug) ->
    "http://github.com/#{slug}"

  githubWatchers: (slug) ->
    "http://github.com/#{slug}/watchers"

  githubNetwork: (slug) ->
    "http://github.com/#{slug}/network"

  githubAdmin: (slug) ->
    "http://github.com/#{slug}/settings/hooks#travis_minibucket"

  statusImage: (slug, branch) ->
    "#{location.protocol}//#{location.host}/#{slug}.png" + if branch then "?branch=#{branch}" else ''

  email: (email) ->
    "mailto:#{email}"
