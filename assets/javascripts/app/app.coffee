require 'hax0rs'
require 'ext/jquery'

# $.mockjaxSettings.log = false
# Ember.LOG_BINDINGS = true

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

  run: ->
    @app = Travis.App.create(this)
    @app.initialize()

  App: Em.Application.extend
    initialize: (router) ->
      @connect()

      @store = Travis.Store.create()
      @store.loadMany(Travis.Sponsor, Travis.SPONSORS)
      @store.load(Travis.User, { id: 1, login: 'svenfuchs', name: 'Sven Fuchs', email: 'me@svenfuchs.com', token: '1234567890', gravatar: '402602a60e500e85f2f5dc1ff3648ecb' })

      @currentUser = Travis.User.find(1)

      @routes = Travis.Router.create(app: this)
      @_super(Em.Object.create())
      @routes.start()

    connect: ->
      @controller = Em.Controller.create()
      view = Em.View.create
        template: Em.Handlebars.compile('{{outlet layout}}')
        controller: @controller
      view.appendTo(@get('rootElement') || 'body')


require 'controllers'
require 'helpers'
require 'layout'
require 'models'
require 'router'
require 'store'
require 'templates'
require 'views'

require 'config/locales'
require 'data/sponsors'

