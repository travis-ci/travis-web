require 'travis/location'

Ember.Router.reopen
  location: (if testMode? then Ember.NoneLocation.create() else Travis.Location.create())

  handleURL: (url) ->
    url = url.replace(/#.*?$/, '')
    @_super(url)

Travis.Route = Ember.Route.extend
  beforeModel: (transition) ->
    @auth.autoSignIn() unless @signedIn()

    if !@signedIn() && @get('needsAuth')
      @auth.set('afterSignInTransition', transition)
      Ember.RSVP.reject("needs-auth")
    else
      @_super.apply(this, arguments)

  signedIn: ->
    @controllerFor('currentUser').get('model')

  needsAuth: (->
    # on pro, we need to auth on every route
    Travis.config.pro
  ).property()

Travis.ApplicationRoute = Travis.Route.extend
  needsAuth: false

  renderTemplate: ->
    if Travis.config.pro
      $('body').addClass('pro')

    @_super.apply(this, arguments)

  actions:
    redirectToGettingStarted: ->
      # do nothing, we handle it only in index path

    renderDefaultTemplate: ->
      @renderDefaultTemplate() if @renderDefaultTemplate

    error: (error) ->
      if error == 'needs-auth'
        authController = @container.lookup('controller:auth')
        authController.set('redirected', true)
        @transitionTo('auth')
      else
        return true

    renderFirstSync: ->
      @transitionTo 'first_sync'

    afterSignIn: ->
      if transition = @auth.get('afterSignInTransition')
        @auth.set('afterSignInTransition', null)
        transition.retry()
      else
        @transitionTo('main')

    afterSignOut: ->
      if Travis.config.pro
        @transitionTo('auth')
      else
        @transitionTo('main')

Travis.Router.map ->
  @resource 'main', path: '/', ->
    @resource 'getting_started'
    @route 'recent'
    @route 'repositories'
    @route 'my_repositories'
    @route 'search', path: '/search/:phrase'
    @resource 'repo', path: '/:owner/:name', ->
      @route 'index', path: '/'
      @resource 'build', path: '/builds/:build_id'
      @resource 'job',   path: '/jobs/:job_id'
      @resource 'builds', path: '/builds'
      @resource 'pullRequests', path: '/pull_requests'
      @resource 'branches', path: '/branches'
      @resource 'requests', path: '/requests'
      @resource 'caches', path: '/caches' if Travis.config.caches_enabled
      @resource 'request', path: '/requests/:request_id'

      @resource 'settings', ->
        @route 'index', path: '/'
        @resource 'env_vars', ->
          @route 'new'
        @resource 'ssh_key' if Travis.config.ssh_key_enabled

  @route 'first_sync'
  @route 'insufficient_oauth_permissions'
  @route 'stats', path: '/stats'
  @route 'auth', path: '/auth'

  @resource 'profile', path: '/profile', ->
    @resource 'accounts', path: '/', ->
      @resource 'account', path: '/:login'
      @route 'info', path: '/info'

  @route 'notFound', path: "/*path"

Travis.RequestsRoute = Travis.Route.extend
  needsAuth: true
  setupController: ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('requests')

  model: ->
    Travis.Request.fetch repository_id: @modelFor('repo').get('id')

Travis.CachesRoute = Travis.Route.extend
  needsAuth: true
  setupController: ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('caches')

  model: ->
    repo = @modelFor('repo')
    Travis.ajax.get("/repos/#{repo.get('id')}/caches").then( (data) ->
      groups = {}
      data["caches"].forEach (cacheData) ->
        branch = cacheData["branch"]
        group = groups[branch]
        unless group
          group = groups[branch] = Ember.Object.create(branch: branch, caches: [])
        cache = Ember.Object.create(cacheData)
        cache.set('parent', group)
        group.get('caches').pushObject(cache)

      result = []
      for branch, caches of groups
        result.push caches

      result
    )

Travis.RequestRoute = Travis.Route.extend
  setupController: ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('request')

  model: (params) ->
    Travis.Request.fetch params.request_id

Travis.GettingStartedRoute = Travis.Route.extend
  renderTemplate: ->
    @render('no_owned_repos')

Travis.SimpleLayoutRoute = Travis.Route.extend
  setupController: ->
    $('body').attr('id', 'home')
    toActivate = if @signedIn() then 'owned' else 'recent'
    @container.lookup('controller:repos').activate(toActivate)
    @_super.apply(this, arguments)

  renderTemplate: ->
    @_super.apply(this, arguments)

Travis.FirstSyncRoute = Travis.SimpleLayoutRoute.extend
  actions:
    redirectToGettingStarted: ->
      # do nothing, we are showing first sync, so it's normal that there is
      # no owned repos

Travis.InsufficientOauthPermissionsRoute = Travis.SimpleLayoutRoute.extend
  setupController: (controller) ->
    @_super.apply this, arguments
    existingUser = document.location.hash.match(/#existing[_-]user/)
    controller.set('existingUser', existingUser)

Travis.MainTabRoute = Travis.Route.extend
  renderTemplate: ->
    @render 'repo'
    @render 'build', into: 'repo'

  setupController: ->
    @_super.apply this, arguments

    @controllerFor('repo').activate('index')
    @controllerFor('repos').activate(@get('reposTabName'))

    @currentRepoDidChange()
    @controllerFor('repos').addObserver('firstObject', this, 'currentRepoDidChange')

  deactivate: ->
    @controllerFor('repos').removeObserver('firstObject', this, 'currentRepoDidChange')

  currentRepoDidChange: ->
    if repo = @controllerFor('repos').get('firstObject')
      @controllerFor('repo').set('repo', repo)

  actions:
    redirectToGettingStarted: ->
      @transitionTo('getting_started')

Travis.MainMyRepositoriesRoute = Travis.Route.extend
  redirect: ->
    @transitionTo("main.repositories")

Travis.MainRepositoriesRoute = Travis.MainTabRoute.extend
  needsAuth: true
  reposTabName: 'owned'
  afterModel: ->
    @controllerFor('repos').possiblyRedirectToGettingStartedPage()

Travis.MainRecentRoute = Travis.MainTabRoute.extend
  reposTabName: 'recent'

Travis.MainSearchRoute = Travis.MainTabRoute.extend
  renderTemplate: ->
    @render 'repo'
    @render 'build', into: 'repo'

  setupController: (controller, searchPhrase) ->
    # TODO: this method is almost the same as _super, refactor this
    @controllerFor('repo').activate('index')
    @controllerFor('repos').activate('search', searchPhrase)

    @currentRepoDidChange()
    @controllerFor('repos').addObserver('firstObject', this, 'currentRepoDidChange')

  model: (params) ->
    params.phrase

  deactivate: ->
    @_super.apply(this, arguments)

    @controllerFor('repos').set('search', undefined)

Travis.AbstractBuildsRoute = Travis.Route.extend
  renderTemplate: ->
    @render 'builds'

  setupController: ->
    @controllerFor('repo').activate(@get('contentType'))
    @contentDidChange()
    @controllerFor('repo').addObserver(@get('path'), this, 'contentDidChange')

  deactivate: ->
    @controllerFor('repo').removeObserver(@get('path'), this, 'contentDidChange')

  contentDidChange: ->
    path = @get('path')
    @controllerFor('builds').set('model', @controllerFor('repo').get(path))

  path: (->
    type = @get('contentType')
    "repo.#{type.camelize()}"
  ).property('contentType')

Travis.BuildsRoute = Travis.AbstractBuildsRoute.extend(contentType: 'builds')
Travis.BranchesRoute = Travis.AbstractBuildsRoute.extend(contentType: 'branches')
Travis.PullRequestsRoute = Travis.AbstractBuildsRoute.extend(
  contentType: 'pull_requests'

  # TODO: it would be better to have separate controller for branches and PRs list
  setupController: (controller, model) ->
    @_super(controller, model)

    this.controllerFor('builds').set('isPullRequestsList', true)

  deactivate: ->
    this.controllerFor('builds').set('isPullRequestsList', false)
)

Travis.BuildRoute = Travis.Route.extend
  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { build_id: id }

  setupController: (controller, model) ->
    model = Travis.Build.find(model) if model && !model.get

    repo = @controllerFor('repo')
    #repo.set('build', model)
    @controllerFor('build').set('build', model)
    repo.activate('build')
    #repo.set('build', model)

  model: (params) ->
    Travis.Build.fetch(params.build_id)

  deactivate: ->
    @controllerFor('job').set('job', null)
    @controllerFor('build').set('build', null)

Travis.JobRoute = Travis.Route.extend
  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { job_id: id }

  setupController: (controller, model) ->
    model = Travis.Job.find(model) if model && !model.get

    repo = @controllerFor('repo')
    @controllerFor('job').set('job', model)
    repo.activate('job')

    if build = model.get('build')
      @controllerFor('build').set('build', build)

  model: (params) ->
    Travis.Job.fetch(params.job_id)

  deactivate: ->
    @controllerFor('build').set('build', null)
    @controllerFor('job').set('job', null)


Travis.RepoIndexRoute = Travis.Route.extend
  setupController: (controller, model) ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('current')

  renderTemplate: ->
    if @modelFor('repo').get('lastBuildId')
      @render 'build'
    else
      @render 'builds/not_found'

  deactivate: ->
    repo = @controllerFor('repo')
    @controllerFor('build').set('build', null)
    @controllerFor('job').set('job', null)

Travis.RepoRoute = Travis.Route.extend
  renderTemplate: ->
    @render 'repo', into: 'main'

  setupController: (controller, model) ->
    # TODO: if repo is just a data hash with id and slug load it
    #       as incomplete record
    model = Travis.Repo.find(model.id) if model && !model.get
    controller.set('repo', model)

  serialize: (repo) ->
    slug = if repo.get then repo.get('slug') else repo.slug
    [owner, name] = slug.split('/')
    { owner: owner, name: name }

  model: (params) ->
    slug = "#{params.owner}/#{params.name}"
    Travis.Repo.fetchBySlug(slug)

  resetController: ->
    @controllerFor('repo').deactivate()

  actions:
    error: (error) ->
      # if error throwed has a slug (ie. it was probably repo not found)
      # set the slug on main.error controller to allow to properly
      # display the repo information
      if error.slug
        this.controllerFor('main.error').set('slug', error.slug)

      # bubble to the top
      return true

Travis.MainIndexRoute = Travis.Route.extend
  redirect: ->
    target = if @signedIn() then 'repositories' else 'recent'
    @transitionTo("main.#{target}")

Travis.MainRoute = Travis.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'home')

    @_super.apply this, arguments

    @render 'repos',   outlet: 'left', into: 'main'

  setupController: (controller)->
    # TODO: this is redundant with repositories and recent routes
    toActivate = if @signedIn() then 'owned' else 'recent'
    @container.lookup('controller:repos').activate(toActivate)

Travis.StatsRoute = Travis.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'stats')

    @render 'stats'

Travis.NotFoundRoute = Travis.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'not-found')

    @render 'not_found'

Travis.ProfileRoute = Travis.Route.extend
  needsAuth: true

  setupController: (controller, model) ->
    @controllerFor('accounts').set('model', model)

  renderTemplate: ->
    $('body').attr('id', 'profile')
    @_super.apply(this, arguments)
    @render 'loading', outlet: 'left', into: 'profile'

Travis.AccountsRoute = Travis.Route.extend
  model: ->
    Travis.Account.fetch(all: true)

  renderTemplate: ->
    @_super.apply(this, arguments)
    @render 'profile_accounts', outlet: 'left', into: 'profile'

Travis.AccountsIndexRoute = Travis.Route.extend
  redirect: ->
    # TODO: setting accounts model in ProfileRoute is wrong, but
    #       at this stage it's better than what we had before
    accounts = @modelFor('accounts')
    login    = @controllerFor('currentUser').get('login')
    account  = accounts.find (account) -> account.get('login') == login
    @replaceWith 'account', account

Travis.AccountRoute = Travis.Route.extend
  setupController: (controller, account) ->
    @_super.apply this, arguments

    @controllerFor('profile').activate 'hooks'

  model: (params) ->
    @modelFor('accounts').find (account) -> account.get('login') == params.login

  serialize: (account) ->
    if account && account.get
      { login: account.get('login') }
    else
      {}

Travis.AccountsInfoRoute = Travis.Route.extend
  setupController: ->
    user = @controllerFor('currentUser').get('model')
    @controllerFor('account').set('model', user)
    @controllerFor('profile').activate 'user'

  renderTemplate: ->
    @render 'accounts_info'

Travis.AuthRoute = Travis.Route.extend
  needsAuth: false

  renderTemplate: ->
    $('body').attr('id', 'auth')

    @render 'auth.signin'

  deactivate: ->
    @controllerFor('auth').set('redirected', false)

  actions:
    afterSignIn: ->
      @transitionTo('index')
      return true

  redirect: ->
    if @signedIn()
      @transitionTo('index')

Travis.SettingsRoute = Travis.Route.extend
  needsAuth: true
  setupController: (controller, model) ->
    @controllerFor('repo').activate('settings')

Travis.SettingsIndexRoute = Travis.Route.extend
  model: ->
    repo = @modelFor('repo')
    repo.fetchSettings().then (settings) ->
      repo.set('settings', settings)

Travis.EnvVarsRoute = Travis.Route.extend
  model: (params) ->
    repo = @modelFor('repo')
    repo.get('envVars.promise')

Travis.SshKeyRoute = Travis.Route.extend
  model: (params) ->
    repo = @modelFor('repo')
    self = this
    Travis.SshKey.fetch(repo.get('id')).then ( (result) -> result unless result.get('isNew') ), (xhr) ->
      if xhr.status == 404
        # if there is no model, just return null. I'm not sure if this is the
        # best answer, maybe we should just redirect to different route, like
        # ssh_key.new or ssh_key.no_key
        return null

  afterModel: (model, transition) ->
    repo = @modelFor('repo')
    Travis.ajax.get "/repositories/#{repo.get('id')}/key", (data) =>
      @defaultKey = Ember.Object.create(fingerprint: data.fingerprint)

  setupController: (controller, model) ->
    controller.reset()
    @_super.apply this, arguments

    if @defaultKey
      controller.set('defaultKey', @defaultKey)
      @defaultKey = null

  deactivate: ->
    @_super.apply(this, arguments)

    @controllerFor('ssh_key').send('cancel')
