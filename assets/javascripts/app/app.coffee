require 'travis' # hrm.
require 'auth'
require 'controllers'
require 'helpers'
require 'models'
require 'pusher'
require 'routes'
require 'store'
require 'tailing'
require 'templates'
require 'views'

require 'config/locales'
require 'data/sponsors'

# $.mockjaxSettings.log = false
# Ember.LOG_BINDINGS = true
# Ember.ENV.RAISE_ON_DEPRECATION = true
# Pusher.log = -> console.log(arguments)

Travis.reopen
  App: Em.Application.extend
    currentUserBinding: 'auth.user'
    accessTokenBinding: 'auth.user.token'
    authStateBinding: 'auth.state'

    init: ->
      @_super()
      @connect()

      @store = Travis.Store.create()
      @store.loadMany(Travis.Sponsor, Travis.SPONSORS)

      @routes = new Travis.Routes()
      @pusher = new Travis.Pusher()
      @tailing = new Travis.Tailing()

      @set('auth', Travis.Auth.create(store: @store, endpoint: Travis.config.api_endpoint))

    signIn: ->
      @get('auth').signIn()

    signOut: ->
      @get('auth').signOut()

    render: (name, action, params) ->
      layout = @connectLayout(name)
      layout.activate(action, params || {})
      $('body').attr('id', name)

    receive: ->
      @store.receive.apply(@store, arguments)

    connectLayout: (name) ->
      unless @get('layout.name') == name
        name = $.camelize(name)
        viewClass = Travis["#{name}Layout"]
        @layout = Travis["#{name}Controller"].create(parent: @controller)
        @controller.connectOutlet(outletName: 'layout', controller: @layout, viewClass: viewClass)
      @layout

    connect: ->
      @controller = Em.Controller.create()
      view = Em.View.create
        template: Em.Handlebars.compile('{{outlet layout}}')
        controller: @controller
      view.appendTo(@get('rootElement') || 'body')

    toggleSidebar: ->
      $('body').toggleClass('maximized')
      # TODO gotta force redraws here :/
      element = $('<span></span>')
      $('#top .profile').append(element)
      Em.run.later (-> element.remove()), 10
      element = $('<span></span>')
      $('#repository').append(element)
      Em.run.later (-> element.remove()), 10

