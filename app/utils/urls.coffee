`import config from 'travis/config/environment'`

plainTextLog = (id) ->
  "#{config.api_endpoint}/jobs/#{id}/log.txt?deansi=true"

githubPullRequest = (slug, pullRequestNumber) ->
  "#{config.source_endpoint}/#{slug}/pull/#{pullRequestNumber}"

githubCommit = (slug, sha) ->
  "#{config.source_endpoint}/#{slug}/commit/#{sha}"

githubRepo = (slug) ->
  "#{config.source_endpoint}/#{slug}"

githubWatchers = (slug) ->
  "#{config.source_endpoint}/#{slug}/watchers"

githubNetwork = (slug) ->
  "#{config.source_endpoint}/#{slug}/network"

githubAdmin = (slug) ->
  "#{config.source_endpoint}/#{slug}/settings/hooks#travis_minibucket"

statusImage = (slug, branch) ->
  if config.pro
    token = Travis.__container__.lookup('controller:currentUser').get('token')
    "#{location.protocol}//#{location.host}/#{slug}.svg?token=#{token}" + if branch then "&branch=#{branch}" else ''
  else
    "#{location.protocol}//#{location.host}/#{slug}.svg" + if branch then "?branch=#{encodeURIComponent(branch)}" else ''

ccXml = (slug) ->
  if config.pro
    token = Travis.__container__.lookup('controller:currentUser').get('token')
    "##{config.api_endpoint}/repos/#{slug}/cc.xml?token=#{token}"
  else
    "#{config.api_endpoint}/repos/#{slug}/cc.xml"

email = (email) ->
  "mailto:#{email}"

gravatarImage = (email, size) ->
  "https://www.gravatar.com/avatar/#{md5(email)}?s=#{size}&d=#{encodeURIComponent(config.avatar_default_url)}"

`export { plainTextLog, githubPullRequest, githubCommit, githubRepo, githubWatchers, githubNetwork, githubAdmin, statusImage, ccXml, email, gravatarImage }`
