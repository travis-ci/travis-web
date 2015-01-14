require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  model: ->
    repo = @modelFor('repo')
    repo.fetchSettings().then (settings) ->
      repo.set('settings', settings)

Travis.SettingsIndexRoute = Route
