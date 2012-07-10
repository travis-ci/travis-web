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

    receive: (event, data) ->
      Travis.app.store.loadData(event, data)

    connect: ->
      @controller = Em.Controller.create()
      view = Em.View.create
        template: Em.Handlebars.compile('{{outlet layout}}')
        controller: @controller
      view.appendTo(@get('rootElement') || 'body')

    connectLayout: (name) ->
      unless @getPath('layout.name') == name
        name = $.camelize(name)
        viewClass = Travis["#{name}Layout"]
        @layout = Travis["#{name}Controller"].create(parent: @controller)
        @controller.connectOutlet(outletName: 'layout', controller: @layout, viewClass: viewClass)
      @layout


require 'controllers'
require 'helpers'
require 'models'
require 'router'
require 'store'
require 'templates'
require 'views'

require 'data/sponsors'

