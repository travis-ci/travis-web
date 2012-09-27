Travis.RepositoryController = Travis.Controller.extend
  bindings: []

  init: ->
    @_super.apply this, arguments
    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  updateTimes: ->
    if builds = @get('builds')
      builds.forEach (b) -> b.updateTimes()

    if build = @get('build')
      build.updateTimes()
      build.get('jobs').forEach (j) -> j.updateTimes()

    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  activate: (action) ->
    @_unbind()
    this["view#{$.camelize(action)}"]()

  viewIndex: ->
    @_bind('repository', 'controllers.repositoriesController.firstObject')
    @_bind('build', 'repository.lastBuild')
    @connectTab('current')

  viewCurrent: ->
    @connectTab('current')
    @_bind('build', 'repository.lastBuild')

  viewBuilds: ->
    @connectTab('builds')
    @_bind('builds', 'repository.builds')

  viewPullRequests: ->
    @connectTab('pull_requests')
    @_bind('builds', 'repository.pullRequests')

  viewBranches: ->
    @connectTab('branches')
    @_bind('builds', 'repository.branches')

  viewBuild: ->
    @connectTab('build')

  viewJob: ->
    @_bind('build', 'job.build')
    @connectTab('job')

  repositoryObserver: (->
    repository = @get('repository')
    repository.select() if repository
  ).observes('repository.id')

  connectTab: (tab) ->
    name = if tab == 'current' then 'build' else tab
    viewClass = if name in ['builds', 'branches', 'pull_requests']
      Travis.BuildsView
    else
      Travis["#{$.camelize(name)}View"]

    @set('tab', tab)
    @connectOutlet(outletName: 'pane', controller: this, viewClass: viewClass)

  _bind: (to, from) ->
    @bindings.push Ember.oneWay(this, to, from)

  _unbind: ->
    binding.disconnect(this) for binding in @bindings
    @bindings.length = 0

