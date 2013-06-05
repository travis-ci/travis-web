require 'travis/location'
require 'travis/line_number_parser'

Travis.DontSetupModelForControllerMixin = Ember.Mixin.create
  # I've override setup to *not* set controller's model
  # this can be remove when this patch will be merged https://github.com/emberjs/ember.js/pull/2044
  # this will allow us to override setting up model for a controller
  setup: (context) ->
    isTop = undefined
    unless @_redirected
      isTop = true
      @_redirected = []

    @_checkingRedirect = true
    depth = ++@_redirectDepth

    if context is `undefined`
      @redirect()
    else
      @redirect context

    @_redirectDepth--
    @_checkingRedirect = false

    redirected = @_redirected

    @_redirected = null  if isTop

    return false  if redirected[depth]

    controller = @controllerFor(@routeName, context)

    @setupController controller, context
    @renderTemplate controller, context

Ember.Router.reopen
  location: (if testMode? then Ember.NoneLocation.create() else Travis.Location.create())

  handleURL: (url) ->
    Travis.autoSignIn() unless Travis.__container__.lookup('controller:currentUser').get('content')

    url = url.replace(/#.*?$/, '')
    try
      @_super(url)
    catch error
      if error.message.match(/No route matched the URL/)
        @_super('/not-found')
      else
        throw(error)

# TODO: don't reopen Ember.Route to add events, there should be
#       a better way (like "parent" resource for everything inside map)
Ember.Route.reopen
  events:
    afterSignIn: (path) ->
      @afterSignIn(path)

    afterSignOut: ->
      @afterSignOut()

  afterSignIn: (path) ->
    @routeTo(path)

  afterSignOut: ->
    @routeTo('/')

  routeTo: (path) ->
    return unless path
    @router.handleURL(path)
    @router.location.setURL(path)

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

Travis.Router.reopen
  transitionTo: ->
    this.container.lookup('controller:repo').set('lineNumber', null)

    @_super.apply this, arguments


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
  @route 'auth', path: '/auth'
  @route 'notFound', path: '/not-found'

  @resource 'profile', path: '/profile', ->
    @route 'index', path: '/'
    @resource 'account', path: '/:login', ->
      @route 'index', path: '/'
      @route 'profile', path: '/profile'

Travis.ApplicationRoute = Ember.Route.extend Travis.LineNumberParser,
  setupController: ->
    @_super.apply this, arguments

    this.controllerFor('repo').set('lineNumber', @fetchLineNumber())

Travis.SetupLastBuild = Ember.Mixin.create
  setupController: ->
    @lastBuildDidChange()
    @controllerFor('repo').addObserver('repo.lastBuild', this, 'lastBuildDidChange')

  deactivate: ->
    @_super.apply this, arguments
    @controllerFor('repo').removeObserver('repo.lastBuild', this, 'lastBuildDidChange')

  lastBuildDidChange: ->
    build = @controllerFor('repo').get('repo.lastBuild')
    @controllerFor('build').set('build', build)

Travis.IndexCurrentRoute = Ember.Route.extend Travis.DontSetupModelForControllerMixin, Travis.SetupLastBuild,
  renderTemplate: ->
    @render 'repo'
    @render 'build', outlet: 'pane', into: 'repo'

  setupController: ->
    @_super.apply this, arguments
    @currentRepoDidChange()
    @container.lookup('controller:repo').activate('index')
    @controllerFor('repos').addObserver('firstObject', this, 'currentRepoDidChange')

  deactivate: ->
    @controllerFor('repos').removeObserver('firstObject', this, 'currentRepoDidChange')

  currentRepoDidChange: ->
    @controllerFor('repo').set('repo', @controllerFor('repos').get('firstObject'))

Travis.AbstractBuildsRoute = Ember.Route.extend Travis.DontSetupModelForControllerMixin,
  renderTemplate: ->
    @render 'builds', outlet: 'pane', into: 'repo'

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

Travis.BuildRoute = Ember.Route.extend Travis.DontSetupModelForControllerMixin,
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

Travis.JobRoute = Ember.Route.extend Travis.DontSetupModelForControllerMixin,
  renderTemplate: ->
    @render 'job', outlet: 'pane', into: 'repo'

  serialize: (model, params) ->
    id = if model.get then model.get('id') else model

    { job_id: id }

  setupController: (controller, model) ->
    model = Travis.Job.find(model) if model && !model.get

    repo = @controllerFor('repo')
    repo.set('job', model)
    repo.activate('job')
    @controllerFor('build').set('build', model.get('build'))
    repo.set('build', model.get('build'))

Travis.RepoIndexRoute = Ember.Route.extend Travis.DontSetupModelForControllerMixin, Travis.SetupLastBuild,
  setupController: (controller, model) ->
    @_super.apply this, arguments
    @container.lookup('controller:repo').activate('current')

  renderTemplate: ->
    @render 'build', outlet: 'pane', into: 'repo'

Travis.RepoRoute = Ember.Route.extend Travis.DontSetupModelForControllerMixin,
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
    content = Ember.Object.create slug: slug, isLoaded: false, isLoading: true
    proxy = Ember.ObjectProxy.create(content: content)

    repos = Travis.Repo.bySlug(slug)

    observer = ->
      if repos.get 'isLoaded'
        repos.removeObserver 'isLoaded', observer
        proxy.set 'isLoading', false

        if repos.get('length') == 0
          # isError is also used in DS.Model, but maybe we should use something
          # more focused like notFound later
          proxy.set 'isError', true
        else
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

Travis.NotFoundRoute = Ember.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'not-found')

    @render 'top', outlet: 'top'
    @render 'not_found'

  setupController: ->
    @container.lookup('controller:application').connectLayout('simple')

Travis.ProfileRoute = Ember.Route.extend
  needsAuth: true

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
    @render 'hooks', outlet: 'pane', into: 'profile', controller: 'profile'

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

Travis.AuthRoute = Ember.Route.extend
  renderTemplate: ->
    $('body').attr('id', 'auth')

    @render 'top', outlet: 'top'
    @render 'auth.signin'

  setupController: ->
    @container.lookup('controller:application').connectLayout('simple')
