require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  needsAuth: true
  setupController: (controller, model) ->
    @controllerFor('repo').activate('settings')

Travis.SettingsRoute = Route
