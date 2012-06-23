require 'hax0rs'

@Travis.Router = Em.Router.extend
  enableLogging: true
  location: 'hash'

  root: Em.Route.extend
    # common "layout" state for all states that show a repo list on the left.
    # there also will be "profile" and "stats" states next to "default" that do
    # not have a 3-column layout
    default: Em.Route.extend
      route: '/'

      viewCurrent: Ember.Route.transitionTo('repository.current')
      viewBuilds: Ember.Route.transitionTo('repository.builds')
      viewBuild: Ember.Route.transitionTo('repository.build')
      viewJob: Ember.Route.transitionTo('repository.job')

      connectOutlets: (router) ->
        repositories = Travis.Repository.find()
        router.set('repositories', repositories)
        router.connectLeft(repositories)

      index: Em.Route.extend
        route: '/'

        # on / we show the most recent repository from the repos list, so we
        # have to wait until it's loaded
        connectOutlets: (router) ->
          repositories = router.get('repositories')
          onceLoaded repositories, =>
            repository = repositories.get('firstObject')
            build = Travis.Build.find(repository.get('last_build_id'))
            router.connectRepository(repository)
            router.connectTabs(repository)
            router.connectCurrent(build)

      repository: Em.Route.extend
        route: '/:owner/:name'

        serialize: (router, repository) ->
          router.serializeRepository(repository)

        deserialize: (router, params) ->
          router.deserializeRepository(params)

        connectOutlets: (router, repository) ->
          router.set('repository', repository)
          router.connectRepository(repository)
          router.connectTabs(repository)

        current: Em.Route.extend
          route: '/'

          connectOutlets: (router) ->
            repository = router.get('repository')
            onceLoaded repository, => # TODO should need to wait here, right?
              build = repository.get('lastBuild')
              router.connectTabs(repository)
              router.connectCurrent(build)

        builds: Em.Route.extend
          route: '/builds'

          connectOutlets: (router) ->
            repository = router.get('repository')
            router.connectBuilds(repository.get('builds'))

        build: Em.Route.extend
          route: '/builds/:build_id'

          connectOutlets: (router, build) ->
            router.setPath('tabsController.build', build)
            router.connectBuild(build)

        job: Em.Route.extend
          route: '/jobs/:job_id'

          connectOutlets: (router, job) ->
            router.setPath('tabsController.build', build)
            router.setPath('tabsController.job', job)
            router.connectJob(job)


  connectLeft: (repositories) ->
    @get('applicationController').connectOutlet(outletName: 'left', name: 'repositories', context: repositories)

  connectRepository: (repository) ->
    @get('applicationController').connectOutlet(outletName: 'main', name: 'repository', context: repository)

  connectTabs: (repository) ->
    @setPath('tabsController.repository', repository)
    @get('repositoryController').connectOutlet(outletName: 'tabs', name: 'tabs')

  connectCurrent: (build) ->
    @get('repositoryController').connectOutlet(outletName: 'tab', name: 'current', context: build)

  connectBuilds: (builds) ->
    @get('repositoryController').connectOutlet(outletName: 'tab', name: 'history', context: builds)

  connectBuild: (build) ->
    @get('repositoryController').connectOutlet(outletName: 'tab', name: 'build', context: build)

  connectJob: (job) ->
    @get('repositoryController').connectOutlet(outletName: 'tab', name: 'job', context: job)


  serializeRepository: (object) ->
    if object instanceof DS.Model
      slug = object.get('slug') || object._id # wat.
      { owner: slug.split('/')[0], name: slug.split('/')[1] }
    else
      object

  deserializeRepository: (params) ->
    Travis.Repository.find("#{params.owner}/#{params.name}")

