#require 'travis/location'
#
#Ember.Route.reopen
#  enter: (router) ->
#    @_super(router)
#    _gaq.push(['_trackPageview', @absoluteRoute(router)]) if @get('isLeafRoute') && _gaq?
#
defaultRoute = Ember.Route.extend
  route: '/'
  index: 1000

lineNumberRoute = Ember.Route.extend
  route: '#L:number'
  index: 1
  connectOutlets: (router) ->
    router.saveLineNumberHash()

  dynamicSegmentPattern: "([0-9]+)"

Travis.OldRouter = Ember.Object.extend
  location: 'travis'
  # enableLogging: true
  enableLogging: false
  initialState: 'loading'

  #  showRoot:         Ember.Route.transitionTo('root.home.show')
  #  showStats:        Ember.Route.transitionTo('root.stats')
  #
  #  showRepo:         Ember.Route.transitionTo('root.home.repo.show')
  #  showBuilds:       Ember.Route.transitionTo('root.home.repo.builds.index')
  #  showBuild:        Ember.Route.transitionTo('root.home.repo.builds.show')
  #  showPullRequests: Ember.Route.transitionTo('root.home.repo.pullRequests')
  #  showBranches:     Ember.Route.transitionTo('root.home.repo.branches')
  #  showEvents:       Ember.Route.transitionTo('root.home.repo.events')
  #  showJob:          Ember.Route.transitionTo('root.home.repo.job')
  #
  #  showProfile:      Ember.Route.transitionTo('root.profile')
  #  showAccount:      Ember.Route.transitionTo('root.profile.account')
  #  showUserProfile:  Ember.Route.transitionTo('root.profile.account.profile')

  saveLineNumberHash: (path) ->
    Ember.run.next this, ->
      path = path || @get('location').getURL()
      if match = path.match(/#L\d+$/)
        @set 'repoController.lineNumberHash', match[0]

  reload: ->
    console.log 'Triggering reload'
    url = @get('location').getURL()
    @transitionTo('loading')
    # Without ember next @route sometimes hit the place where HistoryLocation
    # does not have any state set up yet, so it's best to defer it a little bit.
    Ember.run.next this, ->
      @route(url)

  signedIn: ->
    !!Travis.app.get('auth.user')

  needsAuth: (path) ->
    path.indexOf('/profile') == 0

  afterSignOut: ->
    @authorize('/')

  loading: Ember.Route.extend
    routePath: (router, path) ->
      router.saveLineNumberHash(path)
      router.authorize(path)
      Travis.app.autoSignIn() unless router.signedIn()

  authorize: (path) ->
    if !@signedIn() && @needsAuth(path)
      Travis.app.storeAfterSignInPath(path)
      @transitionTo('root.auth')
    else
      @transitionTo('root')
      @route(path)

  root: Ember.Route.extend
    route: '/'
    loading: Ember.State.extend()
    afterSignIn: (-> )

    auth: Ember.Route.extend
      route: '/auth'
      customRegexp: /^\/?auth($|\/)/
      connectOutlets: (router) ->
        router.get('applicationView').connectLayout 'simple'
        $('body').attr('id', 'auth')
        router.get('applicationController').connectOutlet('top', 'top')
        router.get('applicationController').connectOutlet('main', 'signin')

      afterSignIn: (router, path) ->
        router.route(path || '/')

    stats: Ember.Route.extend
      route: '/stats'
      customRegexp: /^\/?stats($|\/)/
      connectOutlets: (router) ->
        router.get('applicationView').connectLayout 'simple'
        $('body').attr('id', 'stats')
        router.get('applicationController').connectOutlet 'top', 'top'
        router.get('applicationController').connectOutlet 'main', 'stats'

    profile: Ember.Route.extend
      initialState: 'index'
      route: '/profile'

      connectOutlets: (router) ->
        router.get('applicationView').connectLayout 'profile'
        $('body').attr('id', 'profile')
        router.get('accountsController').set('content', Travis.Account.find())
        router.get('applicationController').connectOutlet 'top', 'top'
        router.get('applicationController').connectOutlet 'left', 'accounts'
        router.get('applicationController').connectOutlet 'flash', 'flash'

      index: Ember.Route.extend
        route: '/'
        connectOutlets: (router) ->
          router.get('applicationController').connectOutlet 'main', 'profile'
          router.get('profileController').activate 'hooks'

      account: Ember.Route.extend
        initialState: 'index'
        route: '/:login'

        connectOutlets: (router, account) ->
          if account
            params = { login: account.get('login') }
            router.get('profileController').setParams(params)
          else
            router.send 'showProfile'

        deserialize: (router, params) ->
          controller = router.get('accountsController')

          unless controller.get 'content'
            controller.set('content', Travis.Account.find())

          account    = controller.findByLogin(params.login)

          if account
            account
          else
            deferred = $.Deferred()

            observer = ->
              if account = controller.findByLogin(params.login)
                controller.removeObserver 'content.length', observer
                deferred.resolve account
            controller.addObserver 'content.length', observer

            deferred.promise()

        serialize: (router, account) ->
          if account
            { login: account.get('login') }
          else
            {}

        index: Ember.Route.extend
          route: '/'
          connectOutlets: (router) ->
            router.get('profileController').activate 'hooks'

        profile: Ember.Route.extend
          route: '/profile'

          connectOutlets: (router) ->
            router.get('profileController').activate 'user'

    home: Ember.Route.extend
      route: '/'
      connectOutlets: (router) ->
          router.get('applicationView').connectLayout 'home'
          $('body').attr('id', 'home')
          router.get('applicationController').connectOutlet 'left', 'repos'
          router.get('applicationController').connectOutlet 'right', 'sidebar'
          router.get('applicationController').connectOutlet 'top', 'top'
          router.get('applicationController').connectOutlet 'main', 'repo'
          router.get('applicationController').connectOutlet 'flash', 'flash'
          router.get('reposController').activate()
          router.get('repoController').set('repos', router.get('reposController'))

      show: Ember.Route.extend
        route: '/'
        connectOutlets: (router) ->
          router.get('repoController').activate('index')

        initialState: 'default'
        default: defaultRoute
        lineNumber: lineNumberRoute

      showWithLineNumber: Ember.Route.extend
        route: '/#/L:number'
        connectOutlets: (router) ->
          router.get('repoController').activate('index')

      repo: Ember.Route.extend
        route: '/:owner/:name'
        dynamicSegmentPattern: "([^/#]+)"

        connectOutlets: (router, repo) ->
          if repo && repo.constructor != Travis.Repo
            repo = Travis.Repo.find(repo.id)
          router.get('repoController').set 'repo', repo

        deserialize: (router, params) ->
          slug = "#{params.owner}/#{params.name}"
          repos = Travis.Repo.bySlug(slug)
          deferred = $.Deferred()

          observer = ->
            if repos.get 'isLoaded'
              repos.removeObserver 'isLoaded', observer
              deferred.resolve repos.objectAt(0)

          if repos.length
            deferred.resolve repos[0]
          else
            repos.addObserver 'isLoaded', observer

          deferred.promise()

        serialize: (router, repo) ->
          if typeof repo == 'string'
            [owner, name] = repo.split '/'
            { owner: owner, name: name }
          else if repo && repo.constructor == Travis.Repo
            { owner: repo.get('owner'), name: repo.get('name') }
          else if repo && repo.id && repo.slug
            [owner, name] = repo.slug.split '/'
            { owner: owner, name: name }
          else
            # TODO: it would be nice to handle 404 somehow
            {}

        show: Ember.Route.extend
          route: '/'
          connectOutlets: (router) ->
            router.get('repoController').activate('current')

          initialState: 'default'
          default: defaultRoute
          lineNumber: lineNumberRoute

        builds: Ember.Route.extend
          route: '/builds'

          index: Ember.Route.extend
            route: '/'
            connectOutlets: (router, repo) ->
              router.get('repoController').activate 'builds'

          show: Ember.Route.extend
            route: '/:build_id'
            connectOutlets: (router, build) ->
              unless build.get
                # TODO: apparently when I use id in url, it will pass it
                #       here, why doesn't it use deserialize?
                build = Travis.Build.find(build)
              router.get('repoController').set 'build', build
              router.get('repoController').activate 'build'

            serialize: (router, build) ->
              if build.get
                { build_id: build.get('id') }
              else
                { build_id: build }

            deserialize: (router, params) ->
              # Something is wrong here. If I don't use deferred, id is not
              # initialized and url ends up being /jobs/null
              # This should not be needed, as id should be immediately set on the
              # record.
              # TODO: find out why it happens
              build = Travis.Build.find params.build_id

              if build.get 'id'
                build
              else
                deferred = $.Deferred()

                observer = ->
                  if build.get 'id'
                    build.removeObserver 'id', observer
                    deferred.resolve build

                build.addObserver 'id', observer

                deferred.promise()

            # TODO: this is not dry, but for some weird
            #       reason Mixins don't play nice with Ember.Route
            initialState: 'default'
            default: defaultRoute
            lineNumber: lineNumberRoute
            dynamicSegmentPattern: "([^/#]+)"

            logRedirect: Ember.Route.extend
              route: '/log.txt'
              connectOutlets: (router) ->
                build = router.get('repoController').get 'build'

                observer = ->
                  if logId = build.get('jobs.firstObject.log.id')
                    window.location = Travis.Urls.plainTextLog(logId)

                  build.removeObserver('jobs.firstObject.log.id', observer)

                build.addObserver('jobs.firstObject.log.id', observer)

        pullRequests: Ember.Route.extend
          route: '/pull_requests'
          connectOutlets: (router, repo) ->
            router.get('repoController').activate 'pull_requests'

        branches: Ember.Route.extend
          route: '/branches'
          connectOutlets: (router, repo) ->
            router.get('repoController').activate 'branches'

        events: Ember.Route.extend
          route: '/events'
          connectOutlets: (router, repo) ->
            router.get('repoController').activate 'events'

        job: Ember.Route.extend
          route: '/jobs/:job_id'
          dynamicSegmentPattern: "([^/#]+)"
          connectOutlets: (router, job) ->
            unless job.get
              # In case I use id
              job = Travis.Job.find(job)
            router.get('repoController').set 'job', job
            router.get('repoController').activate 'job'

          serialize: (router, job) ->
            if job.get
              { job_id: job.get('id') }
            else
              { job_id: job }

          deserialize: (router, params) ->
            job = Travis.Job.find params.job_id

            if job.get 'id'
              job
            else
              deferred = $.Deferred()

              observer = ->
                if job.get 'id'
                  job.removeObserver 'id', observer
                  deferred.resolve job
              job.addObserver 'id', observer
              deferred.promise()

          initialState: 'default'
          default: defaultRoute
          lineNumber: lineNumberRoute

          logRedirect: Ember.Route.extend
            route: '/log.txt'
            connectOutlets: (router, job) ->
              job = router.get('repoController').get 'job'

              observer = ->
                if logId = job.get('log.id')
                  window.location = Travis.Urls.plainTextLog(logId)

                job.removeObserver('log.id', observer)

              job.addObserver('log.id', observer)

Ember.Router.reopen
  location: Ember.HistoryLocation.create()

Travis.Router.map ->
  @resource 'index', path: '/', ->
    @route 'current', path: '/'
    @resource 'repo', path: '/:owner/:name', ->
      @route 'index', path: '/'
      @resource 'build', path: '/builds/:build_id'
      @resource 'job',   path: '/jobs/:job_id'
      @resource 'builds', path: '/builds'
      @resource 'pullRequests', path: '/pull_requests'
      @resource 'branches', path: '/branches'

  @route 'stats', path: '/stats'

  @resource 'profile', path: '/profile', ->
    @route 'index', path: '/'
    @resource 'account', path: '/:login', ->
      @route 'index', path: '/'
      @route 'profile', path: '/profile'

Travis.IndexCurrentRoute = Ember.Route.extend
  renderTemplate: ->
    @render 'repo'
    @render 'build', outlet: 'pane', into: 'repo'

  setupController: ->
    @container.lookup('controller:repo').activate('index')

Travis.AbstractBuidsRoute = Ember.Route.extend
  renderTemplate: ->
    @render 'builds', outlet: 'pane', into: 'repo'

  setupController: ->
    @container.lookup('controller:repo').activate(@get('contentType'))

Travis.BuildsRoute = Travis.AbstractBuidsRoute.extend(contentType: 'builds')
Travis.PullRequestsRoute = Travis.AbstractBuidsRoute.extend(contentType: 'pull_requests')
Travis.BranchesRoute = Travis.AbstractBuidsRoute.extend(contentType: 'branches')

Travis.BuildRoute = Ember.Route.extend
  renderTemplate: ->
    @render 'build', outlet: 'pane', into: 'repo'

  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { build_id: id }

  setupController: (controller, model) ->
    model = Travis.Build.find(model) if model && !model.get

    repo = @container.lookup('controller:repo')
    repo.set('build', model)
    repo.activate('build')

Travis.JobRoute = Ember.Route.extend
  renderTemplate: ->
    @render 'job', outlet: 'pane', into: 'repo'

  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { job_id: id }

  setupController: (controller, model) ->
    model = Travis.Job.find(model) if model && !model.get

    repo = @container.lookup('controller:repo')
    console.log model.toString()
    repo.set('job', model)
    repo.activate('job')

Travis.RepoIndexRoute = Ember.Route.extend
  setupController: (controller, model) ->
    @container.lookup('controller:repo').activate('current')

  renderTemplate: ->
    @render 'build', outlet: 'pane', into: 'repo'

Travis.RepoRoute = Ember.Route.extend
  renderTemplate: ->
    @render 'repo'

  setupController: (controller, model) ->
    # TODO: if repo is just a data hash with id and slug load it
    #       as incomplete record
    model = Travis.Repo.find(model.id) if model && !model.get
    controller.set('repo', model)

  serialize: (repo) ->
    slug = if repo.get then repo.get('slug') else repo.slug
    [owner, name] = slug.split('/')
    { owner: owner, name: name }

  deserialize: (params) ->
    slug = "#{params.owner}/#{params.name}"
    proxy = Ember.ObjectProxy.create(content: Ember.Object.create())
    proxy.setProperties slug: slug, isLoaded: false

    repos = Travis.Repo.bySlug(slug)

    observer = ->
      if repos.get 'isLoaded'
        repos.removeObserver 'isLoaded', observer
        proxy.set 'content', repos.objectAt(0)

    if repos.length
      proxy.set('content', repos[0])
    else
      repos.addObserver 'isLoaded', observer

    proxy

Travis.IndexRoute = Ember.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'home')

    @render 'repos',   outlet: 'left'
    @render 'sidebar', outlet: 'right'
    @render 'top',     outlet: 'top'
    @render 'flash',   outlet: 'flash'

  setupController: (controller)->
    @container.lookup('controller:repos').activate()
    @container.lookup('controller:application').connectLayout 'home'

Travis.StatsRoute = Ember.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'stats')

    @render 'top', outlet: 'top'
    @render 'stats'

  setupController: ->
    @container.lookup('controller:application').connectLayout('simple')

Travis.ProfileRoute = Ember.Route.extend
  setupController: ->
    @container.lookup('controller:application').connectLayout('profile')
    @container.lookup('controller:accounts').set('content', Travis.Account.find())

  renderTemplate: ->
    $('body').attr('id', 'profile')

    @render 'top', outlet: 'top'
    @render 'accounts', outlet: 'left'
    @render 'flash', outlet: 'flash'
    @render 'profile'

Travis.ProfileIndexRoute = Ember.Route.extend
  setupController: ->
    @container.lookup('controller:profile').activate 'hooks'

  renderTemplate: ->
    @render 'hooks', outlet: 'pane', into: 'profile'

Travis.AccountRoute = Ember.Route.extend
  setupController: (controller, account) ->
    profileController = @container.lookup('controller:profile')
    profileController.activate 'hooks'

    if account
      params = { login: account.get('login') }
      profileController.setParams(params)

  deserialize: (params) ->
    controller = @container.lookup('controller:accounts')
    account = controller.findByLogin(params.login)

    if account
      account
    else
      content = Ember.Object.create(login: params.login)
      proxy = Ember.ObjectProxy.create(content: content)

      observer = ->
        if account = controller.findByLogin(params.login)
          controller.removeObserver 'content.length', observer
          proxy.set('content', account)
      controller.addObserver 'content.length', observer

      proxy

  serialize: (account) ->
    if account
      { login: account.get('login') }
    else
      {}

Travis.AccountIndexRoute = Ember.Route.extend
  setupController: ->
    @container.lookup('controller:profile').activate 'hooks'

  renderTemplate: ->
    @render 'hooks', outlet: 'pane', into: 'profile'

Travis.AccountProfileRoute = Ember.Route.extend
  setupController: ->
    @container.lookup('controller:profile').activate 'user'

  renderTemplate: ->
    @render 'user', outlet: 'pane', into: 'profile'
