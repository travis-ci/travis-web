Travis.Router = Ember.Router.extend
  location: 'history'
  enableLogging: true
  initialState: 'loading'

  goToRoot: Ember.Route.transitionTo('root.home.show')
  goToStats: Ember.Route.transitionTo('root.stats')

  showRepository: Ember.Route.transitionTo('root.home.repository.show')
  showBuilds: Ember.Route.transitionTo('root.home.repository.builds.index')
  showBuild: Ember.Route.transitionTo('root.home.repository.builds.show')
  showPullRequests: Ember.Route.transitionTo('root.home.repository.pullRequests')
  showBranches: Ember.Route.transitionTo('root.home.repository.branches')
  showJob: Ember.Route.transitionTo('root.home.repository.job')

  showProfile: Ember.Route.transitionTo('root.profile')
  showAccount: Ember.Route.transitionTo('root.profile.account')
  showUserProfile: Ember.Route.transitionTo('root.profile.account.profile')

  signedIn: ->
    !!Travis.app.get('auth.user')

  needsAuth: (path) ->
    path.indexOf('/profile') == 0 && !@signedIn()

  loading: Ember.Route.extend
    routePath: (router, path) ->
      sessionStorage.setItem('travis.path', path)
      if router.needsAuth(path)
        router.transitionTo('root.auth')
        Travis.app.signIn()
      else
        router.transitionTo('authenticated')

  authenticated: Ember.Route.extend
    connectOutlets: (router) ->
      path = sessionStorage.getItem('travis.path')
      sessionStorage.removeItem('travis.path')
      router.transitionTo('root')
      router.route(path) if path

  root: Ember.Route.extend
    initialState: 'home'
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
          router.get('accountsController').findByLogin(params.login)

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
      initialState: 'show'
      route: '/'
      connectOutlets: (router) ->
        router.get('applicationController').connectOutlet 'home'
        $('body').attr('id', 'home')
        router.get('homeController').connectOutlet 'left', 'repositories'
        router.get('homeController').connectOutlet 'right', 'sidebar'
        router.get('homeController').connectOutlet 'top', 'top'
        router.get('homeController').connectOutlet 'main', 'repository'

      show: Ember.Route.extend
        route: '/'
        connectOutlets: (router) ->
          router.get('repositoryController').activate('index')

      repository: Ember.Route.extend
        initialState: 'show'
        route: '/:owner/:name'

        connectOutlets: (router, repository) ->
          router.get('repositoryController').set 'repository', repository

        deserialize: (router, params) ->
          slug = "#{params.owner}/#{params.name}"
          repos = Travis.Repository.bySlug(slug)
          deferred = $.Deferred()

          observer = ->
            if repos.get 'isLoaded'
              repos.removeObserver 'isLoaded', observer
              deferred.resolve repos.objectAt(0)

          repos.addObserver 'isLoaded', observer

          deferred.promise()

        serialize: (router, repository) ->
          if repository
            { owner: repository.get('owner'), name: repository.get('name') }
          else
            {}

        show: Ember.Route.extend
          route: '/'
          connectOutlets: (router) ->
            router.get('repositoryController').activate('current')

        builds: Ember.Route.extend
          route: '/builds'
          initialState: 'index'

          index: Ember.Route.extend
            route: '/'
            connectOutlets: (router, repository) ->
              router.get('repositoryController').activate 'builds'

          show: Ember.Route.extend
            route: '/:build_id'
            connectOutlets: (router, build) ->
              unless build.get
                # TODO: apparently when I use id in url, it will pass it
                #       here, why doesn't it use deserialize?
                build = Travis.Build.find(build)
              router.get('repositoryController').set 'build', build
              router.get('repositoryController').activate 'build'

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

        pullRequests: Ember.Route.extend
          route: '/pull_requests'
          connectOutlets: (router, repository) ->
            router.get('repositoryController').activate 'pull_requests'

        branches: Ember.Route.extend
          route: '/branches'
          connectOutlets: (router, repository) ->
            router.get('repositoryController').activate 'branches'

        job: Ember.Route.extend

          route: '/jobs/:job_id'
          connectOutlets: (router, job) ->
            unless job.get
              # In case I use id
              job = Travis.Job.find(job)
            router.get('repositoryController').set 'job', job
            router.get('repositoryController').activate 'job'

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
