require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  redirect: ->
    target = if @signedIn() then 'repositories' else 'recent'
    @transitionTo("main.#{target}")

Travis.MainIndexRoute = Route
