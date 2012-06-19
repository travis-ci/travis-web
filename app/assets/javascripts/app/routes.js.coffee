Travis.Router = Em.Router.extend
  enableLogging: true
  location: 'hash'

  root: Em.Route.extend
    viewRepository: Ember.Route.transitionTo('current')
    index: Em.Route.extend
      route: '/'
      connectOutlets: (router) ->
        router.connectLayout {}, (repository) ->
          router.connectCurrent repository.get('lastBuild')

      viewCurrent: Ember.Route.transitionTo('current')
      viewHistory: Ember.Route.transitionTo('history')
      viewBuild: Ember.Route.transitionTo('build')

    current: Em.Route.extend
      route: '/:owner/:name'
      serialize: (router, repository) ->
        router.serializeRepository repository

      connectOutlets: (router, repository) ->
        params = router.serializeRepository(repository)
        router.connectLayout params, (repository) ->
          builds = repository.get('builds')
          onceLoaded builds, ->
            router.connectCurrent builds.get('firstObject')

    viewCurrent: Ember.Route.transitionTo('current')
    history: Em.Route.extend
      route: '/:owner/:name/builds'
      serialize: (router, repository) ->
        router.serializeRepository repository

      connectOutlets: (router, repository) ->
        params = router.serializeRepository(repository)
        router.connectLayout params, (repository) ->
          builds = repository.get('builds')
          onceLoaded builds, ->
            router.connectHistory builds

    viewHistory: Ember.Route.transitionTo('history')
    build: Em.Route.extend
      route: '/:owner/:name/builds/:id'
      serialize: (router, build) ->
        router.serializeBuild build

      connectOutlets: (router, build) ->
        params = router.serializeBuild(build)
        router.connectLayout params, (repository, build) ->
          router.connectBuild build

    viewBuild: Ember.Route.transitionTo('build')

  serializeRepository: (repository) ->
    if repository instanceof DS.Model
      repository.getProperties 'owner', 'name'
    else
      repository or {}

  serializeBuild: (build) ->
    if build instanceof DS.Model
      repository = build.get('repository')
      params = @serializeRepository(repository)
      $.extend params,
        id: build.get('id')
    else
      build or {}

  connectLayout: (params, callback) ->
    repositories = Travis.Repository.find()
    @connectLeft repositories
    @connectMain repositories, params, callback
    @connectRight()

  connectLeft: (repositories) ->
    @get('applicationController').connectOutlet
      outletName: 'left'
      name: 'repositories'
      context: repositories

  connectRight: ->
    # ...

  connectLoading: ->
    @get('applicationController').connectOutlet
      outletName: 'main'
      name: 'loading'

  connectMain: (repositories, params, callback) ->
    @connectLoading()
    if params.owner and params.name
      repositories = Travis.Repository.find().filter (data) ->
        data.get('owner_name') is params.owner_name and data.get('name') is params.name
    build = (if params.id then Travis.Build.find(params.id) else `undefined`)

    onceLoaded repositories, build, =>
      repository = repositories.get('firstObject')
      @connectRepository repository
      @connectTabs repository, build
      callback repository, build

  connectRepository: (repository) ->
    @get('applicationController').connectOutlet
      outletName: 'main'
      name: 'repository'
      context: repository

  connectTabs: (repository, build) ->
    @setPath 'tabsController.repository', repository
    @setPath 'tabsController.build', build
    @get('repositoryController').connectOutlet
      outletName: 'tabs'
      name: 'tabs'

  connectCurrent: (build) ->
    @get('repositoryController').connectOutlet
      outletName: 'tab'
      name: 'current'
      context: build

  connectHistory: (builds) ->
    @get('repositoryController').connectOutlet
      outletName: 'tab'
      name: 'history'
      context: builds

  connectBuild: (build) ->
    @get('repositoryController').connectOutlet
      outletName: 'tab'
      name: 'build'
      context: build
