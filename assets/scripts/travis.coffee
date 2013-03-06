require 'ext/jquery'
require 'ext/ember/namespace'

window.ENV ||= {}
window.ENV.RAISE_ON_DEPRECATION = true

# TODO: how can I put it in Travis namespace and use immediately?
Storage = Em.Object.extend
  init: ->
    @set('storage', {})
  key: (key) ->
    "__#{key.replace('.', '__')}"
  getItem: (k) ->
    return @get("storage.#{@key(k)}")
  setItem: (k,v) ->
    @set("storage.#{@key(k)}", v)
  removeItem: (k) ->
    @setItem(k, null)
  clear: ->
    @set('storage', {})

window.Travis = Em.Application.extend(Ember.Evented,
  authStateBinding: 'auth.state'
  signedIn: (-> @get('authState') == 'signed-in' ).property('authState')

  setup: ->
    @store = Travis.Store.create(
      adapter: Travis.RestAdapter.create()
    )
    @store.loadMany(Travis.Sponsor, Travis.SPONSORS)

    @slider = new Travis.Slider()
    @pusher = new Travis.Pusher(Travis.config.pusher_key)
    @tailing = new Travis.Tailing()

    @set('auth', Travis.Auth.create(app: this, endpoint: Travis.config.api_endpoint))

  reset: ->
    @store.destroy()
    @setup()

    @_super.apply(this, arguments);

  lookup: ->
    @__container__.lookup.apply this, arguments

  storeAfterSignInPath: (path) ->
    @get('auth').storeAfterSignInPath(path)

  autoSignIn: (path) ->
    @get('auth').autoSignIn()

  signIn: ->
    @get('auth').signIn()

  signOut: ->
    @get('auth').signOut()

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

  setLocale: (locale) ->
    return unless locale
    I18n.locale = locale
    Travis.set('locale', locale)

  defaultLocale: 'en'

  ready: ->
    location.href = location.href.replace('#!/', '') if location.hash.slice(0, 2) == '#!'
    I18n.fallbacks = true
    @setLocale 'locale', @get('defaultLocale')

  currentDate: ->
    new Date()
).create()

Travis.deferReadiness()

$.extend Travis,
  run: ->
    Travis.advanceReadiness() # bc, remove once merged to master

  config:
    api_endpoint: $('meta[rel="travis.api_endpoint"]').attr('href')
    pusher_key:   $('meta[name="travis.pusher_key"]').attr('value')
    ga_code:      $('meta[name="travis.ga_code"]').attr('value')

  CONFIG_KEYS: ['rvm', 'gemfile', 'env', 'jdk', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala', 'compiler']

  QUEUES: [
    { name: 'common',  display: 'Common' }
    { name: 'linux',   display: 'Linux' }
    { name: 'mac_osx', display: 'Mac and OSX' }
  ]

  INTERVALS: { sponsors: -1, times: -1, updateTimes: 1000 }

  storage: (->
    storage = null
    try
      storage = window.localStorage || throw('no storage')
    catch err
      storage = Storage.create()

    storage
  )()

  sessionStorage: (->
    storage = null
    try
      # firefox will not throw error on access for sessionStorage var,
      # you need to actually get something from session
      sessionStorage.getItem('foo')
      storage = sessionStorage
    catch err
      storage = Storage.create()

    storage
  )()

setupGoogleAnalytics() if Travis.config.ga_code

require 'ext/i18n'
require 'travis/ajax'
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

Travis.setup()
