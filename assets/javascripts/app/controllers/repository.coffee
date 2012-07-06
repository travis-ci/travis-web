Travis.RepositoryController = Travis.Controller.extend
    bindings: []

    init: ->
      @_super('builds', 'build', 'job')

    activate: (action, params) ->
      @_unbind()
      @set('params', params)
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
      @connectOutlet(outletName: 'pane', name: name)

    _bind: (to, from) ->
      @bindings.push Ember.oneWay(this, to, from)

    _unbind: ->
      binding.disconnect(this) for binding in @bindings
      @bindings.length = 0

