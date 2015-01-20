plainTextLog = (id) ->
  "#{Travis.config.api_endpoint}/jobs/#{id}/log.txt?deansi=true"

githubPullRequest = (slug, pullRequestNumber) ->
  "#{Travis.config.source_endpoint}/#{slug}/pull/#{pullRequestNumber}"

githubCommit = (slug, sha) ->
  "#{Travis.config.source_endpoint}/#{slug}/commit/#{sha}"

githubRepo = (slug) ->
  "#{Travis.config.source_endpoint}/#{slug}"

githubWatchers = (slug) ->
  "#{Travis.config.source_endpoint}/#{slug}/watchers"

githubNetwork = (slug) ->
  "#{Travis.config.source_endpoint}/#{slug}/network"

githubAdmin = (slug) ->
  "#{Travis.config.source_endpoint}/#{slug}/settings/hooks#travis_minibucket"

statusImage = (slug, branch) ->
  if Travis.config.pro
    token = Travis.__container__.lookup('controller:currentUser').get('token')
    "#{location.protocol}//#{location.host}/#{slug}.svg?token=#{token}" + if branch then "&branch=#{branch}" else ''
  else
    "#{location.protocol}//#{location.host}/#{slug}.svg" + if branch then "?branch=#{encodeURIComponent(branch)}" else ''

ccXml = (slug) ->
  if Travis.config.pro
    token = Travis.__container__.lookup('controller:currentUser').get('token')
    "##{Travis.config.api_endpoint}/repos/#{slug}/cc.xml?token=#{token}"
  else
    "#{Travis.config.api_endpoint}/repos/#{slug}/cc.xml"

email = (email) ->
  "mailto:#{email}"

gravatarImage = (email, size) ->
  "https://www.gravatar.com/avatar/#{md5(email)}?s=#{size}&d=#{encodeURIComponent(Travis.config.avatar_default_url)}"

Travis.Urls = {
  plainTextLog: plainTextLog,
  githubPullRequest: githubPullRequest,
  githubCommit: githubCommit,
  githubRepo: githubRepo,
  githubWatchers: githubWatchers,
  githubNetwork: githubNetwork,
  githubAdmin: githubAdmin,
  statusImage: statusImage,
  ccXml: ccXml,
  email: email
}
