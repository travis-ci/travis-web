`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  titleToken: (model) ->
    "Job ##{model.get('number')}"

  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { job_id: id }

  setupController: (controller, model) ->
    if model && !model.get
      model = @store.recordForId('job', model)
      @store.find('job', model)

    repo = @controllerFor('repo')
    @controllerFor('job').set('job', model)
    repo.activate('job')

    buildController = @controllerFor('build')

    model.get('repo')
    if buildPromise = model.get('build')
      buildPromise.then (build) =>
        build = @store.recordForId('build', build.get('id'))
        buildController.set('build', build)

    # this is a hack to not set favicon changes from build
    # controller while we're viewing job, this should go away
    # after refactoring of controllers
    buildController.set('sendFaviconStateChanges', false)

  model: (params) ->
    @store.find('job', params.job_id)

  deactivate: ->
    buildController = @controllerFor('build')
    buildController.set('sendFaviconStateChanges', true)
    @controllerFor('build').set('build', null)
    @controllerFor('job').set('job', null)

    @_super.apply(this, arguments)

`export default Route`
