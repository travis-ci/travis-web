Travis.RepoController = Travis.Controller.extend
  bindings: []

  init: ->
    @_super.apply this, arguments
    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)
    @set 'builds', Em.ArrayProxy.create(Em.SortableMixin,
      isLoadedBinding: 'content.isLoaded'
      sortProperties: ['number']
      sortAscending: false
      content: []
      isLoadingBinding: 'content.isLoading'
      load: (records) ->
        content = @get('content')
        if content && content.load
          content.load(records)
    )

  updateTimes: ->
    if builds = @get('builds')
      builds.forEach (b) -> b.updateTimes()

    if build = @get('build')
      build.updateTimes()

    if build && jobs = build.get('jobs')
      jobs.forEach (j) -> j.updateTimes()

    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  activate: (action) ->
    @_unbind()
    this["view#{$.camelize(action)}"]()

  viewIndex: ->
    @_bind('repo', 'controllers.reposController.firstObject')
    @_bind('build', 'repo.lastBuild')
    @connectTab('current')

  viewCurrent: ->
    @connectTab('current')
    @_bind('build', 'repo.lastBuild')

  viewBuilds: ->
    @connectTab('builds')
    @_bind('builds.content', 'repo.builds')

  viewPullRequests: ->
    @connectTab('pull_requests')
    @_bind('builds.content', 'repo.pullRequests')

  viewBranches: ->
    @connectTab('branches')
    @_bind('builds.content', 'repo.branches')

  viewEvents: ->
    @connectTab('events')
    @_bind('events', 'repo.events')

  viewBuild: ->
    @connectTab('build')

  viewJob: ->
    @_bind('build', 'job.build')
    @connectTab('job')

  repoObserver: (->
    repo = @get('repo')
    repo.select() if repo
  ).observes('repo.id')

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
    @bindings.clear()
