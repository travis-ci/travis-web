require 'hax0rs'
require 'ext/jquery'

# $.mockjaxSettings.log = false
# Ember.LOG_BINDINGS = true
Ember.ENV.RAISE_ON_DEPRECATION = true

@Travis = Em.Namespace.create
  CONFIG_KEYS: ['rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala']

  INTERVALS: { sponsors: -1, times: -1 }

  # QUEUES: [
  #   { name: 'common',  display: 'Common' },
  #   { name: 'php',     display: 'PHP, Perl and Python' },
  #   { name: 'node_js', display: 'Node.js' },
  #   { name: 'jvmotp',  display: 'JVM and Erlang' },
  #   { name: 'rails',   display: 'Rails' },
  #   { name: 'spree',   display: 'Spree' },
  # ],

  QUEUES: [
    { name: 'common',  display: 'Common' },
    { name: 'jvmotp',  display: 'JVM and Erlang' },
  ],

  run: (attrs) ->
    @app = Travis.App.create(attrs || {})

  App: Em.Application.extend
    init: () ->
      @_super()
      @connect()

      @store = Travis.Store.create()
      @store.loadMany(Travis.Sponsor, Travis.SPONSORS)

      @routes = Travis.Router.create()
      @routes.start()

    connect: ->
      @controller = Em.Controller.create()
      view = Em.View.create
        template: Em.Handlebars.compile('{{outlet layout}}')
        controller: @controller
      view.appendTo(@get('rootElement') || 'body')

    connectLayout: (name) ->
      layout = Travis["#{$.camelize(name)}Controller"].create(parent: @controller)
      layout.connect(@controller)
      layout


require 'controllers'
require 'helpers'
require 'models'
require 'router'
require 'store'
require 'templates'
require 'views'

require 'config/locales'
require 'data/sponsors'

