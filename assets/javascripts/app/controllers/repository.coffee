Travis.RepositoryController = Travis.Controller.extend
  bindings: []
  params: {}

  init: ->
    @_super('builds', 'build', 'job')
    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  updateTimes: ->
    if builds = @get('builds')
      builds.forEach (b) -> b.updateTimes()

    if build = @get('build')
      build.updateTimes()
      build.get('jobs').forEach (j) -> j.updateTimes()

    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  activate: (action, params) ->
    @_unbind()
    @setParams(params)
    this["view#{$.camelize(action)}"]()

  viewIndex: ->
    @_bind('repository', 'controllers.repositoriesController.firstObject')
    @_bind('build', 'repository.lastBuild')
    @connectTab('current')

  viewCurrent: ->
    @connectTab('current')
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('build', 'repository.lastBuild')

  viewBuilds: ->
    @connectTab('builds')
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('builds', 'repository.builds')

  viewPullRequests: ->
    @connectTab('pull_requests')
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('builds', 'repository.pullRequests')

  viewBranches: ->
    @connectTab('branches')
    @_bind('repository', 'repositoriesByParams.firstObject')
    @_bind('builds', 'repository.branches')

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
    Travis.Repository.bySlug("#{@get('params.owner')}/#{@get('params.name')}")
  ).property('params.owner', 'params.name')

  buildById: (->
    Travis.Build.find(id) if id = @get('params.id')
  ).property('params.id')

  jobById: (->
    Travis.Job.find(id) if id = @get('params.id')
  ).property('params.id')

  connectTab: (tab) ->
    name = if tab == 'current' then 'build' else tab
    viewClass = if name in ['builds', 'branches', 'pull_requests']
      Travis.BuildsView
    else
      Travis["#{$.camelize(name)}View"]

    @set('tab', tab)
    @connectOutlet(outletName: 'pane', controller: this, viewClass: viewClass)

  setParams: (params) ->
    # TODO if we just @set('params', params) it will update the repositoriesByParams property
    @set("params.#{key}", params[key]) for key, value of params

  _bind: (to, from) ->
    @bindings.push Ember.oneWay(this, to, from)

  _unbind: ->
    binding.disconnect(this) for binding in @bindings
    @bindings.length = 0

