require 'ext/jquery'
require 'ext/ember/namespace'
require 'ext/ember/computed'
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
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true
)

Travis.deferReadiness()

$.extend Travis,
  run: ->
    Travis.advanceReadiness() # bc, remove once merged to master

  config:
    syncingPageRedirectionTime: 5000
    api_endpoint:    $('meta[rel="travis.api_endpoint"]').attr('href')
    source_endpoint: $('meta[rel="travis.source_endpoint"]').attr('href')
    pusher_key:      $('meta[name="travis.pusher_key"]').attr('value')
    pusher_host:     $('meta[name="travis.pusher_host"]').attr('value')
    ga_code:         $('meta[name="travis.ga_code"]').attr('value')
    code_climate: $('meta[name="travis.code_climate"]').attr('value')
    ssh_key_enabled: $('meta[name="travis.ssh_key_enabled"]').attr('value') == 'true'
    code_climate_url: $('meta[name="travis.code_climate_url"]').attr('value')
    caches_enabled: $('meta[name="travis.caches_enabled"]').attr('value') == 'true'
    show_repos_hint: 'private'
    avatar_default_url: 'https://travis-ci.org/images/ui/default-avatar.png'
    pusher_log_fallback:  $('meta[name="travis.pusher_log_fallback"]').attr('value') == 'true'

  CONFIG_KEYS_MAP: {
    go:          'Go'
    rvm:         'Ruby'
    gemfile:     'Gemfile'
    env:         'ENV'
    jdk:         'JDK'
    otp_release: 'OTP Release'
    php:         'PHP'
    node_js:     'Node.js'
    perl:        'Perl'
    python:      'Python'
    scala:       'Scala'
    compiler:    'Compiler'
    ghc:         'GHC'
    os:          'OS'
    ruby:        'Ruby'
    xcode_sdk:   'Xcode SDK'
    xcode_scheme:'Xcode Scheme'
    d:           'D'
    julia:       'Julia'
    csharp:      'C#'
  }

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

Travis.initializer
  name: 'inject-config'

  initialize: (container, application) ->
    application.register 'config:main', Travis.config, { instantiate: false }

    application.inject('controller', 'config', 'config:main')


Travis.Router.reopen
  didTransition: ->
    @_super.apply @, arguments

    if Travis.config.ga_code
      _gaq.push ['_trackPageview', location.pathname]

Ember.LinkView.reopen
  loadingClass: 'loading_link'

require 'travis/ajax'
require 'travis/adapter'
require 'travis/adapters/env_vars'
require 'travis/adapters/ssh_key'
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
require 'components'

require 'travis/instrumentation'

Travis.setup()
