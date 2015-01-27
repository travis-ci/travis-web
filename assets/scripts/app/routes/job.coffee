require 'routes/route'
require 'models/job'

Job = Travis.Job
TravisRoute = Travis.Route

Route = TravisRoute.extend
  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { job_id: id }

  setupController: (controller, model) ->
    model = @store.find('job', model) if model && !model.get

    repo = @controllerFor('repo')
    @controllerFor('job').set('job', model)
    repo.activate('job')

    if build = model.get('build')
      @controllerFor('build').set('build', build)

  model: (params) ->
    @store.find('job', params.job_id)

  deactivate: ->
    @controllerFor('build').set('build', null)
    @controllerFor('job').set('job', null)

Travis.JobRoute = Route
