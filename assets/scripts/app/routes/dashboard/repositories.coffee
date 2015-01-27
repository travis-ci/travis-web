require 'routes/route'

TravisRoute = Travis.Route

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

Travis.DashboardRepositoriesRoute = Route
