require 'hax0rs'

@Travis.Router = Em.Router.extend
  enableLogging: true
  location: 'hash'

  root: Em.Route.extend
    default: Em.Route.extend
      route: '/'

      viewCurrent: Ember.Route.transitionTo('current')
      viewBuilds: Ember.Route.transitionTo('builds')
      viewBuild: Ember.Route.transitionTo('build')
      viewJob: Ember.Route.transitionTo('job')

      connectOutlets: (router) ->
        repositories = Travis.Repository.find()
        router.connectLeft(repositories)
        router.set('repositories', repositories)

      index: Em.Route.extend
        route: '/'

        connectOutlets: (router) ->
          repositories = router.get('repositories')
          onceLoaded repositories, =>
            repository = repositories.get('firstObject')
            router.connectRepository repository
            router.connectTabs repository
            router.connectCurrent repository.get('lastBuild')

      current: Em.Route.extend
        route: '/:owner/:name'

        serialize: (router, repository) ->
          router.serializeRepository(repository)

        deserialize: (router, params) ->
          router.deserializeRepository(params)

        connectOutlets: (router, repository) ->
          router.connectRepository repository
          router.connectTabs repository
          router.connectCurrent repository.get('lastBuild')

      builds: Em.Route.extend
        route: '/:owner/:name/builds'

        serialize: (router, repository) ->
          router.serializeRepository repository

        deserialize: (router, params) ->
          router.deserializeRepository(params)

        connectOutlets: (router, repository) ->
          router.connectRepository repository
          router.connectTabs repository
          router.connectBuilds repository.get('builds')

      build: Em.Route.extend
        route: '/:owner/:name/builds/:id'

        serialize: (router, build) ->
          r = router.serializeObject build
          console.log(r.owner, r.name, r.id)
          r

        deserialize: (router, params) ->
          router.deserializeBuild(params)

        connectOutlets: (router, build) ->
          build = Travis.Build.find(build.id) unless build instanceof Travis.Build
          onceLoaded build, =>
            repository = build.get('repository')
            onceLoaded repository, =>
              router.connectRepository repository
              router.connectTabs repository, build
              router.connectBuild build

      job: Em.Route.extend
        route: '/:owner/:name/jobs/:id'

        serialize: (router, job) ->
          router.serializeObject job

        deserialize: (router, params) ->
          router.deserializeBuild(params)

        connectOutlets: (router, job) ->
          # repositories = Travis.Repository.find()
          # job = Travis.Job.find(job.id) unless job instanceof Travis.Job
          # repository = job.get('repository')
          # build = job.get('build')

          # router.connectLeft(repositories)
          # onceLoaded repository, build, =>
          #   router.connectRepository repository
          #   router.connectTabs repository, build, job
          #   router.connectJob job


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


  serializeRepository: (object) ->
    if object instanceof DS.Model
      slug = object.get('slug') || object._id # wat.
      parts = slug.split('/')
      { owner: parts[0], name: parts[1] }
    else
      object || {}

  serializeObject: (object) ->
    if object instanceof DS.Model
      repository = object.get('repository')
      params = @serializeRepository(repository)
      object.get('id') || debugger
      $.extend params,
        id: object.get('id')
    else
      object or {}

  deserializeRepository: (params) ->
    Travis.Repository.find("#{params.owner}/#{params.name}")

  deserializeBuild: (params) ->
    Travis.Build.find(params.id)

  deserializeJob: (params) ->
    Travis.Job.find(params.id)

