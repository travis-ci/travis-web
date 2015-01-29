require 'routes/route'
require 'models/request'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  setupController: ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('request')

  model: (params) ->
    @store.find 'request', params.request_id

Travis.RequestRoute = Route
