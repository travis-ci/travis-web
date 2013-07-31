Travis.RepoController = Travis.Controller.extend
  needs: ['repos', 'currentUser', 'build']
  currentUserBinding: 'controllers.currentUser'

  build: Ember.computed.alias('controllers.build.build')

  slug: (-> @get('repo.slug') ).property('repo.slug')
  isLoading: (-> @get('repo.isLoading') ).property('repo.isLoading')

  init: ->
    @_super.apply this, arguments
    Visibility.every Travis.INTERVALS.updateTimes, @updateTimes.bind(this)

  updateTimes: ->
    if builds = @get('builds')
      builds.forEach (b) -> b.updateTimes()

    if build = @get('build')
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
    @set('tab', tab)

  urlGithub: (->
    Travis.Urls.githubRepo(@get('repo.slug'))
  ).property('repo.slug')
