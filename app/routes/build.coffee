`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { build_id: id }

  setupController: (controller, model) ->
    if model && !model.get
      model = @store.recordForId('build', model)
      @store.find('build', model)

    repo = @controllerFor('repo')
    @controllerFor('build').set('build', model)
    repo.activate('build')

  model: (params) ->
    @store.find('build', params.build_id)

  deactivate: ->
    @controllerFor('job').set('job', null)
    @controllerFor('build').set('build', null)

`export default Route`
