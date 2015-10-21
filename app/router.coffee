`import Ember from 'ember'`
`import config from './config/environment'`
`import Location from 'travis/utils/location'`

Router = Ember.Router.extend
  location: (->
    if Ember.testing
      'none'
    else
      # this is needed, because in the location
      # we need to decide if repositories or home needs
      # to be displayed, based on the current login status
      #
      # we should probably think about a more general way to
      # do this, location should not know about auth status
      Location.create(auth: @container.lookup('auth:main'))
  ).property()

  # TODO: this is needed, because in the original version
  # the router tries to run `this.location`, which fails
  # with computed properties. It can be removed once this is
  # changed in Ember.js
  generate: ->
    url = this.router.generate.apply(this.router, arguments)
    return this.get('location').formatURL(url)

  handleURL: (url) ->
    url = url.replace(/#.*?$/, '')
    @_super(url)

  didTransition: ->
    @_super.apply @, arguments

    if config.gaCode
      _gaq.push ['_trackPageview', location.pathname]

Router.map ->
  @resource 'dashboard', ->
    @route 'repositories', path: '/'

  @resource 'main', path: '/', ->
    @resource 'getting_started'
    @route 'recent'
    @route 'repositories'
    @route 'my_repositories'
    @route 'search', path: '/search/:phrase'
    @resource 'repo', path: '/:owner/:name', ->
      @route 'index', path: '/'
      @resource 'branches', path: '/branches'
      @resource 'build', path: '/builds/:build_id'
      @resource 'job',   path: '/jobs/:job_id'
      @resource 'builds', path: '/builds'
      @resource 'pullRequests', path: '/pull_requests'
      @resource 'requests', path: '/requests'
      @resource 'caches', path: '/caches' if config.endpoints.caches
      @resource 'request', path: '/requests/:request_id'

      @resource 'settings', ->
        @route 'index', path: '/'
        @resource 'env_vars', ->
          @route 'new'
        @resource 'ssh_key' if config.endpoints.sshKey

  @route 'first_sync'
  @route 'insufficient_oauth_permissions'
  @route 'auth'
  @route 'home'

  @route 'home-pro', path: '/home-pro'

  @resource 'profile', path: '/profile', ->
    @resource 'accounts', path: '/', ->
      @resource 'account', path: '/:login'
      @route 'info', path: '/info'

  @resource 'owner', path: '/:owner', ->
    @route 'repositories', path: '/'
    # @route 'running', path: '/running'

  @route 'error404', path: '/404'

`export default Router`
