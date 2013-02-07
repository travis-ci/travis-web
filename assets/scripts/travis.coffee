require 'ext/jquery'
require 'ext/ember/namespace'

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


@Travis = Em.Namespace.create Ember.Evented,
  config:
    api_endpoint: $('meta[rel="travis.api_endpoint"]').attr('href')
    pusher_key:   $('meta[name="travis.pusher_key"]').attr('value')

  CONFIG_KEYS: ['rvm', 'gemfile', 'env', 'jdk', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala', 'compiler']

  ROUTES:
    'profile/:login/me':           ['profile', 'user']
    'profile/:login':              ['profile', 'hooks']
    'profile':                     ['profile', 'hooks']
    'stats':                       ['stats', 'show']
    ':owner/:name/jobs/:id/:line': ['home', 'job']
    ':owner/:name/jobs/:id':       ['home', 'job']
    ':owner/:name/builds/:id':     ['home', 'build']
    ':owner/:name/builds':         ['home', 'builds']
    ':owner/:name/pull_requests':  ['home', 'pullRequests']
    ':owner/:name/branches':       ['home', 'branches']
    ':owner/:name':                ['home', 'current']
    '':                            ['home', 'index']
    '#':                           ['home', 'index']

  QUEUES: [
    { name: 'common',  display: 'Common' }
    { name: 'php',     display: 'PHP, Perl and Python' }
    { name: 'linux',   display: 'Linux' }
    { name: 'rails',   display: 'Rails' }
    { name: 'spree',   display: 'Spree' }
  ]

  INTERVALS: { sponsors: -1, times: -1, updateTimes: 1000 }

  setLocale: (locale) ->
    return unless locale
    I18n.locale = locale
    Travis.set('locale', locale)

  storage: (->
    storage = null
    try
      storage = window.localStorage || throw('no storage')
    catch err
      storage = Storage.create()

    storage
  )()
  default_locale: 'en'
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

  run: (attrs) ->
    location.href = location.href.replace('#!/', '') if location.hash.slice(0, 2) == '#!'

    I18n.fallbacks = true
    Travis.setLocale 'locale', @default_locale

    Ember.run.next this, ->
      app = Travis.App.create(attrs || {})
      # TODO: router expects the classes for controllers on main namespace, so
      #       if we want to keep app at Travis.app, we need to copy that, it would
      #       be ideal to send a patch to ember and get rid of this
      $.each Travis, (key, value) ->
        app[key] = value if value && value.isClass && key != 'constructor'

      @app   = app
      @store = app.store
      $ => app.initialize()

require 'ext/i18n'
require 'travis/ajax'
require 'app'

