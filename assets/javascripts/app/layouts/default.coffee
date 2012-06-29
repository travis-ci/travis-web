Travis.Layout.Default = Travis.Layout.extend
  init: ->
    @_super()
    @connectLeft(Travis.Repository.find())

  viewIndex: (params) ->
    repositories = @get('repositories')
    onceLoaded repositories, =>
      repository = repositories.get('firstObject')
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


  connectLeft: (repositories) ->
    @set('repositories', repositories)
    @get('applicationController').connectOutlet(outletName: 'left', name: 'repositories', context: repositories)

  connectRepository: (repository) ->
    @set('repository', repository)
    @get('applicationController').connectOutlet(outletName: 'main', name: 'repository', context: repository)

  connectTabs: (build, job) ->
    @setPath('tabsController.repository', @get('repository'))
    @setPath('tabsController.build', build)
    @setPath('tabsController.job', job)
    @get('repositoryController').connectOutlet(outletName: 'tabs', name: 'tabs')

  connectBuilds: (builds) ->
    @get('repositoryController').connectOutlet(outletName: 'tab', name: 'history', context: builds)

  connectBuild: (build) ->
    @get('repositoryController').connectOutlet(outletName: 'tab', name: 'build', context: build)

  connectJob: (job) ->
    @get('repositoryController').connectOutlet(outletName: 'tab', name: 'job', context: job)


