Travis.RepoController = Travis.Controller.extend
  bindings: []
  needs: ['repos', 'currentUser']
  currentUserBinding: 'controllers.currentUser'

  isError: (-> @get('repo.isError') ).property('repo.isError')
  slug: (-> @get('repo.slug') ).property('repo.slug')
  isLoading: (-> @get('repo.isLoading') ).property('repo.isLoading')

  init: ->
    @_super.apply this, arguments
    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

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
    @_bind('repo', 'controllers.repos.firstObject')
    @_bind('build', 'repo.lastBuild')
    @connectTab('current')

  viewCurrent: ->
    @connectTab('current')
    @_bind('build', 'repo.lastBuild')

  viewBuilds: ->
    @connectTab('builds')
    @_bind('builds', 'repo.builds')

  viewPullRequests: ->
    @connectTab('pull_requests')
    @_bind('builds', 'repo.pullRequests')

  viewBranches: ->
    @connectTab('branches')
    @_bind('builds', 'repo.branches')

  viewEvents: ->
    @connectTab('events')
    @_bind('events', 'repo.events')

  viewBuild: ->
    @connectTab('build')

  viewJob: ->
    @_bind('build', 'job.build')
    @connectTab('job')

  connectTab: (tab) ->
    # TODO: such implementation seems weird now, because we render
    #       in the renderTemplate function in routes
    name = if tab == 'current' then 'build' else tab
    viewClass = if name in ['builds', 'branches', 'pull_requests']
      Travis.BuildsView
    else
      Travis["#{$.camelize(name)}View"]

    @set('tab', tab)

  _bind: (to, from) ->
    @bindings.push Ember.oneWay(this, to, from)

  _unbind: ->
    binding.disconnect(this) for binding in @bindings
    @bindings.clear()

  urlGithub: (->
    Travis.Urls.githubRepo(@get('repo.slug'))
  ).property('repo.slug')
