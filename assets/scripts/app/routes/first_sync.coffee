require 'routes/route'
require 'routes/simple_layout'

SimpleLayoutRoute = Travis.SimpleLayoutRoute

Route = SimpleLayoutRoute.extend
  actions:
    redirectToGettingStarted: ->
      # do nothing, we are showing first sync, so it's normal that there is
      # no owned repos

Travis.FirstSyncRoute = Route
