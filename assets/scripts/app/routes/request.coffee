require 'routes/route'
require 'models/request'

Request = Travis.Request
TravisRoute = Travis.Route

Route = TravisRoute.extend
  setupController: ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('request')

  model: (params) ->
    Request.fetch params.request_id

Travis.RequestRoute = Route
