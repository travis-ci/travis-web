Travis.RepoController = Travis.Controller.extend
  bindings: []
  needs: ['repos', 'currentUser']
  currentUserBinding: 'controllers.currentUser'

  slug: (-> @get('repo.slug') ).property('repo.slug')
  isLoading: (-> @get('repo.isLoading') ).property('repo.isLoading')

  init: ->
    @_super.apply this, arguments
    Visibility.every Travis.INTERVALS.updateTimes, @updateTimes.bind(this)

  updateTimes: ->
    if builds = @get('builds')
      builds.forEach (b) -> b.updateTimes()

    if build = @get('controllers.build.build')
      build.updateTimes()

    if build && jobs = build.get('jobs')
      jobs.forEach (j) -> j.updateTimes()

  activate: (action) ->
    this["view#{$.camelize(action)}"]()

  viewIndex: ->
    @connectTab('current')

  viewCurrent: ->
    @connectTab('current')

  viewBuilds: ->
    @connectTab('builds')

  viewPullRequests: ->
    @connectTab('pull_requests')

  viewBranches: ->
    @connectTab('branches')

  viewBuild: ->
    @connectTab('build')

  viewJob: ->
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

  urlGithub: (->
    Travis.Urls.githubRepo(@get('repo.slug'))
  ).property('repo.slug')
