require 'auth'
require 'controllers'
require 'helpers'
require 'models'
require 'pusher'
require 'routes'
require 'slider'
require 'store'
require 'tailing'
require 'templates'
require 'views'

require 'config/locales'
require 'data/sponsors'

require 'travis/instrumentation'
# $.mockjaxSettings.log = false
# Ember.LOG_BINDINGS = true
# Ember.ENV.RAISE_ON_DEPRECATION = true
# Pusher.log = -> console.log(arguments)

Travis.reopen
  App: Em.Application.extend
    autoinit: false
    currentUserBinding: 'auth.user'
    authStateBinding: 'auth.state'

    init: ->
      @_super.apply this, arguments

      @store = Travis.Store.create()
      @store.loadMany(Travis.Sponsor, Travis.SPONSORS)

      @slider = new Travis.Slider()
      @pusher = new Travis.Pusher(Travis.config.pusher_key)
      @tailing = new Travis.Tailing()

      @set('auth', Travis.Auth.create(app: this, endpoint: Travis.config.api_endpoint))

    storeAfterSignInPath: (path) ->
      @get('auth').storeAfterSignInPath(path)

    autoSignIn: (path) ->
      @get('auth').autoSignIn(path)

    signIn: ->
      @get('auth').signIn()

    signOut: ->
      @get('auth').signOut()
      @get('router').send('afterSignOut')

    receive: ->
      @store.receive.apply(@store, arguments)

    toggleSidebar: ->
      $('body').toggleClass('maximized')
      # TODO gotta force redraws here :/
      element = $('<span></span>')
      $('#top .profile').append(element)
      Em.run.later (-> element.remove()), 10
      element = $('<span></span>')
      $('#repo').append(element)
      Em.run.later (-> element.remove()), 10
