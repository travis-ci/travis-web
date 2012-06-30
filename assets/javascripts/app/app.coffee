require 'hax0rs'

# $.mockjaxSettings.log = false
# Ember.LOG_BINDINGS = true

@Travis = Em.Namespace.create
  CONFIG_KEYS: ['rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala']

  run: ->
    @app = Travis.App.create(this)
    @app.initialize()

  App: Em.Application.extend
    initialize: (router) ->
      @store = Travis.Store.create()
      @routes = Travis.Router.create(app: this)
      @_super(Em.Object.create())
      @routes.start()

require 'ext/jquery'
require 'controllers'
require 'helpers'
require 'layout'
require 'models'
require 'router'
require 'store'
require 'templates'
require 'views'
require 'locales'
