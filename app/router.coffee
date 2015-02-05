`import Ember from 'ember'`
`import config from './config/environment'`
`import Location from 'travis/utils/location'`

Router = Ember.Router.extend
  # TODO: we should use TravisLocation here
  location: if Ember.testing then 'none' else 'history'

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
      @resource 'build', path: '/builds/:build_id'
      @resource 'job',   path: '/jobs/:job_id'
      @resource 'builds', path: '/builds'
      @resource 'pullRequests', path: '/pull_requests'
      @resource 'branches', path: '/branches'
      @resource 'requests', path: '/requests'
      @resource 'caches', path: '/caches' if config.endpoints.caches
      @resource 'request', path: '/requests/:request_id'

      @resource 'settings', ->
        @route 'index', path: '/'
        @resource 'env_vars', ->
          @route 'new'
        @resource 'ssh_key' if config.endpoints.ssh_key

  @route 'first_sync'
  @route 'insufficient_oauth_permissions'
  @route 'auth', path: '/auth'

  @resource 'profile', path: '/profile', ->
    @resource 'accounts', path: '/', ->
      @resource 'account', path: '/:login'
      @route 'info', path: '/info'

  @route 'error404', path: "/*path"

`export default Router`
