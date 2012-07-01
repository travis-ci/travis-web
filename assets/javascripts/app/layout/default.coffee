require 'layout/base'

Travis.Layout.Default = Travis.Layout.Base.extend
  name: 'default'

  init: ->
    @_super('top', 'repositories', 'repository', 'tabs', 'build', 'job')
    @connectHead(@currentUser)
    @connectLeft(Travis.Repository.find())
    Travis.Layout.Sidebar.create(defaultController: @get('defaultController'))

  viewIndex: (params) ->
    onceLoaded @repositories, =>
      repository = @repositories.get('firstObject')
      @connectRepository(repository)
      @connectTabs()
      @connectBuild(repository.get('lastBuild'))

  viewCurrent: (params) ->
    @viewRepository params, (repository) =>
      @connectTabs()
      @connectBuild(repository.get('lastBuild'))

  viewBuilds: (params) ->
    @viewRepository params, (repository) =>
      @connectTabs()
      @connectBuilds(repository.get('builds'))

  viewBuild: (params) ->
    @viewRepository params
    @buildBy params.id, (build) =>
      @connectTabs(build)
      @connectBuild(build)

  viewJob: (params) ->
    @viewRepository params
    @jobBy params.id, (job) =>
      @connectTabs(job.get('build'), job)
      @connectJob(job)


  viewRepository: (params, callback) ->
    @repositoryBy params, (repository) =>
      @connectRepository(repository)
      callback(repository) if callback

  repositoryBy: (params, callback) ->
    repositories = Travis.Repository.bySlug("#{params.owner}/#{params.name}")
    onceLoaded repositories, =>
      callback(repositories.get('firstObject'))

  buildBy: (id, callback) =>
    build = Travis.Build.find(id)
    onceLoaded build, =>
      callback(build)

  jobBy: (id, callback) ->
    job = Travis.Job.find(id)
    onceLoaded job, =>
      callback(job)


  connectHead: (user)->
    @defaultController.connectOutlet(outletName: 'top', name: 'top')
    @topController.set('user', user)

  connectLeft: (repositories) ->
    @repositories = repositories
    @defaultController.connectOutlet(outletName: 'left', name: 'repositories', context: repositories)

  connectRepository: (repository) ->
    @repository = repository
    @defaultController.connectOutlet(outletName: 'main', name: 'repository', context: repository)

  connectTabs: (build, job) ->
    @tabsController.set('repository', @repository)
    @tabsController.set('build', @build)
    @tabsController.set('job', @job)
    @repositoryController.connectOutlet(outletName: 'tabs', name: 'tabs')

  connectBuilds: (builds) ->
    @repositoryController.connectOutlet(outletName: 'tab', name: 'builds', context: builds)

  connectBuild: (build) ->
    @repositoryController.connectOutlet(outletName: 'tab', name: 'build', context: build)

  connectJob: (job) ->
    @repositoryController.connectOutlet(outletName: 'tab', name: 'job', context: job)


