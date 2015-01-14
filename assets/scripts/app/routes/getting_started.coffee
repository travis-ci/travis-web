require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  renderTemplate: ->
    @render('no_owned_repos')

Travis.GettingStartedRoute = Route
