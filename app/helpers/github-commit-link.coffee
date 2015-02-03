formatConfig = Travis.Helpers.formatConfig
githubCommitUrl = Travis.Urls.githubCommit
safe = Travis.Helpers.safe

githubCommitLink = (slug, commitSha) ->
  return '' unless commitSha
  sha = Handlebars.Utils.escapeExpression formatCommit(commitSha)
  return sha unless slug
  url = Handlebars.Utils.escapeExpression githubCommitUrl(slug, sha)

  safe '<a class="github-link only-on-hover" href="' + url + '">' + sha + '</a>'

Travis.Handlebars.githubCommitLink = githubCommitLink
