require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  redirect: ->
    @transitionTo("main.repositories")

Travis.MainMyRepositoriesRoute = Route
