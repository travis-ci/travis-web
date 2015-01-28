require 'routes/route'
require 'models/job'

TravisRoute = Travis.Route

Route = TravisRoute.extend
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

    if build = model.get('build')
      build = @store.recordForId('build', build.get('id'))
      @controllerFor('build').set('build', build)

  model: (params) ->
    @store.find('job', params.job_id)

  deactivate: ->
    @controllerFor('build').set('build', null)
    @controllerFor('job').set('job', null)

Travis.JobRoute = Route
