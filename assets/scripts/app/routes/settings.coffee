require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  needsAuth: true
  setupController: (controller, model) ->
    @controllerFor('repo').activate('settings')

Travis.SettingsRoute = Route
