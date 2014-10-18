@Travis.Urls =
  plainTextLog: (id) ->
    "#{Travis.config.api_endpoint}/jobs/#{id}/log.txt?deansi=true"

  githubPullRequest: (slug, pullRequestNumber) ->
    "#{Travis.config.source_endpoint}/#{slug}/pull/#{pullRequestNumber}"

  githubCommit: (slug, sha) ->
    "#{Travis.config.source_endpoint}/#{slug}/commit/#{sha}"

  githubRepo: (slug) ->
    "#{Travis.config.source_endpoint}/#{slug}"

  githubWatchers: (slug) ->
    "#{Travis.config.source_endpoint}/#{slug}/watchers"

  githubNetwork: (slug) ->
    "#{Travis.config.source_endpoint}/#{slug}/network"

  githubAdmin: (slug) ->
    "#{Travis.config.source_endpoint}/#{slug}/settings/hooks#travis_minibucket"

  statusImage: (slug, branch) ->
    "#{location.protocol}//#{location.host}/#{slug}.svg" + if branch then "?branch=#{encodeURIComponent(branch)}" else ''

  ccXml: (slug) ->
    "#{Travis.config.api_endpoint}/repos/#{slug}/cc.xml"

  email: (email) ->
    "mailto:#{email}"

  gravatarImage: (email, size) ->
    "https://www.gravatar.com/avatar/#{md5(email)}?s=#{size}&d=#{encodeURIComponent(Travis.config.avatar_default_url)}"
