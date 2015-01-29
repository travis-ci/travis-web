require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  needsAuth: true
  setupController: ->
    @_super.apply this, arguments

    @controllerFor('repo').activate('requests')

  model: ->
    @store.find 'request', repository_id: @modelFor('repo').get('id')

Travis.RequestsRoute = Route
