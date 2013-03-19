require 'ext/jquery'
require 'ext/ember/namespace'
require 'app'

window.ENV ||= {}
window.ENV.RAISE_ON_DEPRECATION = true

if window.history.state == undefined
  window.history.state = {}
  oldPushState = window.history.pushState
  window.history.pushState = (state, title, href) ->
    window.history.state = state
    oldPushState.apply this, arguments

  oldReplaceState = window.history.replaceState
  window.history.replaceState = (state, title, href) ->
    window.history.state = state
    oldReplaceState.apply this, arguments

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

window.Travis = TravisApplication.create()

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
