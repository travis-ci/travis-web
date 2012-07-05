require 'layout/base'

Travis.Layout.Home = Travis.Layout.Base.extend
  name: 'home'
  bindings: []

  init: ->
    @_super('repositories', 'repository', 'tabs', 'builds', 'build', 'job')
    # Travis.Layout.Sidebar.create(parent: @controller)

    @controller.connectOutlet(outletName: 'left', name: 'repositories')
    @controller.connectOutlet(outletName: 'main', name: 'repository')
    @controller.connectOutlet(outletName: 'tabs', name: 'tabs')

    @set('repositories', Travis.Repository.find())

  activate: (action, params) ->
    @_unbind()
    @set('tab', if action == 'index' then 'current' else action)
    @_super(action, params)

  viewIndex: ->
    @_bind('repository', 'repositories.firstObject')
    @_bind('build', 'repository.lastBuild')
    @connectTab('build')

  viewCurrent: ->
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('build', 'repository.lastBuild')
    @connectTab('build')

  viewBuilds: ->
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('builds', 'repository.builds')
    @connectTab('builds')

  viewBuild: ->
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('build', 'buildById')
    @connectTab('build')

  viewJob: ->
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('build', 'job.build')
    @_bind('job', 'jobById')
    @connectTab('job')

  repositoriesByParams: (->
    Travis.Repository.bySlug("#{params.owner}/#{params.name}") if params = @get('params')
  ).property('params')

  buildById: (->
    Travis.Build.find(id) if id = @getPath('params.id')
  ).property('params.id')

  jobById: (->
    Travis.Job.find(id) if id = @getPath('params.id')
  ).property('params.id')

  _bind: (to, from) ->
    @bindings.push Ember.oneWay(this, to, from)

  _unbind: ->
    binding.disconnect(this) for binding in @bindings
    @bindings.length = 0

  connectTab: (tab) ->
    @controller.connectOutlet(outletName: 'tab', name: tab)

