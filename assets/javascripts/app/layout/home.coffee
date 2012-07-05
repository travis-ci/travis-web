require 'layout/base'

Travis.Layout.Home = Travis.Layout.Base.extend
  name: 'home'

  init: ->
    @_super('repositories', 'repository', 'tabs', 'builds', 'build', 'job')
    # Travis.Layout.Sidebar.create(parent: @controller)

    @controller.connectOutlet(outletName: 'left', name: 'repositories')
    @controller.connectOutlet(outletName: 'main', name: 'repository')
    @controller.connectOutlet(outletName: 'tabs', name: 'tabs')

    @set('repositories', Travis.Repository.find())

  activate: (action, params) ->
    @set('tab', if action == 'index' then 'current' else action)
    @_super(action, params)

  viewIndex: ->
    @bindRepository('repositories.firstObject')
    @bindBuild('repository.lastBuild')
    @connectTab('build')

  viewCurrent: ->
    @bindRepository('repositoryByParams')
    @bindBuild('repository.lastBuild')
    @connectTab('build')

  viewBuilds: ->
    @bind('repository', 'repositoriesByParams.firstObject')
    @bind('builds', 'repository.builds')
    @connectTab('builds')

  viewBuild: ->
    @bindRepository('repositoryByParams')
    @bindBuild('buildById')
    @connectTab('build')

  viewJob: ->
    @bindRepository('repositoryByParams')
    @bindJob('jobById')
    @connectTab('job')

  repositoryByParamsBinding: 'repositoriesByParams.firstObject'

  repositoriesByParams: (->
    console.log('repositoriesByParams', @getPath('params.owner'), @getPath('params.name'))
    Travis.Repository.bySlug("#{params.owner}/#{params.name}") if params = @get('params')
  ).property('params')

  buildById: (->
    console.log('buildByParams', @getPath('params.id'))
    Travis.Build.find(id) if id = @getPath('params.id')
  ).property('params.id')

  jobById: (->
    console.log('jobByParams', @getPath('params.id'))
    Travis.Job.find(id) if id = @getPath('params.id')
  ).property('params.id')

  bindRepository: (from) ->
    Ember.oneWay(this, 'repository', from)

  bindBuild: (from) ->
    Ember.oneWay(this, 'build', from)

  connectTab: (tab) ->
    @controller.connectOutlet(outletName: 'tab', name: tab)

