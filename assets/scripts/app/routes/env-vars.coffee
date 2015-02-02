require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  model: (params) ->
    repo = @modelFor('repo')
    repo.get('envVars.promise')

Travis.EnvVarsRoute = Route
