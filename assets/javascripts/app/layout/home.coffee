require 'layout/base'

Travis.Layout.Home = Travis.Layout.Base.extend
  name: 'home'

  init: ->
    @_super('top', 'repositories', 'repository', 'tabs', 'builds', 'build', 'job')
    @connectLeft(Travis.Repository.find())
    Travis.Layout.Sidebar.create(homeController: @get('homeController'))

  viewIndex: (params) ->
    onceLoaded @repositories, =>
      repository = @repositories.get('firstObject')
      @connectRepository(repository)
      @connectTabs('current')
      @connectBuild(repository.get('lastBuild'))

  viewCurrent: (params) ->
    @viewRepository params, (repository) =>
      @connectTabs('current')
      @connectBuild(repository.get('lastBuild'))

  viewBuilds: (params) ->
    @viewRepository params, (repository) =>
      @connectTabs('builds')
      @connectBuilds(repository.get('builds'))

  viewBuild: (params) ->
    @viewRepository params
    @buildBy params.id, (build) =>
      @connectTabs('build', build)
      @connectBuild(build)

  viewJob: (params) ->
    @viewRepository params
    @jobBy params.id, (job) =>
      @connectTabs('job', job.get('build'), job)
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
    @repositories = repositories
    @homeController.connectOutlet(outletName: 'left', name: 'repositories', context: repositories)

  connectRepository: (repository) ->
    @repository = repository
    @homeController.connectOutlet(outletName: 'main', name: 'repository', context: repository)

  connectTabs: (tab, build, job) ->
    @tabsController.set('tab', tab)
    @tabsController.set('repository', @repository)
    @tabsController.set('build', build)
    @tabsController.set('job', job)
    @homeController.connectOutlet(outletName: 'tabs', name: 'tabs')

  connectBuilds: (builds) ->
    @homeController.connectOutlet(outletName: 'tab', name: 'builds', context: builds)

  connectBuild: (build) ->
    @homeController.connectOutlet(outletName: 'tab', name: 'build', context: build)

  connectJob: (job) ->
    @homeController.connectOutlet(outletName: 'tab', name: 'job', context: job)


