require 'hax0rs'

@Travis.Router = Em.Router.extend
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

    build: Em.Route.extend
      route: '/:owner/:name/builds/:id'
      serialize: (router, build) ->
        router.serializeObject build

      connectOutlets: (router, build) ->
        params = router.serializeObject(build)
        build = Travis.Build.find(params.id) unless build instanceof Travis.Build
        router.connectLayout params, build, (repository, build) ->
          router.connectBuild build

    job: Em.Route.extend
      route: '/:owner/:name/jobs/:id'
      serialize: (router, job) ->
        router.serializeObject job

      connectOutlets: (router, job) ->
        params = router.serializeObject(job)
        job = Travis.Job.find(params.id) unless build instanceof Travis.Job
        build = job.get('build')
        router.connectLayout params, build, job, (repository, job) ->
          router.connectJob job

    viewCurrent: Ember.Route.transitionTo('current')
    viewHistory: Ember.Route.transitionTo('history')
    viewBuild: Ember.Route.transitionTo('build')
    viewJob: Ember.Route.transitionTo('job')

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

  connectLayout: (params, callback) ->
    args = Array.prototype.slice.call(arguments, 1)
    callback = args.pop()
    build = args.shift()
    job = args.shift()

    repositories = Travis.Repository.find()
    @connectLeft repositories
    @connectMain repositories, params, build, job, callback
    @connectRight()

  connectMain: (repositories, params, build, job, callback) ->
    @connectLoading()
    if params.owner and params.name
      # TODO this might be wrong for /:owner/:name ... when this repo is not contained
      # in the current list of recent repositories
      repositories = Travis.Repository.find().filter (data) ->
        data.get('owner_name') is params.owner_name and data.get('name') is params.name

    build = job.get('build') if job && !build
    # build = (if params.id then Travis.Build.find(params.id) else `undefined`)

    onceLoaded repositories, build, =>
      repository = repositories.get('firstObject')
      @connectRepository repository
      @connectTabs repository, build, job
      callback repository, build

  connectRepository: (repository) ->
    @get('applicationController').connectOutlet
      outletName: 'main'
      name: 'repository'
      context: repository

  connectTabs: (repository, build, job) ->
    @setPath 'tabsController.repository', repository
    @setPath 'tabsController.build', build
    @setPath 'tabsController.job', job

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

  connectJob: (job) ->
    @get('repositoryController').connectOutlet
      outletName: 'tab'
      name: 'job'
      context: job
