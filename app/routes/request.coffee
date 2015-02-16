`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  setupController: ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('request')

  model: (params) ->
    @store.find 'request', params.request_id

`export default Route`
