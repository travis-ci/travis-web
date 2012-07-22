require 'hax0rs'
require 'ext/jquery'

# $.mockjaxSettings.log = false
# Ember.LOG_BINDINGS = true
Ember.ENV.RAISE_ON_DEPRECATION = true
# Pusher.log = -> console.log(arguments)

@Travis = Em.Namespace.create
  CONFIG_KEYS: ['rvm', 'gemfile', 'env', 'jdk', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala']

  INTERVALS: { sponsors: -1, times: -1 }

  QUEUES: [
    { name: 'common',  display: 'Common' }
    { name: 'php',     display: 'PHP, Perl and Python' }
    { name: 'node_js', display: 'Node.js' }
    { name: 'jvmotp',  display: 'JVM and Erlang' }
    { name: 'rails',   display: 'Rails' }
    { name: 'spree',   display: 'Spree' }
  ]

  run: (attrs) ->
    @app = Travis.App.create(attrs || {})

  App: Em.Application.extend
    init: ->
      @_super()
      @connect()

      @store = Travis.Store.create()
      @store.loadMany(Travis.Sponsor, Travis.SPONSORS)

      @routes = new Travis.Routes()
      # @pusher = new Travis.Pusher()

    connect: ->
      @controller = Em.Controller.create()
      view = Em.View.create
        template: Em.Handlebars.compile('{{outlet layout}}')
        controller: @controller
      view.appendTo(@get('rootElement') || 'body')

    connectLayout: (name) ->
      unless @get('layout.name') == name
        name = $.camelize(name)
        viewClass = Travis["#{name}Layout"]
        @layout = Travis["#{name}Controller"].create(parent: @controller)
        @controller.connectOutlet(outletName: 'layout', controller: @layout, viewClass: viewClass)
      @layout

require 'controllers'
require 'helpers'
require 'models'
require 'pusher'
require 'routes'
require 'store'
require 'templates'
require 'views'

require 'config/locales'
require 'data/sponsors'

