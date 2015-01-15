require 'travis/location'
require 'routes/application'

Ember.Router.reopen
  location: (if testMode? then Ember.NoneLocation.create() else Travis.Location.create())

  handleURL: (url) ->
    url = url.replace(/#.*?$/, '')
    @_super(url)

Travis.Router.map ->
  @resource 'dashboard'
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

require 'routes/abstract_builds'
require 'routes/account'
require 'routes/accounts/index'
require 'routes/accounts/info'
require 'routes/accounts'
require 'routes/application'
require 'routes/auth'
require 'routes/branches'
require 'routes/build'
require 'routes/builds'
require 'routes/caches'
require 'routes/env_vars'
require 'routes/first_sync'
require 'routes/getting_started'
require 'routes/insufficient_oauth_permissions'
require 'routes/job'
require 'routes/main/index'
require 'routes/main/my_repositories'
require 'routes/main/recent'
require 'routes/main/repositories'
require 'routes/main/search'
require 'routes/main'
require 'routes/main_tab'
require 'routes/not_found'
require 'routes/profile'
require 'routes/pull_requests'
require 'routes/repo/index'
require 'routes/repo'
require 'routes/request'
require 'routes/requests'
require 'routes/route'
require 'routes/settings/index'
require 'routes/settings'
require 'routes/simple_layout'
require 'routes/ssh_key'
require 'routes/stats'
require 'routes/dashboard'
