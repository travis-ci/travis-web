require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  redirect: ->
    @transitionTo("main.repositories")

Travis.MainMyRepositoriesRoute = Route
