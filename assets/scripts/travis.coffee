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

Ember.RecordArray.reopen
  # TODO: ember.js changed a way ArrayProxies behave, so that check for content is done
  #       in _replace method. I should not be overriding it, because it's private, but
  #       there is no easy other way to do it at this point
  _replace: (index, removedCount, records) ->
    # in Travis it's sometimes the case that we add new records to RecordArrays
    # from pusher before its content has loaded from an ajax query. In order to handle
    # this case nicer I'm extending record array to buffer those records and push them
    # to content when it's available
    @bufferedRecords = [] unless @bufferedRecords

    if !@get('content')
      for record in records
        @bufferedRecords.pushObject(record) unless @bufferedRecords.contains(record)

      records = []

    # call super only if there's anything more to add
    if removedCount || records.length
      @_super(index, removedCount, records)

  contentDidChange: (->
    if (content = @get('content')) && @bufferedRecords && @bufferedRecords.length
      for record in @bufferedRecords
        content.pushObject(record) unless content.contains(record)
      @bufferedRecords = []
  ).observes('content')

window.Travis = TravisApplication.create(
  LOG_TRANSITIONS: true
)

Travis.deferReadiness()

$.extend Travis,
  run: ->
    Travis.advanceReadiness() # bc, remove once merged to master

  config:
    api_endpoint: $('meta[rel="travis.api_endpoint"]').attr('href')
    pusher_key:   $('meta[name="travis.pusher_key"]').attr('value')
    ga_code:      $('meta[name="travis.ga_code"]').attr('value')
    code_climate: $('meta[name="travis.code_climate"]').attr('value')
    code_climate_url: $('meta[name="travis.code_climate_url"]').attr('value')

  CONFIG_KEYS: ['go', 'rvm', 'gemfile', 'env', 'jdk', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala', 'compiler']

  QUEUES: [
    { name: 'linux',   display: 'Linux' }
    { name: 'mac_osx', display: 'Mac and OSX' }
  ]

  INTERVALS: { times: -1, updateTimes: 1000 }

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

Travis.initializer
  name: 'googleAnalytics'

  initialize: (container) ->
    if Travis.config.ga_code
      window._gaq = []
      _gaq.push(['_setAccount', Travis.config.ga_code])

      ga = document.createElement('script')
      ga.type = 'text/javascript'
      ga.async = true
      ga.src = 'https://ssl.google-analytics.com/ga.js'
      s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(ga, s)

Travis.Router.reopen
  didTransition: ->
    @_super.apply @, arguments

    if Travis.config.ga_code
      _gaq.push ['_trackPageview', location.pathname]

require 'ext/i18n'
require 'travis/ajax'
require 'travis/adapter'
require 'routes'
require 'auth'
require 'controllers'
require 'helpers'
require 'models'
require 'pusher'
require 'slider'
require 'tailing'
require 'templates'
require 'views'

require 'config/locales'

require 'travis/instrumentation'

Travis.setup()
