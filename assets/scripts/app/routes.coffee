require 'travis/location'

defaultRoute = Ember.Route.extend
  route: '/'
  index: 1000

lineNumberRoute = Ember.Route.extend
  route: '#L:number'
  index: 1
  connectOutlets: (router) ->
    router.saveLineNumberHash()

  routeMatcher: Ember.computed(->
    if route = @get 'route'
      Ember._RouteMatcher.create
        route: route
        # TODO: overriding such things is not cool, I need to check what's the status of
        #       router rewrite and make sure we can do such stuff without overriding anything
        init: ->
          escapeForRegex = (text) ->
            text.replace(/[\-\[\]{}()*+?.,\\\^\$|#\s]/g, "\\$&")

          route = @route
          identifiers = []
          count = 1

          if route.charAt(0) == '/'
            route = @route = route.substr(1)

          escaped = escapeForRegex(route)

          regex = escaped.replace /:([a-z_]+)(?=$|\/)/gi, (match, id) ->
            identifiers[count++] = id
            "([0-9]+)"

          @identifiers = identifiers
          @regex = new RegExp(regex)
  ).cacheable()


nonHashRouteMatcher = Ember.computed(->
  if route = @get 'route'
    Ember._RouteMatcher.create
      route: route
      # TODO: overriding such things is not cool, I need to check what's the status of
      #       router rewrite and make sure we can do such stuff without overriding anything
      init: ->
        escapeForRegex = (text) ->
          text.replace(/[\-\[\]{}()*+?.,\\\^\$|#\s]/g, "\\$&")

        route = @route
        identifiers = []
        count = 1

        if route.charAt(0) == '/'
          route = @route = route.substr(1)

        escaped = escapeForRegex(route)

        regex = escaped.replace /:([a-z_]+)(?=$|\/)/gi, (match, id) ->
          identifiers[count++] = id
          "([^/#]+)"

        @identifiers = identifiers
        @regex = new RegExp("^/?" + regex)
).cacheable()

resolvePath = (manager, path) ->
  if @get('isLeafRoute')
    return Ember.A()

  childStates = @get('childStates')

  childStates = Ember.A(childStates.filterProperty('isRoutable'))

  childStates = childStates.sort (a, b) ->
    aDynamicSegments = a.get('routeMatcher.identifiers.length')
    bDynamicSegments = b.get('routeMatcher.identifiers.length')
    aRoute = a.get('route')
    bRoute = b.get('route')
    aIndex = a.get('index')
    bIndex = b.get('index')

    if aIndex && bIndex
      return aIndex - bIndex

    if aRoute.indexOf(bRoute) == 0
      return -1
    else if bRoute.indexOf(aRoute) == 0
      return 1

    if aDynamicSegments != bDynamicSegments
      return aDynamicSegments - bDynamicSegments

    return b.get('route.length') - a.get('route.length')

  match = null
  state = childStates.find (state) ->
    matcher = state.get('routeMatcher')
    if match = matcher.match(path)
      match

  Ember.assert("Could not find state for path " + path, !!state)

  resolvedState = Ember._ResolvedState.create
    manager: manager
    state: state
    match: match

  states = state.resolvePath(manager, match.remaining)

  Ember.A([resolvedState]).pushObjects(states)

Travis.Router = Ember.Router.extend
  location: 'travis'
  enableLogging: true
  initialState: 'loading'

  showRoot:         Ember.Route.transitionTo('root.home.show')
  showStats:        Ember.Route.transitionTo('root.stats')

  showRepo:         Ember.Route.transitionTo('root.home.repo.show')
  showBuilds:       Ember.Route.transitionTo('root.home.repo.builds.index')
  showBuild:        Ember.Route.transitionTo('root.home.repo.builds.show')
  showPullRequests: Ember.Route.transitionTo('root.home.repo.pullRequests')
  showBranches:     Ember.Route.transitionTo('root.home.repo.branches')
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
    url = @get('location').getURL()
    @transitionTo 'loading'
    @route(url)

  signedIn: ->
    !!Travis.app.get('auth.user')

  needsAuth: (path) ->
    path.indexOf('/profile') == 0 && !@signedIn()

  authenticate: ->
    @app.get('router').transitionTo('authenticated')

  loading: Ember.Route.extend
    routePath: (router, path) ->
      router.saveLineNumberHash(path)

      sessionStorage.setItem('travis.path', path)
      if router.needsAuth(path)
        router.transitionTo('root.auth')
        Travis.app.signIn()
      else
        router.transitionTo('authenticated')

  authenticated: Ember.Route.extend
    authenticate: (->)
    connectOutlets: (router) ->
      path = sessionStorage.getItem('travis.path')
      sessionStorage.removeItem('travis.path')
      router.transitionTo('root')
      if path
        router.route(path)
       else
        router.route('/')

  root: Ember.Route.extend
    route: '/'
    authenticate: (->)
    loading: Ember.State.extend()

    auth: Ember.Route.extend
      route: '/auth'
      connectOutlets: (router) ->
        router.get('applicationController').connectOutlet('authLayout')
        $('body').attr('id', 'auth')
        router.get('authLayoutController').connectOutlet('top', 'top')
        router.get('authLayoutController').connectOutlet('main', 'signin')

    stats: Ember.Route.extend
      route: '/stats'
      connectOutlets: (router) ->
        router.get('applicationController').connectOutlet 'statsLayout'
        $('body').attr('id', 'stats')
        router.get('statsLayoutController').connectOutlet 'top', 'top'
        router.get('statsLayoutController').connectOutlet 'main', 'stats'

    profile: Ember.Route.extend
      initialState: 'index'
      route: '/profile'

      connectOutlets: (router) ->
        router.get('applicationController').connectOutlet 'profileLayout'
        $('body').attr('id', 'profile')
        router.get('accountsController').set('content', Travis.Account.find())
        router.get('profileLayoutController').connectOutlet 'top', 'top'
        router.get('profileLayoutController').connectOutlet 'left', 'accounts'

      index: Ember.Route.extend
        route: '/'
        connectOutlets: (router) ->
          router.get('profileLayoutController').connectOutlet 'main', 'profile'
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
        router.get('applicationController').connectOutlet 'homeLayout'
        $('body').attr('id', 'home')
        router.get('homeLayoutController').connectOutlet 'left', 'repos'
        router.get('homeLayoutController').connectOutlet 'right', 'sidebar'
        router.get('homeLayoutController').connectOutlet 'top', 'top'
        router.get('homeLayoutController').connectOutlet 'main', 'repo'
        router.get('homeLayoutController').connectOutlet 'flash', 'flash'

      show: Ember.Route.extend
        route: '/'
        connectOutlets: (router) ->
          router.get('repoController').activate('index')

        initialState: 'default'
        default: defaultRoute
        lineNumber: lineNumberRoute
        resolvePath: resolvePath

      showWithLineNumber: Ember.Route.extend
        route: '/#/L:number'
        connectOutlets: (router) ->
          router.get('repoController').activate('index')

      repo: Ember.Route.extend
        route: '/:owner/:name'
        routeMatcher: nonHashRouteMatcher

        connectOutlets: (router, repo) ->
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
          if repo
            { owner: repo.get('owner'), name: repo.get('name') }
          else
            {}

        show: Ember.Route.extend
          route: '/'
          connectOutlets: (router) ->
            router.get('repoController').activate('current')

          initialState: 'default'
          default: defaultRoute
          lineNumber: lineNumberRoute
          resolvePath: resolvePath

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
            routeMatcher: nonHashRouteMatcher
            resolvePath: resolvePath

        pullRequests: Ember.Route.extend
          route: '/pull_requests'
          connectOutlets: (router, repo) ->
            router.get('repoController').activate 'pull_requests'

        branches: Ember.Route.extend
          route: '/branches'
          connectOutlets: (router, repo) ->
            router.get('repoController').activate 'branches'

        job: Ember.Route.extend
          route: '/jobs/:job_id'
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
          routeMatcher: nonHashRouteMatcher
          resolvePath: resolvePath
