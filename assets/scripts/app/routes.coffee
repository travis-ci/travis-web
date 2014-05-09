require 'travis/location'

Ember.Router.reopen
  location: (if testMode? then Ember.NoneLocation.create() else Travis.Location.create())

  handleURL: (url) ->
    url = url.replace(/#.*?$/, '')
    @_super(url)

Travis.Route = Ember.Route.extend
  renderFirstSync: ->
    @transitionTo 'first_sync'

  beforeModel: (transition) ->
    Travis.autoSignIn() unless @signedIn()

    if !@signedIn() && @get('needsAuth')
      Travis.auth.set('afterSignInTransition', transition)
      Ember.RSVP.reject("needs-auth")
    else
      @_super.apply(this, arguments)

  signedIn: ->
    @controllerFor('currentUser').get('content')

  redirect: ->
    Travis.autoSignIn() unless @signedIn()

    if @get('needsAuth')
      @authorize(@router.location.getURL())
    else
      @_super.apply this, arguments

  authorize: (path) ->
    if !@signedIn()
      Travis.storeAfterSignInPath(path)
      @transitionTo('auth')

Travis.ApplicationRoute = Travis.Route.extend
  actions:
    redirectToGettingStarted: ->
      # do nothing, we handle it only in index path

    renderDefaultTemplate: ->
      @renderDefaultTemplate() if @renderDefaultTemplate

    error: (error) ->
      if error == 'needs-auth'
        authController = @container.lookup('controller:auth') || @generateController('auth')
        authController.set('redirected', true)
        @transitionTo('auth')
      else
        return true

    renderFirstSync: ->
      @renderFirstSync()

    afterSignIn: ->
      if transition = Travis.auth.get('afterSignInTransition')
        Travis.auth.set('afterSignInTransition', null)
        transition.retry()

    afterSignOut: ->
      @transitionTo('index.current')

Travis.Router.reopen
  transitionTo: ->
    this.container.lookup('controller:repo').set('lineNumber', null)

    @_super.apply this, arguments

Travis.Router.map ->
  @resource 'index', path: '/', ->
    @resource 'getting_started'
    @route 'current', path: '/'
    @resource 'repo', path: '/:owner/:name', ->
      @route 'index', path: '/'
      @resource 'build', path: '/builds/:build_id'
      @resource 'job',   path: '/jobs/:job_id'
      @resource 'builds', path: '/builds'
      @resource 'pullRequests', path: '/pull_requests'
      @resource 'branches', path: '/branches'
      @resource 'requests', path: '/requests'
      @resource 'request', path: '/requests/:request_id'

    # this can't be nested in repo, because we want a set of different
    # templates rendered for settings (for example no "current", "builds", ... tabs)
    @resource 'repo.settings', path: '/:owner/:name/settings', ->
      @route 'tab', path: ':tab'

  @route 'first_sync'
  @route 'insufficient_oauth_permissions'
  @route 'stats', path: '/stats'
  @route 'auth', path: '/auth'

  @resource 'profile', path: '/profile', ->
    @route 'index', path: '/'
    @resource 'account', path: '/:login', ->
      @route 'index', path: '/'
      @route 'profile', path: '/profile'

  @route 'notFound', path: "/*path"

Travis.SetupLastBuild = Ember.Mixin.create
  setupController: ->
    @repoDidLoad()
    @controllerFor('repo').addObserver('repo.isLoaded', this, 'repoDidLoad')

  repoDidLoad: ->
    # TODO: it would be nicer to do it with promises
    repo = @controllerFor('repo').get('repo')
    if repo && repo.get('isLoaded') && !repo.get('lastBuildId')
      Ember.run.next =>
        @render('builds/not_found', into: 'repo', outlet: 'pane')

Travis.RepoLoadingRoute = Travis.Route.extend
  renderTemplate: ->
    # TODO: the main outlet used on repo level is called 'pane'
    #       which makes a few things quite hard with current Ember.js
    #       conventions. Here, we need to specify render behaviour
    #       of a loading route explicitly, because otherwise it will
    #       render into 'main' outlet. It would be nice to change
    #       pane outlet into main outlet at some point
    @render 'repo/loading', into: 'repo', outlet: 'pane'

Travis.RequestsRoute = Travis.Route.extend
  renderTemplate: ->
    @render 'requests', into: 'repo', outlet: 'pane'

  setupController: ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('requests')

  model: ->
    Travis.Request.fetch repository_id: @modelFor('repo').get('id')

Travis.RequestRoute = Travis.Route.extend
  renderTemplate: ->
    @render 'request', into: 'repo', outlet: 'pane'

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
    @container.lookup('controller:repos').activate()
    @container.lookup('controller:application').connectLayout 'simple'
    @_super.apply(this, arguments)

  renderTemplate: ->
    @render 'top', outlet: 'top'
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

Travis.IndexCurrentRoute = Travis.Route.extend Travis.SetupLastBuild,
  renderTemplate: ->
    @render 'repo'
    @render 'build', into: 'repo', outlet: 'pane'

  setupController: ->
    @_super.apply this, arguments
    @currentRepoDidChange()

    @controllerFor('repo').activate('index')
    @controllerFor('repos').addObserver('firstObject', this, 'currentRepoDidChange')

  afterModel: ->
    @controllerFor('repos').possiblyRedirectToGettingStartedPage()

  deactivate: ->
    @controllerFor('repos').removeObserver('firstObject', this, 'currentRepoDidChange')

  currentRepoDidChange: ->
    @controllerFor('repo').set('repo', @controllerFor('repos').get('firstObject'))

  actions:
    redirectToGettingStarted: ->
      @transitionTo('getting_started')

Travis.AbstractBuildsRoute = Travis.Route.extend
  renderTemplate: ->
    @render 'builds', into: 'repo', outlet: 'pane'

  setupController: ->
    @controllerFor('repo').activate(@get('contentType'))
    @contentDidChange()
    @controllerFor('repo').addObserver(@get('path'), this, 'contentDidChange')

  deactivate: ->
    @controllerFor('repo').removeObserver(@get('path'), this, 'contentDidChange')

  contentDidChange: ->
    path = @get('path')
    @controllerFor('builds').set('content', @controllerFor('repo').get(path))

  path: (->
    type = @get('contentType')
    "repo.#{type.camelize()}"
  ).property('contentType')

Travis.BuildsRoute = Travis.AbstractBuildsRoute.extend(contentType: 'builds')
Travis.PullRequestsRoute = Travis.AbstractBuildsRoute.extend(contentType: 'pull_requests')
Travis.BranchesRoute = Travis.AbstractBuildsRoute.extend(contentType: 'branches')

Travis.BuildRoute = Travis.Route.extend
  renderTemplate: ->
    @render 'build', into: 'repo', outlet: 'pane'

  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { build_id: id }

  setupController: (controller, model) ->
    model = Travis.Build.find(model) if model && !model.get

    repo = @controllerFor('repo')
    repo.set('build', model)
    repo.activate('build')
    @controllerFor('build').set('build', model)
    repo.set('build', model)

  model: (params) ->
    Travis.Build.fetch(params.build_id)

Travis.JobRoute = Travis.Route.extend
  renderTemplate: ->
    @render 'job', into: 'repo', outlet: 'pane'

  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { job_id: id }

  setupController: (controller, model) ->
    model = Travis.Job.find(model) if model && !model.get

    repo = @controllerFor('repo')
    repo.set('job', model)
    repo.activate('job')

    if build = model.get('build')
      @controllerFor('build').set('build', build)
      repo.set('build', build)

  model: (params) ->
    Travis.Job.fetch(params.job_id)

Travis.RepoIndexRoute = Travis.Route.extend Travis.SetupLastBuild,
  setupController: (controller, model) ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('current')

  renderTemplate: ->
    @render 'build', into: 'repo', outlet: 'pane'

Travis.RepoRoute = Travis.Route.extend
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

  model: (params) ->
    slug = "#{params.owner}/#{params.name}"
    Travis.Repo.fetchBySlug(slug)

  actions:
    error: (error) ->
      # if error throwed has a slug (ie. it was probably repo not found)
      # set the slug on index.error controller to allow to properly
      # display the repo information
      if error.slug
        this.controllerFor('index.error').set('slug', error.slug)

      # bubble to the top
      return true

Travis.IndexRoute = Travis.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'home')

    @render 'repos',   outlet: 'left'
    @render 'top',     outlet: 'top'
    @render 'flash',   outlet: 'flash'

  setupController: (controller)->
    @container.lookup('controller:repos').activate()
    @container.lookup('controller:application').connectLayout 'home'

Travis.StatsRoute = Travis.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'stats')

    @render 'top', outlet: 'top'
    @render 'stats'

  setupController: ->
    @container.lookup('controller:application').connectLayout('simple')

Travis.NotFoundRoute = Travis.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'not-found')

    @render 'top', outlet: 'top'
    @render 'not_found'

  setupController: ->
    @container.lookup('controller:application').connectLayout('simple')

Travis.ProfileRoute = Travis.Route.extend
  needsAuth: true

  setupController: ->
    @container.lookup('controller:application').connectLayout('profile')
    @container.lookup('controller:accounts').set('content', Travis.Account.find(all: true))

  renderTemplate: ->
    $('body').attr('id', 'profile')

    @render 'top', outlet: 'top'
    @render 'accounts', outlet: 'left'
    @render 'flash', outlet: 'flash'
    @_super.apply(this, arguments)

Travis.ProfileIndexRoute = Travis.Route.extend
  setupController: ->
    @container.lookup('controller:profile').activate 'hooks'

  renderTemplate: ->
    @render 'hooks', outlet: 'pane', into: 'profile', controller: 'profile'

Travis.AccountRoute = Travis.Route.extend
  setupController: (controller, account) ->
    profileController = @container.lookup('controller:profile')
    profileController.activate 'hooks'

    if account
      params = { login: account.get('login') }
      profileController.setParams(params)

  model: (params) ->
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
    if account && account.get
      { login: account.get('login') }
    else
      {}

Travis.AccountIndexRoute = Travis.Route.extend
  setupController: ->
    @container.lookup('controller:profile').activate 'hooks'

  renderTemplate: ->
    @render 'hooks', outlet: 'pane', into: 'profile'

Travis.AccountProfileRoute = Travis.Route.extend
  setupController: ->
    @container.lookup('controller:profile').activate 'user'

  renderTemplate: ->
    @render 'user', outlet: 'pane', into: 'profile'

Travis.AuthRoute = Travis.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'auth')

    @render 'top', outlet: 'top'
    @render 'auth.signin'

  setupController: ->
    @container.lookup('controller:application').connectLayout('simple')

  deactivate: ->
    @controllerFor('auth').set('redirected', false)

  actions:
    afterSignIn: ->
      @transitionTo('index.current')
      return true

Travis.RepoSettingsRoute = Travis.Route.extend
  setupController: (controller, model) ->
    # TODO: if repo is just a data hash with id and slug load it
    #       as incomplete record
    model = Travis.Repo.find(model.id) if model && !model.get
    @_super(controller, model)

  serialize: (repo) ->
    slug = if repo.get then repo.get('slug') else repo.slug
    [owner, name] = slug.split('/')
    { owner: owner, name: name }

  model: (params) ->
    slug = "#{params.owner}/#{params.name}"
    Travis.Repo.fetchBySlug(slug)

  afterModel: (repo) ->
    # I'm using afterModel to fetch settings, because model is not always called.
    # If link-to already provides a model, it will be just set as a route context.
    repo.fetchSettings().then (settings) ->
      repo.set('settings', settings)
