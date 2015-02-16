`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  setupController: ->
    @_super.apply this, arguments

    @controllerFor('repo').activate('requests')

  model: ->
    @store.find 'request', repository_id: @modelFor('repo').get('id')

`export default Route`
