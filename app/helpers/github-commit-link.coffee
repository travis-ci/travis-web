`import { formatCommit, safe } from 'travis/utils/helpers'`
`import { githubCommit as githubCommitUrl } from 'travis/utils/urls'`

helper = Ember.Handlebars.makeBoundHelper (slug, commitSha) ->
  return '' unless commitSha
  sha = Ember.Handlebars.Utils.escapeExpression formatCommit(commitSha)
  return sha unless slug
  url = Ember.Handlebars.Utils.escapeExpression githubCommitUrl(slug, sha)

  safe '<a class="github-link only-on-hover" href="' + url + '">' + sha + '</a>'

`export default helper`
