require 'routes/route'
require 'models/build'

Build = Travis.Build
TravisRoute = Travis.Route

Route = TravisRoute.extend
  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { build_id: id }

  setupController: (controller, model) ->
    model = Build.find(model) if model && !model.get

    repo = @controllerFor('repo')
    #repo.set('build', model)
    @controllerFor('build').set('build', model)
    repo.activate('build')
    #repo.set('build', model)

  model: (params) ->
    Build.fetch(params.build_id)

  deactivate: ->
    @controllerFor('job').set('job', null)
    @controllerFor('build').set('build', null)

Travis.BuildRoute = Route
