require 'hax0rs'

@Travis.Router = Em.Router.extend
  enableLogging: true
  location: 'hash'

  root: Em.Route.extend
    viewCurrent: Ember.Route.transitionTo('current')
    viewBuilds: Ember.Route.transitionTo('builds')
    viewBuild: Ember.Route.transitionTo('build')
    viewJob: Ember.Route.transitionTo('job')

    index: Em.Route.extend
      route: '/'

      connectOutlets: (router) ->
        repositories = Travis.Repository.find()
        router.connectLeft(repositories)
        onceLoaded repositories, =>
          repository = repositories.get('firstObject')
          router.connectRepository repository
          router.connectTabs repository
          router.connectCurrent repository.get('lastBuild')

    current: Em.Route.extend
      route: '/:owner/:name'

      serialize: (router, repository) ->
        router.serializeRepository repository

      connectOutlets: (router, repository) ->
        repositories = Travis.Repository.find()
        router.connectLeft(repositories)
        onceLoaded repository, =>
          router.connectRepository repository
          router.connectTabs repository
          router.connectCurrent repository.get('lastBuild')

    builds: Em.Route.extend
      route: '/:owner/:name/builds'

      serialize: (router, repository) ->
        router.serializeRepository repository

      connectOutlets: (router, repository) ->
        repositories = Travis.Repository.find()
        router.connectLeft(repositories)
        onceLoaded repository, =>
          router.connectRepository repository
          router.connectTabs repository
          router.connectBuilds repository.get('builds')

    build: Em.Route.extend
      route: '/:owner/:name/builds/:id'

      serialize: (router, build) ->
        router.serializeObject build

      connectOutlets: (router, build) ->
        repositories = Travis.Repository.find()
        repository = build.get('repository')

        router.connectLeft(repositories)
        onceLoaded repository, =>
          router.connectRepository repository
          router.connectTabs repository, build
          router.connectBuild build

    job: Em.Route.extend
      route: '/:owner/:name/jobs/:id'

      serialize: (router, job) ->
        router.serializeObject job

      connectOutlets: (router, job) ->
        repositories = Travis.Repository.find()
        repository = job.get('repository')
        build = job.get('build')

        router.connectLeft(repositories)
        onceLoaded repository, build, =>
          router.connectRepository repository
          router.connectTabs repository, build, job
          router.connectJob job


  connectLeft: (repositories) ->
    @get('applicationController').connectOutlet outletName: 'left', name: 'repositories', context: repositories

  connectRepository: (repository) ->
    @get('applicationController').connectOutlet outletName: 'main', name: 'repository', context: repository

  connectTabs: (repository, build, job) ->
    @setPath 'tabsController.repository', repository
    @setPath 'tabsController.build', build
    @setPath 'tabsController.job', job
    @get('repositoryController').connectOutlet outletName: 'tabs', name: 'tabs'

  connectCurrent: (build) ->
    @get('repositoryController').connectOutlet outletName: 'tab', name: 'current', context: build

  connectBuilds: (builds) ->
    @get('repositoryController').connectOutlet outletName: 'tab', name: 'history', context: builds

  connectBuild: (build) ->
    @get('repositoryController').connectOutlet outletName: 'tab', name: 'build', context: build

  connectJob: (job) ->
    @get('repositoryController').connectOutlet outletName: 'tab', name: 'job', context: job


  serializeRepository: (repository) ->
    if repository instanceof DS.Model
      repository.getProperties 'owner', 'name'
    else
      repository or {}

  serializeObject: (object) ->
    if object instanceof DS.Model
      repository = object.get('repository')
      params = @serializeRepository(repository)
      $.extend params,
        id: object.get('id')
    else
      object or {}
