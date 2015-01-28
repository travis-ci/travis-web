require 'travis/location'
require 'routes/application'

Ember.Router.reopen
  handleURL: (url) ->
    url = url.replace(/#.*?$/, '')
    @_super(url)

Travis.Router.reopen
  location: 'history'

Travis.Router.map ->
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
      @resource 'caches', path: '/caches' if Travis.config.caches_enabled
      @resource 'request', path: '/requests/:request_id'

      @resource 'settings', ->
        @route 'index', path: '/'
        @resource 'env_vars', ->
          @route 'new'
        @resource 'ssh_key' if Travis.config.ssh_key_enabled

  @route 'first_sync'
  @route 'insufficient_oauth_permissions'
  @route 'auth', path: '/auth'

  @resource 'profile', path: '/profile', ->
    @resource 'accounts', path: '/', ->
      @resource 'account', path: '/:login'
      @route 'info', path: '/info'

  @route 'notFound', path: "/*path"

require 'routes/abstract-builds'
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
require 'routes/env-vars'
require 'routes/first-sync'
require 'routes/getting-started'
require 'routes/insufficient-oauth-permissions'
require 'routes/job'
require 'routes/main/index'
require 'routes/main/my-repositories'
require 'routes/main/recent'
require 'routes/main/repositories'
require 'routes/main/search'
require 'routes/main'
require 'routes/main-tab'
require 'routes/not-found'
require 'routes/profile'
require 'routes/pull-requests'
require 'routes/repo/index'
require 'routes/repo'
require 'routes/request'
require 'routes/requests'
require 'routes/route'
require 'routes/settings/index'
require 'routes/settings'
require 'routes/simple-layout'
require 'routes/ssh-key'
require 'routes/dashboard'
require 'routes/dashboard/repositories'
