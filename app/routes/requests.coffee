require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  needsAuth: true
  setupController: ->
    @_super.apply this, arguments

    @controllerFor('repo').activate('requests')

  model: ->
    @store.find 'request', repository_id: @modelFor('repo').get('id')

Travis.RequestsRoute = Route
