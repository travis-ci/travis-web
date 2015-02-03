`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  queryParams:
    filter: { replace: true }
  model: ->
    apiEndpoint = @get('config').api_endpoint
    $.ajax(apiEndpoint + '/v3/repos?repository.active=true', {
      headers: {
        Authorization: 'token ' + @auth.token()
      }
    }).then (response) ->
      response.repositories.sortBy('last_build.finished_at').map( (repo) ->
        Ember.Object.create(repo)
      )

`export default Route`
