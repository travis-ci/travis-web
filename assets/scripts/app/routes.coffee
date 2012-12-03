require 'travis/location'

Ember.Route.reopen
  enter: (router) ->
    @_super(router)
    if @get('isLeafRoute')
      path = @absoluteRoute(router)
      if window.location.origin == 'https://travis-ci.org'
        _gaq.push(['_trackPageview', path]);

defaultRoute = Ember.Route.extend
  route: '/'
  index: 1000

lineNumberRoute = Ember.Route.extend
  route: '#L:number'
  index: 1
  connectOutlets: (router) ->
    router.saveLineNumberHash()

  dynamicSegmentPattern: "([0-9]+)"

Travis.Router = Ember.Router.extend
  location: 'travis'
  # enableLogging: true
  enableLogging: false
  initialState: 'loading'

  showRoot:         Ember.Route.transitionTo('root.home.show')
  showStats:        Ember.Route.transitionTo('root.stats')

  showRepo:         Ember.Route.transitionTo('root.home.repo.show')
  showBuilds:       Ember.Route.transitionTo('root.home.repo.builds.index')
  showBuild:        Ember.Route.transitionTo('root.home.repo.builds.show')
  showPullRequests: Ember.Route.transitionTo('root.home.repo.pullRequests')
  showBranches:     Ember.Route.transitionTo('root.home.repo.branches')
  showEvents:       Ember.Route.transitionTo('root.home.repo.events')
  showJob:          Ember.Route.transitionTo('root.home.repo.job')

  showProfile:      Ember.Route.transitionTo('root.profile')
  showAccount:      Ember.Route.transitionTo('root.profile.account')
  showUserProfile:  Ember.Route.transitionTo('root.profile.account.profile')

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
          unless repo.constructor == Travis.Repo
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
