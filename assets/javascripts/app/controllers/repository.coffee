Travis.RepositoryController = Travis.Controller.extend
  bindings: []

  init: ->
    @_super('builds', 'build', 'job')

  activate: (action, params) ->
    @_unbind()
    this["view#{$.camelize(action)}"]()
    @set('params', params)

  viewIndex: ->
    @connectTab('current')
    @_bind('repository', 'controllers.repositoriesController.firstObject')
    @_bind('build', 'repository.lastBuild')

  viewCurrent: ->
    @connectTab('current')
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('build', 'repository.lastBuild')

  viewBuilds: ->
    @connectTab('builds')
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('builds', 'repository.builds')

  viewBuild: ->
    @connectTab('build')
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('build', 'buildById')

  viewJob: ->
    @connectTab('job')
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('build', 'job.build')
    @_bind('job', 'jobById')

  repositoriesByParams: (->
    Travis.Repository.bySlug("#{params.owner}/#{params.name}") if params = @get('params')
  ).property('params')

  buildById: (->
    Travis.Build.find(id) if id = @getPath('params.id')
  ).property('params.id')

  jobById: (->
    Travis.Job.find(id) if id = @getPath('params.id')
  ).property('params.id')

  connectTab: (tab) ->
    @set('tab', tab)
    name = if tab == 'current' then 'build' else tab
    @connectOutlet(outletName: 'pane', controller: this, viewClass: Travis["#{$.camelize(name)}View"])

  _bind: (to, from) ->
    @bindings.push Ember.oneWay(this, to, from)

  _unbind: ->
    binding.disconnect(this) for binding in @bindings
    @bindings.length = 0

