require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  model: (params) ->
    repo = @modelFor('repo')
    repo.get('envVars.promise')

Travis.EnvVarsRoute = Route
