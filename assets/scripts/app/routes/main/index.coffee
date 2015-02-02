require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  redirect: ->
    target = if @signedIn() then 'repositories' else 'recent'
    @transitionTo("main.#{target}")

Travis.MainIndexRoute = Route
