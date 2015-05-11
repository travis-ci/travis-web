`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  queryParams:
    filter: { replace: true }
  model: ->
    apiEndpoint = config.apiEndpoint
    console.log(@auth)
    $.ajax(apiEndpoint + '/v3/repos?repository.active=true', {
    # $.ajax(apiEndpoint + '/v3/#{params.owner}?include=user.repositories,organization.repositories,build.commit', {
      headers: {
        Authorization: 'token ' + @auth.token()
      }
    }).then (response) ->
      response.repositories.sortBy('last_build.finished_at').filter( (repo) ->
        repo.last_build
      ).sort( (a, b) ->
        if !a.last_build.finished_at || a.last_build.finished_at > b.last_build.finished_at
          return -1
        else if !b.last_build.finished_at || b.last_build.finished_at > a.last_build.finished_at
          return 1
        else
          return 0
      ).map( (repo) ->
        Ember.Object.create(repo)
      )

`export default Route`
