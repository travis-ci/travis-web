Travis.RepositoryController = Travis.Controller.extend
  bindings: []
  params: {}

  init: ->
    @_super('builds', 'build', 'job')

  activate: (action, params) ->
    @_unbind()
    @setParams(params)
    # console.log "view#{$.camelize(action)}"
    this["view#{$.camelize(action)}"]()

  viewIndex: ->
    @_bind('repository', 'controllers.repositoriesController.firstObject')
    @_bind('build', 'repository.lastBuild')
    @connectTab('current')

  viewCurrent: ->
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('build', 'repository.lastBuild')
    @connectTab('current')

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
    Travis.Repository.bySlug("#{@getPath('params.owner')}/#{@getPath('params.name')}")
  ).property('params.owner', 'params.name')

  buildById: (->
    Travis.Build.find(id) if id = @getPath('params.id')
  ).property('params.id')

  jobById: (->
    Travis.Job.find(id) if id = @getPath('params.id')
  ).property('params.id')

  connectTab: (tab) ->
    unless tab == @get('tab')
      @set('tab', tab)
      name = if tab == 'current' then 'build' else tab
      @connectOutlet(outletName: 'pane', controller: this, viewClass: Travis["#{$.camelize(name)}View"])

  setParams: (params) ->
    # TODO if we just @set('params', params) it will update the repositoriesByParams property
    @setPath("params.#{key}", params[key]) for key, value of params

  _bind: (to, from) ->
    @bindings.push Ember.oneWay(this, to, from)

  _unbind: ->
    binding.disconnect(this) for binding in @bindings
    @bindings.length = 0

