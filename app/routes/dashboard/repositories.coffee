`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  queryParams:
    filter: { replace: true }
  model: ->
    apiEndpoint = config.apiEndpoint
    $.ajax(apiEndpoint + '/v3/repos?repository.active=true&include=repository.default_branch,build.commit', {
      headers: {
        Authorization: 'token ' + @auth.token()
      }
    }).then (response) ->
      response.repositories.filter( (repo) ->
        if repo.default_branch
          repo.default_branch.last_build
      ).map( (repo) ->
        Ember.Object.create(repo)
      ).sortBy('default_branch.last_build.finished_at')

`export default Route`
